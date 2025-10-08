#!/usr/bin/env python3
import os, re, json
ROOT = os.path.dirname(os.path.dirname(__file__))
SHOP_PARTS = os.path.join(ROOT, 'shopParts.js')
COL_DIR = os.path.join(ROOT, 'collections')

def read(p):
    try:
        return open(p, 'r', encoding='utf-8').read()
    except:
        return None

shop_js = read(SHOP_PARTS)
if not shop_js:
    print('ERROR: shopParts.js not found')
    raise SystemExit(2)

m = re.search(r"const\s+COLLECTION_PAGE_MAP\s*=\s*{([\s\S]*?)}", shop_js)
if not m:
    print('ERROR: COLLECTION_PAGE_MAP not found in shopParts.js')
    raise SystemExit(2)
block = m.group(1)
pairs = re.findall(r"['\"]([\w\-\_]+)['\"]\s*:\s*['\"]([^'\"]+)['\"]", block)
mapd = {k:v for k,v in pairs}
print('Found mapped handles:', len(mapd))

files = os.listdir(COL_DIR)
files_set = set(files)

missing = []
mismatch = []

for handle, mapped in mapd.items():
    # expected filename is the last path component
    expected = os.path.basename(mapped)
    if expected not in files_set:
        # try variations
        alt1 = expected.replace('_', '-')
        alt2 = expected.replace('-', '_')
        if alt1 in files_set:
            expected = alt1
        elif alt2 in files_set:
            expected = alt2
        else:
            missing.append((handle, mapped))
            continue
    # read file and look for COLLECTION_HANDLE constant
    path = os.path.join(COL_DIR, expected)
    content = read(path)
    if not content:
        missing.append((handle, mapped))
        continue
    m2 = re.search(r"COLLECTION_HANDLE\s*=\s*['\"]([^'\"]+)['\"]", content)
    if not m2:
        # try other patterns
        m3 = re.search(r"const\s+COLLECTION_HANDLE\s*=\s*['\"]([^'\"]+)['\"]", content)
        if m3:
            val = m3.group(1)
        else:
            val = None
    else:
        val = m2.group(1)
    if val and val != handle:
        mismatch.append((handle, expected, val))

print('\nMissing mapped files:', len(missing))
for h,m in missing[:50]:
    print(' ', h, '->', m)

print('\nMismatched handles inside files:', len(mismatch))
for h,f,v in mismatch[:50]:
    print(' ', h, 'file:', f, 'contains:', v)

if not missing and not mismatch:
    print('\nOK: All mappings exist and handles match.')
else:
    print('\nPlease fix the missing/mismatched files or update shopParts.js mappings.')
