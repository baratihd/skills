/** Offline Chromium regression checks. Node 22+ and local Chrome; no npm packages. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function luminance(color) {
  const channels = color.startsWith('#') ? color.slice(1).match(/../g).map(value => parseInt(value, 16)) : color.match(/[\d.]+/g).slice(0, 3).map(Number);
  const rgb = channels.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(foreground, background) {
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
assert.equal(contrast('#000000', '#ffffff'), 21);

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(root, process.env.THEME_SITE_DIR || '_site');
const faPage = process.env.THEME_FA_PAGE || '/product/';
const enPage = process.env.THEME_EN_PAGE || '/technical/';
const output = resolve(root, '.automation/theme-check');
await mkdir(output, { recursive: true });
await rm(resolve(output, "report.json"), { force: true });
const profile = await mkdtemp(resolve(output, 'profile-'));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(site, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!path.startsWith(site + sep)) throw new Error('Outside site');
    response.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream');
    let data = await readFile(path);
    if (pathname.endsWith('/') && new URL(request.url, 'http://localhost').searchParams.has('font-missing')) {
      // An isolated missing-font fixture, independent of fonts installed on the test host.
      data = Buffer.from(data.toString().replace(/(<script id="documentation-font-config" type="application\/json">)([\s\S]*?)(<\/script>)/, (_, start, value, end) => {
        const config = JSON.parse(value);
        const option = config.fa.options.find(item => item.id === 'b-nazanin');
        option.font_names = ['__DocumentationMissingFontFixture__'];
        option.family = '"__DocumentationMissingFontFixture__", serif';
        return start + JSON.stringify(config) + end;
      }));
    }
    response.end(data);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const chrome = spawn(process.env.CHROME || '/usr/bin/google-chrome', [
  '--headless', '--no-sandbox', '--disable-gpu', '--remote-debugging-pipe',
  '--disable-background-networking', '--disable-component-update', '--disable-sync',
  '--no-first-run', '--disable-default-apps', '--no-proxy-server',
  '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
let id = 0;
let buffer = '';
const pending = new Map();
const events = new Map();
const errors = [];
const blocked = [];
const snapshots = [];
function command(method, params = {}, sessionId) {
  return new Promise((accept, reject) => {
    const current = ++id;
    const timer = setTimeout(() => { pending.delete(current); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(current, { accept, reject, timer });
    chrome.stdio[3].write(JSON.stringify({ id: current, method, params, sessionId }) + '\0');
  });
}
chrome.stdio[4].on('data', chunk => {
  buffer += chunk.toString();
  let end;
  while ((end = buffer.indexOf('\0')) !== -1) {
    const message = JSON.parse(buffer.slice(0, end));
    buffer = buffer.slice(end + 1);
    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) continue;
      pending.delete(message.id);
      clearTimeout(waiter.timer);
      if (message.error) waiter.reject(new Error(JSON.stringify(message.error)));
      else waiter.accept(message.result);
    } else events.get(message.method)?.(message.params, message.sessionId);
  }
});
chrome.on('error', error => {
  for (const waiter of pending.values()) { clearTimeout(waiter.timer); waiter.reject(error); }
  pending.clear();
});
try {
  const { targetId } = await command('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await command('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => command(method, params, sessionId);
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  await cdp('DOM.enable');
  await cdp('CSS.enable');
  await cdp('Network.enable');
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  events.set('Fetch.requestPaused', async event => {
    if (event.request.url.startsWith(origin + '/') || event.request.url.startsWith('data:')) {
      await cdp('Fetch.continueRequest', { requestId: event.requestId });
    } else {
      blocked.push(event.request.url);
      await cdp('Fetch.failRequest', { requestId: event.requestId, errorReason: 'BlockedByClient' });
    }
  });
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
  events.set('Network.responseReceived', event => {
    if (event.response.status >= 400) errors.push(`${event.response.status} ${event.response.url}`);
  });
  await command('Browser.grantPermissions', { origin, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] });
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 80; attempt++) {
      if (await evaluate(expression)) return;
      await new Promise(done => setTimeout(done, 50));
    }
    assert.fail(`Not ready: ${expression}; state=${JSON.stringify(await evaluate("({url:location.href, ready:document.readyState, body:document.body.innerText.slice(0,120), palette:window.__md_get?.(\"__palette\")})"))}; errors=${JSON.stringify(errors)}; blocked=${JSON.stringify(blocked)}`);
  };
  const os = async value => {
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value }] });
  };
  const viewport = (width, height = 1000) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  const navigate = async path => {
    await cdp('Page.navigate', { url: origin + path });
    await waitFor('document.readyState === "complete" && !!document.querySelector(".documentation-page") && !!window.__md_get("__palette")');
  };
  const renderedFonts = async selector => {
    await evaluate('document.fonts.ready');
    const { root } = await cdp('DOM.getDocument');
    const { nodeId } = await cdp('DOM.querySelector', { nodeId: root.nodeId, selector });
    assert(nodeId, `Font witness exists: ${selector}`);
    return (await cdp('CSS.getPlatformFontsForNode', { nodeId })).fonts.filter(font => font.glyphCount > 0);
  };
  const scheme = () => evaluate('document.body.dataset.mdColorScheme');
  const select = async index => {
    await evaluate(`document.querySelector('#__palette_${index}').click()`);
    await waitFor(`window.__md_get('__palette').index === ${index}`);
  };
  const shot = async name => {
    await evaluate('document.fonts.ready');
    await new Promise(done => setTimeout(done, 120));
    const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile(resolve(output, name + '.png'), Buffer.from(data, 'base64'));
    snapshots.push(name + '.png');
  };
  await viewport(1440);
  await os('dark');
  await navigate(faPage);
  await waitFor('document.body.dataset.mdColorScheme === "slate"');
  assert.equal(await evaluate('window.__md_get("__palette").index'), 0, 'First visit defaults to System');
  await os('light');
  await waitFor('document.body.dataset.mdColorScheme === "default"');
  await select(2);
  assert.equal(await scheme(), 'slate');
  await os('dark');
  await os('light');
  assert.equal(await scheme(), 'slate', 'Manual dark ignores OS light');
  await navigate(enPage);
  assert.equal(await scheme(), 'slate', 'Manual mode persists across navigation');
  await cdp('Page.reload');
  await waitFor('document.readyState === "complete" && document.body.dataset.mdColorScheme === "slate"');
  assert.equal(await evaluate('window.__md_get("__palette").index'), 2);
  await select(1);
  await os('dark');
  assert.equal(await scheme(), 'default', 'Manual light ignores OS dark');
  await select(0);
  await waitFor('document.body.dataset.mdColorScheme === "slate"');
  await os('light');
  await waitFor('document.body.dataset.mdColorScheme === "default"');
  // A disabled script path checks that OS dark is styled before the native bundle runs.
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  await os('dark');
  await cdp('Page.navigate', { url: origin + faPage });
  await waitFor('document.readyState === "complete"');
  assert.equal(await evaluate('getComputedStyle(document.body).getPropertyValue("--docs-bg").trim()'), '#0b1220');
  await cdp('Emulation.setScriptExecutionDisabled', { value: false });
  for (const [path, language] of [[faPage, 'fa'], [enPage, 'en']]) {
    await navigate(path);
    for (const [index, appearance] of [[1, 'light'], [2, 'dark']]) {
      await select(index);
      const layout = await evaluate(`(() => {
        const page = document.querySelector('.documentation-page');
        const nav = document.querySelector('.md-sidebar--primary').getBoundingClientRect();
        const content = document.querySelector('.md-content').getBoundingClientRect();
        const toc = document.querySelector('.md-sidebar--secondary').getBoundingClientRect();
        const css = getComputedStyle(document.body);
        return { lang: page.lang, dir: getComputedStyle(page).direction, nav: nav.x, content: content.x, toc: toc.x,
          overflow: document.documentElement.scrollWidth > innerWidth,
          colors: ['--docs-text','--docs-muted','--docs-primary','--docs-accent','--docs-success','--docs-warning','--docs-danger','--docs-info','--docs-bg','--docs-surface','--docs-code'].map(name => css.getPropertyValue(name).trim()),
          breadcrumb: !!document.querySelector('.md-path'),
          radios: [...document.querySelectorAll('[name="__palette"]')].every(input => !!input.getAttribute('aria-label')) };
      })()`);
      assert.equal(layout.lang, language);
      assert.equal(layout.dir, language === 'en' ? 'ltr' : 'rtl');
      assert(layout.nav < layout.content && layout.content < layout.toc, 'Navigation left / content center / ToC right');
      assert(!layout.overflow, 'No viewport overflow on desktop');
      assert(layout.radios);
      if (path.split("/").filter(Boolean).length > 1) assert(layout.breadcrumb);
      for (const foreground of layout.colors.slice(0, 8)) {
        for (const background of layout.colors.slice(8)) {
          assert(contrast(foreground, background) >= 4.5, `${foreground} on ${background} contrast`);
        }
      }
      await shot(`${language}-${appearance}-desktop`);
    }
    await viewport(768);
    await shot(`${language}-dark-tablet`);
    assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
    await viewport(390, 844);
    await shot(`${language}-dark-mobile`);
    assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Mobile horizontal overflow');
    await evaluate('document.querySelector("#__drawer").checked = true');
    assert(await evaluate('document.querySelector(".md-sidebar--primary").getBoundingClientRect().width > 0'));
    await evaluate('document.querySelector("#__drawer").checked = false');
    await viewport(1440);
  }
  await navigate(enPage);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert(await evaluate('document.activeElement.classList.contains("md-skip")'), 'Tab reaches skip-to-content');
  assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
  await evaluate('document.querySelector("#__palette_2").focus()');
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor('window.__md_get("__palette").index === 0');
  await evaluate('document.querySelector(".md-search__input").focus()');
  await cdp('Input.insertText', { text: 'contract' });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 't', code: 'KeyT', windowsVirtualKeyCode: 84 });
  await waitFor('document.querySelectorAll(".md-search-result__item").length > 0');
  await evaluate('document.querySelector("#__search").checked = false');
  await evaluate('document.querySelector("pre").scrollIntoView()');
  await waitFor('!!document.querySelector("[data-md-type=copy]")');
  assert.equal(await evaluate('getComputedStyle(document.querySelector("pre")).direction'), 'ltr');
  await evaluate('document.querySelector("[data-md-type=copy]").click()');
  await waitFor('navigator.clipboard.readText().then(text => text.length > 0)');
  assert(await evaluate(`document.fonts.load('16px "JetBrains Mono"').then(fonts => fonts.length > 0 && fonts.every(font => font.status === "loaded"))`), "Local code font loaded");
  for (const [index, appearance] of [[1, 'light'], [2, 'dark']]) {
    await select(index);
    const colors = await evaluate(`(() => {
      const code = document.querySelector('.highlight code');
      const background = getComputedStyle(code).backgroundColor;
      return [...new Set([...code.querySelectorAll('span')].filter(span => span.textContent.trim()).map(span => getComputedStyle(span).color))].map(color => [color, background]);
    })()`);
    for (const [foreground, background] of colors) {
      assert(contrast(foreground, background) >= 4.5, `Rendered syntax ${foreground} on ${background}`);
    }
    await shot(`en-code-${appearance}`);
  }
  if (process.env.THEME_COMPONENTS_PAGE) {
    await navigate(process.env.THEME_COMPONENTS_PAGE);
    for (const status of ['verified', 'inferred', 'missing', 'deprecated', 'breaking']) {
      assert(await evaluate(`!!document.querySelector('.admonition.${status} .admonition-title')`));
    }
    assert(await evaluate('document.querySelectorAll(".tabbed-labels label").length >= 2'));
    await evaluate('document.querySelectorAll(".tabbed-labels label")[1].click()');
    assert(await evaluate('document.querySelectorAll(".tabbed-set input")[1].checked'));
    assert(await evaluate('!!document.querySelector(".task-list-item input:checked")'));
    for (const [index, appearance] of [[1, 'light'], [2, 'dark']]) {
      await select(index);
      await shot(`components-${appearance}`);
    }
  }
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.querySelector("a")).transitionDuration'), '0s');
  // Font preferences are independent, scoped to this site, and persist by ID.
  const chooseFont = (language, value) => evaluate(`(() => {
    const select = document.querySelector('[data-docs-font="${language}"]');
    select.value = '${value}';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await navigate(faPage);
  assert(await evaluate('!!document.querySelector(".docs-font-settings summary")'));
  await chooseFont('fa', 'amiri');
  await waitFor('document.querySelector("#docs-font-status-fa").dataset.fontState === "loaded"');
  assert((await renderedFonts('.documentation-page h1')).some(font => font.familyName === 'Amiri' && font.isCustomFont), 'Persian glyphs actually rendered by self-hosted Amiri');
  await chooseFont('en', 'times-new-roman');
  assert(await evaluate('getComputedStyle(document.querySelector(".documentation-page")).fontFamily.includes("Amiri")'));
  await navigate(enPage);
  assert.equal(await evaluate('document.querySelector("#docs-font-fa").value'), 'amiri');
  assert.equal(await evaluate('document.querySelector("#docs-font-en").value'), 'times-new-roman');
  assert(await evaluate('getComputedStyle(document.querySelector(".documentation-page")).fontFamily.includes("Times New Roman")'));
  await evaluate(`(() => {
    const aside = document.createElement('aside');
    aside.className = 'admonition';
    aside.id = 'font-inheritance-probe';
    aside.innerHTML = '<p>English font inheritance probe</p><input aria-label="English probe">';
    document.querySelector('.documentation-page').append(aside);
  })()`);
  for (const selector of ['#font-inheritance-probe', '#font-inheritance-probe input']) {
    assert(await evaluate(`getComputedStyle(document.querySelector('${selector}')).fontFamily.includes('Times New Roman')`), `English descendants use English font: ${selector}`);
  }
  await evaluate('document.querySelector("#font-inheritance-probe").remove()');

  assert(await evaluate('getComputedStyle(document.querySelector("code")).fontFamily.includes("JetBrains Mono")'));
  await cdp('Page.reload');
  await waitFor('document.readyState === "complete" && !!document.querySelector("#docs-font-en")');
  assert.equal(await evaluate('document.querySelector("#docs-font-en").value'), 'times-new-roman');
  await evaluate('document.querySelector(".docs-font-settings summary").focus()');
  assert(await evaluate('document.activeElement.matches(".docs-font-settings summary")'));
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: "\r" });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor('document.querySelector(".docs-font-settings").open');
  await shot('font-settings-en');
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  assert(await evaluate('!document.querySelector(".docs-font-settings").open'));
  await navigate(faPage);
  await chooseFont('fa', 'b-nazanin');
  assert(await evaluate('getComputedStyle(document.querySelector(".documentation-page")).fontFamily.includes("B Nazanin")'));
  await viewport(390, 844);
  await evaluate('document.querySelector(".docs-font-settings summary").click()');
  const bounds = await evaluate(`(() => { const rect = document.querySelector('.docs-font-settings__panel').getBoundingClientRect(); return { left: rect.left, right: rect.right, bottom: rect.bottom }; })()`);
  assert(bounds.left >= 0 && bounds.right <= 390 && bounds.bottom <= 844, 'Font panel fits mobile');
  await shot('font-settings-fa-mobile');
  await evaluate('document.querySelector("[data-docs-font-reset]").click()');
  assert.equal(await evaluate('document.querySelector("#docs-font-fa").value'), 'default');
  assert.equal(await evaluate('document.querySelector("#docs-font-en").value'), 'default');
  await viewport(1440);
  await navigate(enPage);
  assert(await evaluate('getComputedStyle(document.querySelector(".documentation-page")).fontFamily.includes("Inter")'));
  await evaluate(`localStorage.setItem(Object.keys(localStorage).find(key => key.endsWith(':documentation-fonts')), '{invalid')`);
  await cdp('Page.reload');
  await waitFor('document.readyState === "complete" && !!document.querySelector("#docs-font-en")');
  assert.equal(await evaluate('document.querySelector("#docs-font-en").value'), 'default', 'Corrupt saved data falls back');
  await evaluate('document.querySelector("[data-docs-font-reset]").click()');
  await evaluate(`localStorage.setItem(Object.keys(localStorage).find(key => key.endsWith(':documentation-fonts')), JSON.stringify({ fa: 'removed-font', en: 'unknown-font' }))`);
  await navigate(faPage);
  assert.equal(await evaluate('document.querySelector("#docs-font-fa").value'), 'default', 'Removed font IDs fall back');
  const { identifier: storageBlocker } = await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `
    for (const method of ['getItem', 'setItem']) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function(key, ...args) {
        if (key.endsWith(':documentation-fonts')) throw new DOMException('Blocked', 'SecurityError');
        return original.call(this, key, ...args);
      };
    }
  ` });
  await navigate(faPage);
  await chooseFont('fa', 'amiri');
  assert(await evaluate('getComputedStyle(document.querySelector(".documentation-page")).fontFamily.includes("Amiri")'));
  assert(await evaluate('!document.querySelector(".docs-font-settings__storage").hidden'), 'Storage failure is visible');
  await cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier: storageBlocker });
  await navigate(faPage);
  await evaluate('document.querySelector("[data-docs-font-reset]").click()');
  await navigate(enPage);
  await waitFor('document.querySelector("#docs-font-status-en").dataset.fontState === "loaded"');
  assert((await renderedFonts('.documentation-page h1')).some(font => font.familyName.includes('Inter') && font.isCustomFont), 'English glyphs actually rendered by self-hosted Inter');
  await navigate(faPage);
  await waitFor('document.querySelector("#docs-font-status-fa").dataset.fontState === "loaded"');
  assert((await renderedFonts('.documentation-page h1')).some(font => font.familyName.includes('Vazirmatn') && font.isCustomFont), 'Default Persian font really rendered');
  await navigate(faPage + '?font-missing=1');
  await chooseFont('fa', 'b-nazanin');
  await waitFor('document.querySelector("#docs-font-status-fa").dataset.fontState === "missing"');
  assert(await evaluate('!document.querySelector("#docs-font-status-fa").hidden && document.querySelector("#docs-font-status-fa").textContent.includes("بارگذاری نشد")'));
  assert(!(await renderedFonts('.documentation-page h1')).some(font => font.familyName === '__DocumentationMissingFontFixture__'), 'Missing font has real fallback, not claimed as loaded');
  await evaluate('document.querySelector(".docs-font-settings summary").click()');
  await shot('font-missing-warning');
  await navigate(faPage);
  await evaluate('document.querySelector("[data-docs-font-reset]").click()');
  assert.deepEqual(errors, [], 'Browser exceptions and failed assets');
  assert.deepEqual(blocked, [], 'Unexpected external requests');
  const report = { passed: true, browser: (await command('Browser.getVersion')).product, screenshots: snapshots,
    checks: ['native modes', 'first-visit system', 'live OS changes', 'manual override', 'navigation/reload persistence', 'pre-bundle dark appearance', 'RTL/LTR', 'desktop columns', 'tablet/mobile overflow', 'Tab skip link focus and palette Enter', 'English search', 'copy clipboard', 'local mono font', 'semantic token and sampled syntax contrast >= 4.5', 'reduced motion', 'no external requests or asset errors', 'independent font choices', 'actual rendered glyph fonts via CDP', 'English descendant font inheritance', 'missing-font status', 'font navigation/reload persistence', 'font reset', 'corrupt/removed font preference fallback', 'storage denial keeps current-page font changes and shows warning', 'font menu keyboard and mobile bounds'],
    limitations: ['Not a full WCAG audit', 'Vazirmatn and Inter loading is not asserted', 'No Mermaid rendering assertion is included', 'Persian search has no stemming guarantee'] };
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(`Theme checks passed; ${snapshots.length} screenshots in ${output}\n`);
} finally {
  try { await command('Browser.close'); } catch { chrome.kill(); }
  await new Promise(done => chrome.exitCode !== null ? done() : chrome.once('exit', done));
  server.closeAllConnections();
  await new Promise(done => server.close(done));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
