"""Assign actual page language and direction without forcing English docs into RTL."""


def on_page_content(html, page, config, files):
    path = page.file.src_uri.replace('\\', '/')
    is_english = path.startswith(('technical/', 'quality/'))
    language, direction = ('en', 'ltr') if is_english else ('fa', 'rtl')
    return f'<div class="documentation-page lang-{language}" lang="{language}" dir="{direction}">{html}</div>'
