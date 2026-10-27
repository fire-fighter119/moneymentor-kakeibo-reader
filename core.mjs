// Reader-safe domain model. No owner endpoint, sheet, customer data or credentials.
export const defaultCategories = ['食費','日用品','住居費','水道・光熱費','通信費','交通費','車両費','医療費','保険料','教育費','衣類','交際費','趣味・娯楽','税金・社会保険料','その他'];
export function validateCategory(value){
 if(typeof value!=='string'||!value.trim()||value.trim().length>40)throw Error('費目は1〜40文字で入力してください。');
 return value.trim();
}
export function splitExpense({amount,type,splitAmount}){
 const total=Number(amount);
 if(!String(amount??'').trim()||!Number.isSafeInteger(total)||total<=0)throw Error('合計金額は1円以上の整数で入力してください。');
 if(!['最低限','ゆとり'].includes(type))throw Error('最低限かゆとりを選んでください。');
 if(!String(splitAmount??'').trim())return [{type,amount:total}];
 const part=Number(splitAmount);
 if(!Number.isSafeInteger(part)||part<0||part>total)throw Error('内訳は0円以上、合計金額以下で入力してください。');
 const necessary=type==='最低限'?part:total-part;
 return [{type:'最低限',amount:necessary},{type:'ゆとり',amount:total-necessary}].filter(r=>r.amount>0);
}
export function prepareExpense(values,newId){
 const category=validateCategory(values.category);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(values.date??''))throw Error('日付を入力してください。');
 const d=new Date(values.date+'T12:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==values.date)throw Error('正しい日付を入力してください。');
 const note=String(values.note??'').trim();if(note.length>1000)throw Error('メモは1,000文字以内で入力してください。');
 return splitExpense(values).map(part=>({id:newId(),date:values.date,category,...part,note}));
}
