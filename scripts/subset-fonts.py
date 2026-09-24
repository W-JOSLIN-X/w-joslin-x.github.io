"""One-time, reproducible WOFF2 sharding; output is vendored, no Python needed to build."""
from pathlib import Path
import sys, logging, concurrent.futures, json
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.generated/python-deps'))
from fontTools import subset
from fontTools.ttLib import TTFont
logging.getLogger('fontTools').setLevel(logging.ERROR)
OUT=ROOT/'public/fonts'
COMMON=set(range(0x20,0x100)) | set(range(0x3000,0x3100))
for base in ['content/posts','src']:
    for p in (ROOT/base).rglob('*'):
        if p.suffix in ['.md','.ts','.astro']:
            COMMON.update(map(ord,p.read_text(encoding='utf-8',errors='ignore')))
def unicode_ranges(chars):
    spans=[]
    for c in sorted(chars):
        if spans and c==spans[-1][1]+1:spans[-1][1]=c
        else:spans.append([c,c])
    return ','.join(f'U+{a:X}' if a==b else f'U+{a:X}-{b:X}' for a,b in spans)

def convert(job):
    path,family,weight,slug=job
    # WOFF2 glyph reconstruction is costly: decode only once, never per shard.
    if path.suffix=='.woff2':
        cached=ROOT/'.generated/font-sources'/f'{slug}-decoded.ttf'
        if not cached.exists():
            decoded=TTFont(path);decoded.flavor=None;decoded.save(cached)
        path=cached
    supported=set(TTFont(path).getBestCmap())
    common=supported & COMMON; rest=sorted(supported-common)
    groups=[sorted(common)]+[rest[i:i+512] for i in range(0,len(rest),512)]
    css=[]; sizes=[]
    for i,chars in enumerate(groups):
        if not chars:continue
        name=f'{slug}-{i}.woff2';target=OUT/name
        if not target.exists() or not set(chars).issubset(TTFont(target).getBestCmap()):
            font=TTFont(path);options=subset.Options();options.flavor='woff2';options.recalc_timestamp=False
            sub=subset.Subsetter(options=options);sub.populate(unicodes=chars);sub.subset(font)
            for record in font['name'].names:
                if record.nameID in [1,4,6]:record.string=family.encode(record.getEncoding(),errors='replace')
            font.flavor='woff2';font.save(target)
        sizes.append(target.stat().st_size)
        unicode=unicode_ranges(chars)
        css.append(f'@font-face{{font-family:"{family}";font-style:normal;font-weight:{weight};font-display:swap;src:url("/fonts/{name}") format("woff2");unicode-range:{unicode};}}')
    (OUT/(slug+'.css')).write_text('\n'.join(css),encoding='utf-8')
    print(slug,'shards',len(groups),'first',sizes[0],'total',sum(sizes),flush=True)
    return {'name':slug,'shards':len(groups),'coreBytes':sizes[0],'totalBytes':sum(sizes)}
if __name__=='__main__':
    jobs=[(ROOT/'src/assets/fonts/ZenMaruGothic-Medium.woff2','RoxyMaru',500,'maru'),
          (ROOT/'src/assets/fonts/loli.woff2','RoxyLoli',400,'loli'),
          (ROOT/'.generated/font-sources/wenkai.ttf','RoxyWenkai',400,'wenkai'),
          (ROOT/'.generated/font-sources/rounded/ResourceHanRoundedCN-Regular.ttf','RoxyRounded',400,'rounded')]
    with concurrent.futures.ProcessPoolExecutor(max_workers=4) as pool: report=list(pool.map(convert,jobs))
    (OUT/'original.css').write_text((OUT/'maru.css').read_text()+'\n'+(OUT/'loli.css').read_text(),encoding='utf-8')
    (OUT/'subset-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
