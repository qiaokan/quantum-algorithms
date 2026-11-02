"""Check built local HTML links, assets, fragments, and duplicate IDs. No network.
Run from repository root after building: python3 scripts/audit-links.py
"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path('dist').resolve()

class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.feed(filename.read_text())

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key == 'id' and value is not None:
                self.ids.append(value)
            if key in ('href', 'src') and value is not None:
                self.links.append(value)

pages = {p: Page(p) for p in ROOT.rglob('*.html')}
errors = []
checked = 0
if not pages:
    errors.append('No built HTML found; run npm run build first.')
for filename, page in pages.items():
    relative = filename.relative_to(ROOT)
    for anchor, count in Counter(page.ids).items():
        if count > 1:
            errors.append(f'{relative}: duplicate id {anchor}')
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        checked += 1
        target = (ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/')
                  else filename.parent / unquote(url.path) if url.path else filename).resolve()
        if not target.is_relative_to(ROOT):
            errors.append(f'{relative}: link escapes build: {link}')
            continue
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file():
            errors.append(f'{relative}: missing local target {link}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{relative}: missing fragment {link}')
print(f'{len(pages)} HTML pages; {checked} local links/assets; {len(errors)} errors')
for error in errors:
    print(error)
sys.exit(bool(errors))
