if(!self.define){const s=s=>{"require"!==s&&(s+=".js");let l=Promise.resolve();return t[s]||(l=new Promise(async l=>{if("document"in self){const t=document.createElement("script");t.src=s,document.head.appendChild(t),t.onload=l}else importScripts(s),l()})),l.then(()=>{if(!t[s])throw new Error(`Module ${s} didn’t register its module`);return t[s]})},l=(l,t)=>{Promise.all(l.map(s)).then(s=>t(1===s.length?s[0]:s))},t={require:Promise.resolve(l)};self.define=(l,n,u)=>{t[l]||(t[l]=Promise.resolve().then(()=>{let t={};const i={uri:location.origin+l.slice(1)};return Promise.all(n.map(l=>{switch(l){case"exports":return t;case"module":return i;default:return s(l)}})).then(s=>{const l=u(...s);return t.default||(t.default=l),t})}))}}define("./service-worker.js",["./workbox-69b5a3b7"],(function(s){"use strict";self.addEventListener("message",s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()}),s.precacheAndRoute([{url:"/stadt-land-fluss/index.html",revision:"679a2cd82e7cb0ded269862810bdcad4"},{url:"/stadt-land-fluss/static/css/10.2e040679.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/12.aa9448b0.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/13.1f20bee0.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/14.f161706c.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/15.f161706c.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/6.5174a4cc.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/9.704d0c27.chunk.css",revision:null},{url:"/stadt-land-fluss/static/css/main.9e824626.chunk.css",revision:null},{url:"/stadt-land-fluss/static/js/0.558691fb.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/1.bf14d340.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/10.274812a6.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/11.eb0a0dae.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/12.ed329617.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/13.bc7a2136.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/14.69482a8d.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/15.7332d9a7.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/2.c3d5a38b.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/5.2c63cecc.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/6.4e6e3fa6.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/7.b7389d8e.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/8.14f0326f.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/9.739a4289.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/main.26ce46a0.chunk.js",revision:null},{url:"/stadt-land-fluss/static/js/runtime-main.c90d15b4.js",revision:null}],{})}));
//# sourceMappingURL=service-worker.js.map
