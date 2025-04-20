import{t,v as e}from"./server.mjs";import{P as n,Q as r}from"../routes/renderer.mjs";function useHead(o,s={}){const u=function(n){var o;const s=n||t();return(null==(o=null==s?void 0:s.ssrContext)?void 0:o.head)||(null==s?void 0:s.runWithContext((()=>{if(e.hasInjectionContext())return e.inject(r)})))}(s.nuxt);if(u)return n(o,{head:u,...s})}export{useHead as u};
//# sourceMappingURL=v3.mjs.map
