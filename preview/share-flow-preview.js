'use strict';
// Independent, memory-only demo. Never read or write the application's storage.
const items = [
 {id:'sofa',name:'小棕沙发',cat:'家具',sub:'沙发',start:'2025-06-15',created:'2025-07-02',showcase:true,review:{pros:'坐感柔软，窝着看书很舒服。颜色耐看，和家里的木色很搭。',cons:'体积偏大，小户型需要先量好尺寸。',again:'还会选择'},title:'用了一年多，还是最喜欢这个角落',body:'周末的下午，我最常待的地方就是这张沙发。\n\n坐垫比想象中柔软，靠背也能好好托住身体。看完一本书、晒一会儿太阳，都是很普通却很舒服的时刻。\n\n它也有不足：占地不小，打扫下面时要多费一点心。如果重新选择，我还是会把它带回家。'},
 {id:'kindle',name:'Kindle',cat:'数码',sub:'阅读器',start:'2024-10-08',created:'2025-03-06',showcase:true,review:{pros:'屏幕看着舒服，随身带很方便。',cons:'翻页速度一般，看图不适合。',again:'还会选择'},title:'把手机放下以后，又开始读书了',body:'最喜欢的是它只做一件事：让我安静地读书。\n\n睡前读二十分钟，比不停切换消息舒服很多。屏幕翻页偶尔慢一些，但读纯文字对我来说足够了。'},
 {id:'sweater',name:'米白毛衣',cat:'服饰',sub:'针织衫',start:'2025-11-03',created:'2025-11-05',showcase:true,review:null,title:'一件总会拿出来穿的毛衣',body:'颜色温柔，和衣柜里大部分衣服都能搭起来。\n\n穿了一个冬天，袖口有一些起球，需要定期整理，但还是很喜欢它的触感。'},
 {id:'camera',name:'相机',cat:'数码',sub:'相机',start:'2024-05-20',created:'2025-04-18',showcase:false,review:null,title:'带着相机，把日常看得慢一点',body:'有了它以后，我会留意路上的光和影。\n\n它没有手机方便，也需要慢慢学习，但每次认真拍下来的照片，都让我记得那一天。'}
];
const screen=document.querySelector('#screen'), footer=document.querySelector('#footer'), overlay=document.querySelector('#overlay');
let page='select', selected=null, drafts={}, query='', parent='全部', child='全部', published=null, modalReturn=null;
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const art=i=>`<div class="art ${i.id}" role="img" aria-label="${escapeHTML(i.name)}示例照片"></div>`;
const row=i=>`<button class="row" data-select="${i.id}">${art(i)}<span class="copy"><strong>${escapeHTML(i.name)}</strong><small>${i.cat} · ${i.sub}</small></span><span class="chevron">›</span></button>`;
const currentDraft=()=>drafts[selected.id]||(drafts[selected.id]={title:'',body:'',photos:[]});
function dates(i){return `<div class="dates"><div><span>建档日期</span><b>${i.created}</b></div><div><span>实际相逢日期</span><b>${i.start}</b></div></div>`;}
function itemCard(i){return `<div class="item-card"><div class="row">${art(i)}<span class="copy"><strong>${i.name}</strong><small>${i.cat} · ${i.sub}</small></span></div>${dates(i)}</div>`;}
function go(next){closeSheet(false);page=next;render();screen.scrollTop=0;}
function render(){
 document.querySelector('#back').disabled=page==='select';
 document.querySelector('#navTitle').textContent=({select:'分享好物',edit:'编辑分享',preview:'帖子预览',detail:'分享详情',community:'社区'})[page];
 [...document.querySelectorAll('#steps li')].forEach((li,n)=>li.classList.toggle('active',n===({select:0,edit:1,preview:2,detail:3,community:3})[page]));
 footer.innerHTML='';
 if(page==='select'){
  screen.innerHTML=`<h2>选择分享物品</h2><div class="search"><span aria-hidden="true">⌕</span><input id="query" aria-label="搜索物品名称" placeholder="搜索物品名称" value="${escapeHTML(query)}"></div><button class="chooser" data-action="picker"><span>＋ 从物品中选择</span><span>›</span></button><div id="selection"></div>`;
  renderSelection();document.querySelector('#query').addEventListener('input',e=>{query=e.target.value;renderSelection();});
 }else if(page==='edit'){
  const d=currentDraft();
  screen.innerHTML=`<h2>分享相处的感受</h2>${itemCard(selected)}<p class="disclosure">以上物品信息将随帖子公开 · 实际相逢日期由你填写</p><button class="text-btn sample-btn" data-action="sample">试填示例文案</button><div class="field"><label for="title">分享标题 <span class="required">*</span></label><input id="title" placeholder="这件好物，最想分享的一点" value="${escapeHTML(d.title)}" aria-describedby="titleError"><div id="titleError" class="error" role="alert"></div></div><div class="field"><div class="label-row"><label for="body">使用体验 <span class="required">*</span></label>${selected.review?'<button class="text-btn" data-action="review">参考我的评价 ›</button>':''}</div><textarea id="body" placeholder="喜欢的地方、不太适合的地方，都可以说说。" aria-describedby="bodyError">${escapeHTML(d.body)}</textarea><div id="bodyError" class="error" role="alert"></div><div class="count" id="count">已输入 ${Array.from(d.body).length} 字</div></div><div class="field"><label>补充照片</label><div class="photos" id="photos"></div><input id="photoInput" type="file" accept="image/*" multiple hidden><div class="error" id="photoError" role="alert"></div></div>`;
  renderPhotos();
  ['title','body'].forEach(key=>document.getElementById(key).addEventListener('input',e=>{d[key]=e.target.value;e.target.classList.remove('invalid');document.getElementById(key+'Error').textContent='';if(key==='body')document.querySelector('#count').textContent=`已输入 ${Array.from(d.body).length} 字`;}));
  document.querySelector('#photoInput').addEventListener('change',async e=>{const list=[...e.target.files];e.target.value='';for(const file of list){const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();d.photos.push(url);}catch{URL.revokeObjectURL(url);document.querySelector('#photoError').textContent='有图片无法读取，请换一张再试。';}}if(page==='edit')renderPhotos();});
  footer.innerHTML='<button class="secondary" data-action="reselect">返回选择</button><button class="primary" data-action="preview">下一步 · 预览</button>';
 }else if(page==='preview'){
  screen.innerHTML=postView(selected,currentDraft(),false);
  footer.innerHTML='<button class="secondary" data-action="edit">返回编辑</button><button class="primary" data-action="publish">确认发布</button>';
 }else if(page==='detail'){
  screen.innerHTML='<div class="success">✓ 模拟发布成功 · 仅本页可见</div>'+postView(published.item,published,false);
  footer.innerHTML='<button class="secondary" data-action="another">继续分享</button><button class="primary" data-action="community">去社区看看</button>';
 }else if(page==='community'){
  const p=published;
  screen.innerHTML=`<h2>大家的好物</h2><p class="muted">真实相处，慢慢分享。</p><div class="section-head"><h3>最新分享</h3><span class="muted">演示社区</span></div><button class="feed-card" data-action="detail">${art(p.item)}<div class="feed-copy"><span class="muted">我 · 刚刚</span><h3>${escapeHTML(p.title)}</h3><p class="excerpt">${escapeHTML(p.body)}</p><span class="muted">${p.item.name} · ${p.item.cat}</span>${dates(p.item)}</div></button>`;
  footer.innerHTML='<button class="primary" data-action="another">再分享一件好物</button>';
 }
}
function renderSelection(){const results=items.filter(i=>i.name.toLowerCase().includes(query.trim().toLowerCase()));document.querySelector('#selection').innerHTML=query.trim()?`<div class="section-head"><h3>搜索结果</h3><span class="muted">${results.length} 件</span></div>${results.length?results.map(row).join(''):'<div class="empty">没有找到这件物品<br>试试别的名称，或从分类中选择。</div>'}`:`<div class="section-head"><h3>我的好物展台</h3><span class="muted">3 件</span></div><div class="showcase-grid">${items.filter(i=>i.showcase).map(i=>`<button class="showcase-card" data-select="${i.id}"><div class="frame">${art(i)}<strong>${i.name}</strong></div><div class="tray"></div><span class="muted">${i.cat} · ${i.sub}</span></button>`).join('')}</div>`;}
function renderPhotos(){const d=currentDraft();document.querySelector('#photos').innerHTML=d.photos.map((url,n)=>`<div class="photo"><img src="${url}" alt="补充照片 ${n+1}"><button data-remove="${n}" aria-label="删除补充照片 ${n+1}">×</button></div>`).join('')+'<button class="upload" data-action="upload" aria-label="添加补充照片"><span>＋</span>添加照片</button>';}
function postView(i,d){return `<article class="post"><div class="author"><span class="avatar">我</span><span>我<small>${page==='preview'?'发布前预览':'刚刚分享'}</small></span></div><div class="hero">${art(i)}</div><h2>${escapeHTML(d.title)}</h2><div class="post-copy">${escapeHTML(d.body)}</div>${d.photos.map((url,n)=>`<img class="post-photo" src="${url}" alt="补充照片 ${n+1}">`).join('')}${itemCard(i)}<p class="disclosure">实际相逢日期为作者自述，建档日期为档案创建日期。</p></article>`;}
function showSheet(content,label){modalReturn=document.activeElement;overlay.innerHTML=`<div class="sheet-backdrop" data-action="close"></div><section class="sheet" role="dialog" aria-modal="true" aria-label="${label}" tabindex="-1">${content}</section>`;document.querySelector('.sheet').focus();}
function picker(){parent='全部';child='全部';showSheet('<div class="sheet-header"><h3>选择物品</h3><button data-action="close" aria-label="关闭选择物品">×</button></div><div id="pickerBody" style="display:contents"></div>','选择物品');renderPicker();}
function renderPicker(){const cats=['全部',...new Set(items.map(i=>i.cat))],subs=['全部',...new Set(items.filter(i=>i.cat===parent).map(i=>i.sub))],list=items.filter(i=>(parent==='全部'||i.cat===parent)&&(child==='全部'||i.sub===child));document.querySelector('#pickerBody').innerHTML=`<div class="categories">${cats.map(c=>`<button data-parent="${c}" class="${c===parent?'active':''}" aria-pressed="${c===parent}">${c}</button>`).join('')}</div>${parent==='全部'?'':`<div class="subcategories">${subs.map(s=>`<button data-child="${s}" class="${s===child?'active':''}" aria-pressed="${s===child}">${s}</button>`).join('')}</div>`}<div class="sheet-list">${list.map(row).join('')}</div>`;}
function review(){const r=selected.review;showSheet(`<div class="sheet-header"><h3>我的评价</h3><button data-action="close" aria-label="关闭我的评价">×</button></div><div class="review-content"><h4>喜欢的地方</h4><p>${r.pros}</p><h4>不太满意的地方</h4><p>${r.cons}</p><h4>如果重新选择</h4><p>${r.again}</p><p class="review-note">仅供你参考，不会自动加入正文或公开。</p></div><button class="primary" data-action="close">回去写写感受</button>`,'参考我的评价');}
function closeSheet(restore=true){overlay.innerHTML='';if(restore&&modalReturn?.isConnected)modalReturn.focus();modalReturn=null;}
function validate(){const d=currentDraft();let first=null;for(const key of ['title','body']){const invalid=!d[key].trim();document.getElementById(key).classList.toggle('invalid',invalid);document.getElementById(key+'Error').textContent=invalid?(key==='title'?'请填写分享标题':'请写下你的使用体验'):'';if(invalid&&!first)first=document.getElementById(key);}if(first){first.focus();return false;}return true;}
document.addEventListener('click',e=>{
 const target=e.target.closest('button,[data-action]');if(!target)return;
 if(target.dataset.select){selected=items.find(i=>i.id===target.dataset.select);go('edit');return;}
 if(target.dataset.parent){parent=target.dataset.parent;child='全部';renderPicker();return;}
 if(target.dataset.child){child=target.dataset.child;renderPicker();return;}
 if(target.dataset.remove!==undefined){const [url]=currentDraft().photos.splice(Number(target.dataset.remove),1);URL.revokeObjectURL(url);renderPhotos();return;}
 switch(target.dataset.action){
 case 'picker':picker();break;case 'close':closeSheet();break;case 'review':review();break;case 'upload':document.querySelector('#photoInput').click();break;
 case 'sample':{const d=currentDraft();if(d.title.trim()||d.body.trim()){const toast=document.querySelector('#toast');toast.textContent='已有填写内容，请先清空再试填。';toast.style.display='block';setTimeout(()=>toast.style.display='none',2300);break;}d.title=selected.title;d.body=selected.body;render();break;}
 case 'preview':if(validate())go('preview');break;case 'edit':go('edit');break;case 'reselect':go('select');break;
 case 'publish':if(page!=='preview')break;published={...currentDraft(),photos:[...currentDraft().photos],item:{...selected},id:'demo-post'};go('detail');break;
 case 'community':go('community');break;case 'detail':go('detail');break;case 'another':if(selected)delete drafts[selected.id];query='';go('select');break;
 }
});
document.querySelector('#back').addEventListener('click',()=>{if(page==='edit')go('select');else if(page==='preview')go('edit');else if(page==='detail')go('community');else if(page==='community')go('select');});
document.addEventListener('keydown',e=>{const sheet=document.querySelector('.sheet');if(!sheet)return;if(e.key==='Escape'){closeSheet();return;}if(e.key==='Tab'){const focusable=[...sheet.querySelectorAll('button,input,[tabindex="0"]')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===sheet)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
render();
