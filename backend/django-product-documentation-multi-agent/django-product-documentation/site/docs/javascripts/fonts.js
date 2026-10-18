/* Apply only configured families; saved IDs never become arbitrary CSS. */
(() => {
  const config = JSON.parse(document.getElementById('documentation-font-config').textContent);
  const key = new URL(typeof __md_scope === 'undefined' ? '.' : __md_scope, location.href).pathname + ':documentation-fonts';
  let saved = {};
  let storageAvailable = true;
  try {
    const stored = localStorage.getItem(key);
    try { saved = JSON.parse(stored || '{}') || {}; } catch { /* Ignore malformed preferences. */ }
  } catch {
    storageAvailable = false;
  }
  const selected = {};
  function apply(language, id) {
    const settings = config[language];
    const option = settings.options.find(item => item.id === id)
      || settings.options.find(item => item.id === settings.default)
      || settings.options[0];
    selected[language] = option.id;
    document.documentElement.style.setProperty(`--docs-font-${language}`, option.family);
  }
  for (const language of Object.keys(config)) apply(language, saved[language]);
  document.addEventListener('DOMContentLoaded', () => {
    const template = document.getElementById('documentation-font-settings');
    const header = document.querySelector('.md-header__inner');
    header.insertBefore(template.content.cloneNode(true), header.querySelector('[data-md-component="palette"]'));
    const panel = header.querySelector('.docs-font-settings');
    const selects = [...panel.querySelectorAll('[data-docs-font]')];
    const warning = panel.querySelector('.docs-font-settings__storage');
    async function checkFont(language) {
      const id = selected[language];
      const option = config[language].options.find(item => item.id === id);
      const status = panel.querySelector(`#docs-font-status-${language}`);
      status.hidden = true;
      status.dataset.fontState = 'loading';
      let loaded = false;
      for (const name of option.font_names) {
        try {
          const faces = await document.fonts.load(`16px ${JSON.stringify(name)}`, language === 'fa' ? 'متن نمونه' : 'Sample text');
          if (!faces.length) await new FontFace('__docs_font_probe', `local(${JSON.stringify(name)})`).load();
          loaded = true;
          break;
        } catch { /* A configured family may have neither a working asset nor a local installation. */ }
      }
      if (selected[language] !== id) return;
      status.textContent = loaded ? '' : `فونت «${option.label}» بارگذاری نشد؛ فونت جایگزین نمایش داده می‌شود. برای اعمال این فونت، فایل آن باید نصب یا در سایت میزبانی شود.`;
      status.hidden = loaded;
      status.dataset.fontState = loaded ? 'loaded' : 'missing';
    }
    function persist() {
      try {
        localStorage.setItem(key, JSON.stringify(selected));
        storageAvailable = true;
      } catch {
        storageAvailable = false;
      }
      warning.hidden = storageAvailable;
    }
    for (const select of selects) {
      select.value = selected[select.dataset.docsFont];
      checkFont(select.dataset.docsFont);
      select.addEventListener('change', () => {
        apply(select.dataset.docsFont, select.value);
        checkFont(select.dataset.docsFont);
        persist();
      });
    }
    warning.hidden = storageAvailable;
    panel.querySelector('[data-docs-font-reset]').addEventListener('click', () => {
      for (const select of selects) {
        apply(select.dataset.docsFont, config[select.dataset.docsFont].default);
        select.value = selected[select.dataset.docsFont];
        checkFont(select.dataset.docsFont);
      }
      persist();
    });
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        panel.open = false;
        panel.querySelector('summary').focus();
      }
    });
    document.addEventListener('click', event => {
      if (!panel.contains(event.target)) panel.open = false;
    });
  });
})();
