if(!self.define){const s=s=>{"require"!==s&&(s+=".js");let l=Promise.resolve();return t[s]||(l=new Promise(async l=>{if("document"in self){const t=document.createElement("script");t.src=s,document.head.appendChild(t),t.onload=l}else importScripts(s),l()})),l.then(()=>{if(!t[s])throw new Error(`Module ${s} didn’t register its module`);return t[s]})},l=(l,t)=>{Promise.all(l.map(s)).then(s=>t(1===s.length?s[0]:s))},t={require:Promise.resolve(l)};self.define=(l,n,u)=>{t[l]||(t[l]=Promise.resolve().then(()=>{let t={};const i={uri:location.origin+l.slice(1)};return Promise.all(n.map(l=>{switch(l){case"exports":return t;case"module":return i;default:return s(l)}})).then(s=>{const l=u(...s);return t.default||(t.default=l),t})}))}}define("./service-worker.js",["./workbox-69b5a3b7"],(function(s){"use strict";self.addEventListener("message",s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()}),s.precacheAndRoute([{url:"/stadt-land-fluss/index.html",revision:"5a99c00e3fb0dca461238f45d64f57c2"},{url:"/stadt-land-fluss/static/css/11.2e040679.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/12.aa9448b0.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/13.1f20bee0.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/14.f161706c.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/15.f161706c.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/6.5174a4cc.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/9.2b64cd11.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/main.eb929c56.chunk.css",revision:null},{url:"/stadt-land-fluss/static/js/0.a804c5c1.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/1.626a4aeb.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/10.d07e7f1f.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/11.4295d339.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/12.f68d7a9e.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/13.b69e98a6.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/14.80e08ff6.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/15.7e394f89.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/2.7743e131.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/5.8b8e3f9b.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/6.06119d06.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/7.baf0f14c.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/8.6cf08289.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/9.8a6060f5.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/main.d55258c7.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/runtime-main.62f46420.js",revision:null}],{})}));
//# sourceMappingURL=service-worker.js.map
