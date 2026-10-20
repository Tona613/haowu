const U=require('../../utils/ui'),D=U.D;
Page({
 data:{query:'',ownedCount:0,showcase:[],results:[],picker:false,categories:[],children:[],choices:[],categoryId:'',subId:''},
 onShow(){this.refresh();},
 refresh(){U.run(()=>{const db=D.read(),owned=db.items.filter(i=>!i.departure).map(D.viewItem),q=this.data.query.trim().toLowerCase();const categories=[{id:'',name:'全部',children:[]}].concat(db.categories.filter(c=>owned.some(i=>i.categoryId===c.id)));const parent=categories.find(c=>c.id===this.data.categoryId)||categories[0];const children=parent.id?[{id:'',name:'全部'}].concat(parent.children.filter(s=>owned.some(i=>i.categoryId===parent.id&&i.subId===s.id))):[];const subId=children.some(s=>s.id===this.data.subId)?this.data.subId:'';const showcase=[...new Set(db.homeShowcaseIds||[])].map(id=>owned.find(i=>i.id===id)).filter(Boolean).slice(0,6);this.setData({ownedCount:owned.length,showcase,categories,children,categoryId:parent.id,subId,results:q?owned.filter(i=>i.name.toLowerCase().includes(q)):[],choices:owned.filter(i=>(!parent.id||i.categoryId===parent.id)&&(!subId||i.subId===subId))});});},
 search(e){this.setData({query:e.detail.value});this.refresh();},
 openPicker(){this.setData({picker:true,categoryId:'',subId:''});this.refresh();},
 closePicker(){this.setData({picker:false});},
 parent(e){this.setData({categoryId:e.currentTarget.dataset.id,subId:''});this.refresh();},
 child(e){this.setData({subId:e.currentTarget.dataset.id});this.refresh();},
 choose(e){this.closePicker();U.go('share-edit','itemId='+encodeURIComponent(e.currentTarget.dataset.id));},
 add(){U.go('item-form');}
});
