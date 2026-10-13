import re,os,json,hashlib
D=os.path.dirname(os.path.abspath(__file__))
rd=lambda f:open(os.path.join(D,f),encoding='utf8').read()
head=rd('head.html');js=''.join(rd(f) for f in ['fig.js','fig2.js','figs.js','prog2.js','app.js'])
# 1) artifact page (Claude adds its own <html>/<head> skeleton)
open(os.path.join(D,'gyri.html'),'w',encoding='utf8').write(head+'\n<script>\n'+js+'\n</script>\n')
# 2) standalone PWA
h=re.sub(r'<link rel="preconnect"[^>]*>\s*','',head)
h=re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>','<link rel="stylesheet" href="fonts.css">',h)
title=re.search(r'<title>.*?</title>',h).group(0);h=h.replace(title,'',1)
reset='''<style>
:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
html,body{margin:0}body{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent;overscroll-behavior-y:none}
img{max-width:100%}[hidden]{display:none!important}button,label.btn{touch-action:manipulation;-webkit-user-select:none;user-select:none}
</style>'''
fonts=sorted(os.listdir(os.path.join(D,'pwa','fonts')))
icons=sorted(os.listdir(os.path.join(D,'pwa','icons')))
import subprocess,shutil
ES=shutil.which('esbuild') or next((p for p in [os.path.join(D,'mn','node_modules','.bin','esbuild')] if os.path.exists(p)),None)
def mini(src,loader):
    if not ES:return src
    r=subprocess.run([ES,'--minify','--loader='+loader,'--target=safari14','--charset=utf8'],input=src.encode(),capture_output=True)
    return r.stdout.decode() if r.returncode==0 and r.stdout else src
jsm=mini(js,'js')
h=re.sub(r'<style>(.*?)</style>',lambda m:'<style>'+mini(m.group(1),'css')+'</style>',h,flags=re.S)
PRE=''.join(f'<link rel="preload" href="fonts/{f}" as="font" type="font/woff2" crossorigin>\n' for f in ['oswald-cyrillic-600.woff2','oswald-latin-600.woff2','roboto-condensed-cyrillic-400.woff2','roboto-condensed-latin-400.woff2'] if f in fonts)
ver=hashlib.sha1((h+js).encode()).hexdigest()[:10]
doc=f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
{title}
<meta name="theme-color" content="#121212">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Чугун">
<meta name="format-detection" content="telephone=no">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="icons/favicon-32.png">
{reset}
</head>
<body>
{h}
<script>
{jsm}
</script>
<script>
if("serviceWorker" in navigator){{addEventListener("load",()=>{{navigator.serviceWorker.register("sw.js").catch(()=>{{}})}})}}
</script>
</body>
</html>
'''
open(os.path.join(D,'pwa','index.html'),'w',encoding='utf8').write(doc)
man={"name":"Чугун","short_name":"Чугун","description":"Утренние тренировки с гирями","lang":"ru","dir":"ltr","id":"./","start_url":"./","scope":"./",
 "display":"standalone","orientation":"portrait","background_color":"#121212","theme_color":"#121212",
 "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},
          {"src":"icons/icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
open(os.path.join(D,'pwa','manifest.webmanifest'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
shell=["./","index.html","manifest.webmanifest","fonts.css"]+["fonts/"+f for f in fonts]+["icons/"+f for f in icons]
sw=f'''// Чугун — service worker. Версия меняется при каждой сборке.
const V="chugun-{ver}";
const SHELL={json.dumps(shell)};
self.addEventListener("install",e=>{{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))}});
self.addEventListener("activate",e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))}});
self.addEventListener("fetch",e=>{{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==="navigate"){{e.respondWith(fetch(r).then(res=>{{const cp=res.clone();caches.open(V).then(c=>c.put("index.html",cp));return res}}).catch(()=>caches.match("index.html")));return}}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{{if(res.ok){{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}}return res}})))}});
'''
open(os.path.join(D,'pwa','sw.js'),'w',encoding='utf8').write(sw)
open(os.path.join(D,'pwa','.nojekyll'),'w').write('')
open(os.path.join(D,'pwa','README.md'),'w',encoding='utf8').write('# Чугун\n\nЛичное приложение для утренних тренировок с гирями. Открыть: https://andreioshanin-dot.github.io/chugun/\n\nНа iPhone: открыть ссылку в Safari → «Поделиться» → «На экран „Домой“».\n')
print('built',ver,len(doc)//1024,'KB')
