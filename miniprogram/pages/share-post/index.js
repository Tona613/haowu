const U=require('../../utils/ui'),S=require('../../utils/sharing'),D=require('../../utils/domain');
Page({
 data:{post:null,preview:false,busy:false,error:'',published:false},
 onLoad(q){this.id=q.id;this.mode=q.mode;this.setData({preview:q.mode==='preview',published:q.published==='1'});wx.setNavigationBarTitle({title:q.mode==='preview'?'帖子预览':'分享详情'});this.load();},
 load(){try{let post;if(this.mode==='preview'){const d=S.getDraft(this.id);post={title:d.title,text:d.text,photos:d.photos,item:d.snapshot,author:'我',date:'发布前预览'};if(!post.item.photo&&post.item.photoFromItem)post.item.photo=D.getItem(D.read(),d.itemId).photo;}else{post=S.getPost(this.id);post.date=S.date(post.publishedAt);if(!post.item.photo&&post.item.photoFromItem)post.item.photo=D.getItem(D.read(),post.itemId).photo;}const gallery=[post.item.photo||'',...(post.photos||[])];this.setData({post,gallery,galleryCount:gallery.length,error:''});}catch(e){this.setData({error:e.message});}},
 back(){wx.navigateBack();},
 publish(){if(this.data.busy)return;this.setData({busy:true});try{const id=S.publish(this.id);wx.redirectTo({url:'/pages/share-post/index?id='+encodeURIComponent(id)+'&published=1'});}catch(e){this.setData({busy:false});U.toast(e.message);}},
 community(){wx.switchTab({url:'/pages/community/index'});},
 photos(e){wx.previewImage({current:e.currentTarget.dataset.src,urls:this.data.post.photos});},
 hero(){const photo=this.data.post.item.photo;if(photo)wx.previewImage({current:photo,urls:[photo]});}
});
