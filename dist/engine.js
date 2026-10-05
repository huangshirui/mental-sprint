(function(root){
  'use strict';
  const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a||1};
  const rat=(n,d=1)=>{if(!d)throw Error('zero denominator');if(d<0){n=-n;d=-d}const g=gcd(n,d);return {n:n/g,d:d/g}};
  const add=(a,b)=>rat(a.n*b.d+b.n*a.d,a.d*b.d);
  const sub=(a,b)=>rat(a.n*b.d-b.n*a.d,a.d*b.d);
  const mul=(a,b)=>rat(a.n*b.n,a.d*b.d);
  const div=(a,b)=>rat(a.n*b.d,a.d*b.n);
  const ops={'+':add,'-':sub,'*':mul,'/':div};
  const rnd=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
  function decimalString(a){let d=a.d;while(d%2===0)d/=2;while(d%5===0)d/=5;if(d!==1)return a.n+'/'+a.d;return String(Number((a.n/a.d).toFixed(8)))}
  function parse(s){s=s.trim().replace(/−/g,'-');if(s.length>24)return null;let match=s.match(/^(-?\d+)\/(\d+)$/);if(match){const n=Number(match[1]),d=Number(match[2]);if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d===0||Math.abs(n)>1e9||d>1e9)return null;return rat(n,d)}if(!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s))return null;const digits=(s.split('.')[1]||'').length;if(digits>8)return null;const denominator=10**digits;const numerator=Math.round(Number(s)*denominator);if(!Number.isSafeInteger(numerator)||Math.abs(numerator)>1e9)return null;return rat(numerator,denominator)}
  const equal=(a,b)=>!!a&&a.n===b.n&&a.d===b.d;
  function candidate(kind,level,op){
    let a,b;
    if(kind==='integer'){
      const limit={easy:20,normal:100,hard:1000}[level],factor={easy:9,normal:12,hard:25}[level];
      if(op==='+'){a=rat(rnd(2,limit-2));b=rat(rnd(2,limit-a.n))}
      else if(op==='-'){a=rat(rnd(4,limit));b=rat(rnd(2,a.n-2))}
      else {a=rat(rnd(2,factor));b=rat(rnd(2,factor));if(op==='/')a=mul(a,b)}
    }else if(kind==='decimal'){
      const scale=level==='hard'?100:10;const max=level==='easy'?50:level==='normal'?200:2000;
      a=rat(rnd(1,max),scale);b=rat(rnd(1,max),scale);
      if(op==='-'&&a.n*b.d<b.n*a.d)[a,b]=[b,a];
      if(op==='*'){b=level==='easy'?rat(rnd(2,9)):rat(rnd(2,level==='hard'?199:99),10)}
      if(op==='/'){const result=rat(rnd(1,level==='easy'?30:level==='normal'?100:500),scale);b=rat(rnd(2,level==='hard'?20:10));a=mul(result,b)}
    }else{
      const max={easy:6,normal:12,hard:20}[level];let d1=rnd(2,max),d2=level==='easy'&&(op==='+'||op==='-')?d1:rnd(2,max);
      a=rat(rnd(1,d1-1),d1);b=rat(rnd(1,d2-1),d2);if(op==='-'&&a.n*b.d<b.n*a.d)[a,b]=[b,a];
    }
    return {a,b,answer:ops[op](a,b),op,kind};
  }
  function useful(q){
    // Compare values, not written numerators: 1/2 and 0.1 remain useful operands.
    if([q.a,q.b].some(x=>x.n===0||x.n===x.d))return false;
    if((q.op==='-'||q.op==='/')&&equal(q.a,q.b))return false;
    if(q.kind==='integer'&&[q.a,q.b].some(x=>x.n<2))return false;
    // A decimal exercise must actually involve a decimal operand or quotient.
    if(q.kind==='decimal'&&[q.a,q.b,q.answer].every(x=>x.d===1))return false;
    return true;
  }
  function make(topic,level,op){
    const kind=topic==='mixed'?['integer','decimal','fraction'][rnd(0,2)]:topic;
    for(let attempt=0;attempt<100;attempt++){const q=candidate(kind,level,op);if(useful(q))return q}
    // Guaranteed meaningful fallback, including if a random source repeats.
    const pairs=kind==='integer'?{'+':[rat(2),rat(3)],'-':[rat(5),rat(2)],'*':[rat(2),rat(3)],'/':[rat(6),rat(2)]}:kind==='decimal'?{'+':[rat(12,10),rat(23,10)],'-':[rat(23,10),rat(12,10)],'*':[rat(12,10),rat(2)],'/':[rat(12,10),rat(2)]}:{'+':[rat(1,3),rat(2,3)],'-':[rat(2,3),rat(1,3)],'*':[rat(1,2),rat(2,3)],'/':[rat(1,2),rat(2,3)]};
    const [a,b]=pairs[op];return {a,b,answer:ops[op](a,b),op,kind};
  }
  const api={rat,add,sub,mul,div,parse,equal,make,decimalString,useful};root.Arithmetic=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
