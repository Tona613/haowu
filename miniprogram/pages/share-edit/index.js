const U=require('../../utils/ui'),S=require('../../utils/sharing');
Page({
 data:{item:null,form:{title:'',text:'',photos:[]},review:null,reviewOpen:false,chars:0,titleError:'',textError:'',saveError:'',error:'',busy:false},
 onLoad(q){U.run(()=>{try{this.itemId=q.itemId;const item=S.owned(q.itemId),form=S.start(q.itemId);this.setData({item:S.snapshot(item),review:item.review?{pros:(item.review.pros||[]).join('、'),cons:(item.review.cons||[]).join('、'),again:item.review.again}:null,form,chars:Array.from(form.text).length});}catch(e){this.setData({error:e.message});}});},
 onShow(){if(this.itemId)try{S.owned(this.itemId);if(this.data.form.id&&S.read().posts.some(p=>p.id===this.data.form.id))this.setData({error:'这篇分享已发布，可返回选择另一件物品。'});}catch(e){this.setData({error:e.message});}},
 input(e){const key=e.currentTarget.dataset.key,value=e.detail.value;this.setData({['form.'+key]:value,titleError:'',textError:''});if(key==='text')this.setData({chars:Array.from(value).length});this.persist();},
 persist(){try{S.save(this.data.form);this.setData({saveError:''});return true;}catch(e){this.setData({saveError:e.message});return false;}},
 async photos(){if(this.data.busy)return;this.setData({busy:true});try{const photos=await U.photos(6-this.data.form.photos.length);this.setData({'form.photos':this.data.form.photos.concat(photos)});this.persist();}catch(e){U.photoError(e);}finally{this.setData({busy:false});}},
 removePhoto(e){this.setData({'form.photos':this.data.form.photos.filter((p,n)=>n!==Number(e.currentTarget.dataset.index))});this.persist();},
 photo(e){wx.previewImage({current:e.currentTarget.dataset.src,urls:this.data.form.photos});},
 reference(){this.setData({reviewOpen:true});},closeReview(){this.setData({reviewOpen:false});},
 back(){if(this.data.error||this.persist())wx.navigateBack();},
 preview(){const titleError=this.data.form.title.trim()?'':'请填写分享标题',textError=this.data.form.text.trim()?'':'请写下你的使用体验';this.setData({titleError,textError});if(titleError||textError){U.toast(titleError||textError);return;}U.run(()=>{S.prepare(this.data.form);this.setData({saveError:''});U.go('share-post','mode=preview&id='+encodeURIComponent(this.data.form.id));});}
});
