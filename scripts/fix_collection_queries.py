#!/usr/bin/env python3
import os, re
ROOT = os.path.dirname(os.path.dirname(__file__))
COL_DIR = os.path.join(ROOT, 'collections')

changed = []
for entry in os.listdir(COL_DIR):
    path = os.path.join(COL_DIR, entry)
    if not os.path.isfile(path):
        continue
    try:
        with open(path, 'r', encoding='utf-8') as f:
            txt = f.read()
    except Exception as e:
        print(f"SKIP {entry}: can't read ({e})")
        continue
    orig = txt
    # replace collection(handle: $handle) -> collectionByHandle(handle: $handle)
    txt = re.sub(r'collection\s*\(\s*handle\s*:\s*\$handle\s*\)', 'collectionByHandle(handle: $handle)', txt, flags=re.IGNORECASE)
    # replace any occurrence of data.collection -> data.collectionByHandle
    txt = txt.replace('data.collection', 'data.collectionByHandle')
    # also replace check if (!data.collection) patterns (in case spaced differently)
    txt = re.sub(r'if\s*\(\s*!\s*data\.collectionByHandle\s*\)', 'if (!data.collectionByHandle)', txt)
    # replace assignment collectionData = data.collectionByHandle etc already handled by replace

    if txt != orig:
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(txt)
            changed.append(entry)
        except Exception as e:
            print(f"ERROR writing {entry}: {e}")

print('Files changed:', len(changed))
for c in changed:
    print('  ', c)

if not changed:
    print('No changes needed.')
else:
    print('Done. Please re-open collection pages to verify product loading in your browser.')
