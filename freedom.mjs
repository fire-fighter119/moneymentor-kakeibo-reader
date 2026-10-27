export const budgetKeys=['basicMonth','basicYear','comfortMonth','comfortYear'];
export function validateBudget(value){if(value===undefined||value===null)return null;if(typeof value!=='object')throw Error('予算の形式が正しくありません。');const result={};for(const key of budgetKeys){const n=value[key];if(!Number.isSafeInteger(n)||n<0||n>1000000000)throw Error('予算は0〜10億円の整数で入力してください。');result[key]=n;}return result;}
export function annualBudget(value){const b=validateBudget(value);if(!b)return null;const basic=b.basicMonth*12+b.basicYear,comfort=b.comfortMonth*12+b.comfortYear;return {basic,comfort,total:basic+comfort};}

export function freedomAssets({necessary,total}){if(!Number.isSafeInteger(necessary)||!Number.isSafeInteger(total)||necessary<0||total<necessary)throw Error('支出の金額を確認してください。');const basic=necessary*25,all=total*25;if(!Number.isSafeInteger(all))throw Error('計算できる金額の上限を超えています。');return {basic,total:all};}
