const D=require('./domain');
const go=(page,query)=>wx.navigateTo({url:'/pages/'+page+'/index'+(query?'?'+query:'')});
const toast=title=>wx.showToast({title,icon:'none'});
function run(fn) { try{return fn();}catch(e){toast(e.message);return false;} }
function confirm(title,content,fn) { wx.showModal({title,content,confirmColor:'#69765E',confirmText:'确认',cancelText:'取消',success:r=>{if(r.confirm)run(fn);}}); }
function remember(page) {page._initial=JSON.stringify(page.data.form);}
function discard(page) {const back=()=>{unprotect();wx.navigateBack();};if(page._initial===JSON.stringify(page.data.form))back();else confirm('放弃这次记录？','已经填写的内容不会保存。',back);}
function input(e) {this.setData({['form.'+e.currentTarget.dataset.key]:e.detail.value});}
async function photos(count) {const picked=await new Promise((resolve,reject)=>wx.chooseMedia({count,mediaType:['image'],sizeType:['compressed'],sourceType:['album','camera'],success:resolve,fail:reject}));const out=[];for(const f of picked.tempFiles){const saved=await new Promise((resolve,reject)=>wx.getFileSystemManager().saveFile({tempFilePath:f.tempFilePath,success:resolve,fail:reject}));out.push(saved.savedFilePath);}return out;}
function photoError(e){if(!String(e.errMsg||e.message).includes('cancel'))toast('照片未能保存，请检查空间或权限后重试');}
function protect(page){if(wx.enableAlertBeforeUnload)wx.enableAlertBeforeUnload({message:'尚未保存，离开会丢失本次修改'});}
function unprotect(){if(wx.disableAlertBeforeUnload)wx.disableAlertBeforeUnload();}
function back(){unprotect();wx.navigateBack();}
module.exports={D,go,toast,run,confirm,remember,discard,input,photos,photoError,protect,unprotect,back};
