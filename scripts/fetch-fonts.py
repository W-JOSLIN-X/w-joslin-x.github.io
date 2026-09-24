"""One-time vendoring of upstream OFL fonts. Never runs during a normal build."""
from pathlib import Path
import requests, re, json, concurrent.futures, hashlib, sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/fonts'
OUT.mkdir(parents=True, exist_ok=True)
def get(url):
    r=requests.get(url, timeout=90); r.raise_for_status(); return r.content
def google(name, slug):
    css_url='https://fonts.googleapis.com/css2?family='+name.replace(' ','+')+':wght@400;700&display=swap'
    if name=='Klee One': css_url=css_url.replace('400;700','400;600')
    response=requests.get(css_url,headers={'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'},timeout=60)
    response.raise_for_status(); css=response.text
    urls=set(re.findall(r'url\((https://[^)]+)\)',css))
    def asset(url):
        filename=hashlib.sha256(url.encode()).hexdigest()[:20]+'.woff2'
        file=OUT/filename
        if not file.exists(): file.write_bytes(get(url))
        return url,'/fonts/'+filename
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for url,local in pool.map(asset,urls): css=css.replace(url,local)
    (OUT/(slug+'.css')).write_text(css,encoding='utf-8')
    license_url='https://raw.githubusercontent.com/google/fonts/main/ofl/'+name.lower().replace(' ','')+'/OFL.txt'
    (OUT/(slug+'-OFL.txt')).write_bytes(get(license_url))
    print(slug,len(urls),'assets',flush=True)
    return {'name':name,'css':css_url,'license':license_url}

if __name__ == '__main__':
    sources=[]
    for name in ['Nunito','Klee One','Noto Sans','Noto Sans SC','Noto Sans JP','Noto Serif','Noto Serif SC','Noto Serif JP']:
        sources.append(google(name,name.lower().replace(' ','-')))
    cache=ROOT/'.generated/font-sources';cache.mkdir(parents=True,exist_ok=True)
    for name,url in [
        ('rounded.7z','https://github.com/CyanoHao/Resource-Han-Rounded/releases/download/v0.990/RHR-CN-0.990.7z'),
        ('wenkai.ttf','https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/fonts/TTF/LXGWWenKai-Regular.ttf')]:
        file=cache/name
        if not file.exists(): file.write_bytes(get(url))
        sources.append({'name':name,'source':url});print(name,file.stat().st_size,flush=True)
    for name,url in [
        ('rounded','https://raw.githubusercontent.com/CyanoHao/Resource-Han-Rounded/master/OFL-License.txt'),
        ('wenkai','https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/OFL.txt'),
        ('zen-maru','https://raw.githubusercontent.com/google/fonts/main/ofl/zenmarugothic/OFL.txt')]:
        (OUT/(name+'-OFL.txt')).write_bytes(get(url))
    (OUT/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2),encoding='utf-8')
    sys.path.insert(0,str(ROOT/'.generated/python-deps'))
    import py7zr
    with py7zr.SevenZipFile(cache/'rounded.7z') as archive:
        names=archive.getnames();print(names,flush=True)
        targets=[n for n in names if 'Regular' in n and n.endswith('.ttf')]
        archive.extract(path=cache/'rounded', targets=targets)
