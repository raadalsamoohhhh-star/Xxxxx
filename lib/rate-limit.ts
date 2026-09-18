type Entry={count:number;reset:number};
const buckets=new Map<string,Entry>();
function prune(now:number){for(const [key,entry] of buckets)if(entry.reset<=now)buckets.delete(key);}
export function rateLimit(key:string,limit=30,windowMs=60_000){
  const now=Date.now();prune(now);
  const current=buckets.get(key);
  if(!current){buckets.set(key,{count:1,reset:now+windowMs});return true;}
  current.count++;return current.count<=limit;
}
