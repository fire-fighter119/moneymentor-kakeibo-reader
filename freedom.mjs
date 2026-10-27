export const budgetKeys=['basicMonth','basicYear','comfortMonth','comfortYear'];
export function validateBudget(value){if(value===undefined||value===null)return null;if(typeof value!=='object')throw Error('予算の形式が正しくありません。');const result={};for(const key of budgetKeys){const n=value[key];if(!Number.isSafeInteger(n)||n<0||n>1000000000)throw Error('予算は0〜10億円の整数で入力してください。');result[key]=n;}return result;}
export function annualBudget(value){const b=validateBudget(value);if(!b)return null;const basic=b.basicMonth*12+b.basicYear,comfort=b.comfortMonth*12+b.comfortYear;return {basic,comfort,total:basic+comfort};}

export function freedomAssets({necessary,total}){if(!Number.isSafeInteger(necessary)||!Number.isSafeInteger(total)||necessary<0||total<necessary)throw Error('支出の金額を確認してください。');const basic=necessary*25,all=total*25;if(!Number.isSafeInteger(all))throw Error('計算できる金額の上限を超えています。');return {basic,total:all};}

// Calendar days include days with no expenses; future records are not actual spending.
export function estimateAnnual(records,{year,today}){
 const day=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('日付を確認してください。');const t=Date.parse(s+'T00:00:00Z');if(!Number.isFinite(t)||new Date(t).toISOString().slice(0,10)!==s)throw Error('日付を確認してください。');return t/86400000;};
 if(!/^\d{4}$/.test(String(year))||Number(year)<1900)throw Error('年を確認してください。');
 const first=year+'-01-01',last=year+'-12-31',now=day(today),end=Math.min(now,day(last)),yearDays=day(last)-day(first)+1;
 const eligible=records.filter(r=>day(r.date)<=end);if(!eligible.length||end<day(first))return null;
 const start=Math.max(day(first),eligible.reduce((min,r)=>Math.min(min,day(r.date)),Infinity));
 const selected=eligible.filter(r=>r.date>=first&&r.date<=last);if(!selected.length)return null;
 const days=end-start+1;let necessary=0,total=0;for(const r of selected){if(!Number.isSafeInteger(r.amount)||r.amount<0)throw Error('支出の金額を確認してください。');total+=r.amount;if(r.type==='最低限')necessary+=r.amount;}
 const annual={necessary:Math.round(necessary*yearDays/days),total:Math.round(total*yearDays/days)};
 return {...annual,assets:freedomAssets(annual),days,yearDays,complete:days===yearDays,start:new Date(start*86400000).toISOString().slice(0,10),end:new Date(end*86400000).toISOString().slice(0,10)};
}
