const D=require('./domain');
const KEY='haowu.share.v1';
const copy=value=>JSON.parse(JSON.stringify(value));
function read(){const value=wx.getStorageSync(KEY);if(!value)return {version:1,drafts:[],posts:[]};if(value.version!==1||!Array.isArray(value.drafts)||!Array.isArray(value.posts))throw Error('分享数据无法读取，请保留本地数据');return copy(value);}
function write(db){try{wx.setStorageSync(KEY,db);}catch(e){throw Error('分享未能保存，请检查本地空间后重试；当前填写内容仍保留');}}
function owned(id){const item=D.getItem(D.read(),id);if(item.departure)throw Error('这件物品已离开，请重新选择正在拥有的物品');return item;}
function date(value){if(!value)return '未记录';const d=new Date(value);if(!Number.isFinite(d.getTime()))return '未记录';return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function duration(start,end){if(!Number.isFinite(D.dayValue(start))||!Number.isFinite(D.dayValue(end))||start>end)return null;return D.days(start,end);}
function snapshot(item){return {id:item.id,name:item.name,photo:item.photo||'',art:item.art||'',category:item.category||'',sub:item.sub||'',createdDate:date(item.createdAt),start:item.start,ownedDays:duration(item.start,D.today())};}
function start(id){owned(id);const db=read();const existing=db.drafts.find(d=>d.itemId===id);if(existing)return existing;return {id:'share-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10),itemId:id,title:'',text:'',photos:[]};}
function save(draft){const db=read();if(db.posts.some(p=>p.id===draft.id))throw Error('这篇分享已发布，请返回社区查看');const value={id:draft.id,itemId:draft.itemId,title:String(draft.title||''),text:String(draft.text||''),photos:(draft.photos||[]).slice(),updatedAt:Date.now()};const n=db.drafts.findIndex(d=>d.id===value.id);if(n<0)db.drafts.push(value);else db.drafts[n]=value;write(db);return value;}
function validate(form){if(!String(form.title||'').trim())throw Error('请填写分享标题');if(!String(form.text||'').trim())throw Error('请写下你的使用体验');}
function prepare(form){validate(form);const item=owned(form.itemId);save(form);const db=read(),draft=db.drafts.find(d=>d.id===form.id);draft.snapshot=snapshot(item);if(typeof draft.snapshot.photo==='string'&&draft.snapshot.photo.length>200000){draft.snapshot.photo='';draft.snapshot.photoFromItem=true;}write(db);return draft;}
function getDraft(id){const draft=read().drafts.find(d=>d.id===id);if(!draft)throw Error('草稿已不存在或已发布，请返回选择物品');return draft;}
function publish(id){const db=read();const existing=db.posts.find(p=>p.id===id);if(existing)return existing.id;const draft=db.drafts.find(d=>d.id===id);if(!draft)throw Error('草稿不存在，请返回编辑');const current=owned(draft.itemId);if(!draft.snapshot)throw Error('请先返回编辑并重新预览');const post={id:draft.id,itemId:draft.itemId,author:'我',title:draft.title.trim(),text:draft.text.trim(),photos:draft.photos.slice(),item:copy(draft.snapshot),publishedAt:Date.now(),status:'正在使用'};if(post.item.photoFromItem){post.item.photo='';post.item.photoFromItem=true;}post.item.ownedDays=duration(post.item.start,date(post.publishedAt));db.posts.unshift(post);db.drafts=db.drafts.filter(d=>d.id!==id);write(db);return id;}
function viewPost(post){if(post.item.ownedDays===undefined)post.item.ownedDays=duration(post.item.start,date(post.publishedAt));return post;}
function getPost(id){const post=read().posts.find(p=>p.id===id);if(!post)throw Error('这篇分享不存在');return viewPost(post);}
function list(){return read().posts.sort((a,b)=>b.publishedAt-a.publishedAt).map(viewPost);}
module.exports={KEY,read,owned,date,snapshot,start,save,prepare,getDraft,publish,getPost,list,createdDays:value=>duration(value,D.today())};
