type Entry={count:number;reset:number};
const buckets=new Map<string,Entry>();
export function rateLimit(key:string,limit=30,windowMs=60_000){
  const now=Date.now(); const current=buckets.get(key);
  if(!current||current.reset<=now){buckets.set(key,{count:1,reset:now+windowMs});return true;}
  current.count++; return current.count<=limit;
}
