const U=require('../../utils/ui');const D=U.D;
Page({
 data:{items:[],searchResults:[],recent:[],query:'',picker:false,pickerCategories:[],pickerChildren:[],pickerItems:[],categoryId:'',subId:''},
 onShow(){this.refresh();},
 refresh(){U.run(()=>{const db=D.read();const owned=db.items.filter(i=>!i.departure);const items=owned.map(D.viewItem);const stories=D.records(db,'stories').filter(r=>owned.some(i=>i.id===r.itemId));const q=this.data.query.trim().toLowerCase();
 const pickerCategories=[{id:'',name:'全部',count:owned.length,children:[]}].concat(db.categories.map(c=>Object.assign({},c,{count:owned.filter(i=>i.categoryId===c.id).length})).filter(c=>c.count>0));
 const selected=pickerCategories.find(c=>c.id===this.data.categoryId)||pickerCategories[0];const categoryId=selected.id;const subId=categoryId===this.data.categoryId?this.data.subId:'';const children=selected.children||[];const pickerChildren=categoryId?[{id:'',name:'全部',count:selected.count}].concat(children.map(s=>Object.assign({},s,{count:owned.filter(i=>i.subId===s.id).length})).filter(s=>s.count>0)):[];
 const pickerItems=items.filter(i=>(!categoryId||i.categoryId===categoryId)&&(!subId||i.subId===subId));this.setData({items,searchResults:q?items.filter(i=>i.name.toLowerCase().includes(q)):[],recent:stories.slice(0,5),pickerCategories,pickerChildren,pickerItems,categoryId,subId});});},
 search(e){this.setData({query:e.detail.value});this.refresh();},
 openPicker(){this.setData({categoryId:'',subId:''});this.refresh();this.setData({picker:true});},
 selectParent(e){this.setData({categoryId:e.currentTarget.dataset.id||'',subId:''});this.refresh();},
 selectChild(e){this.setData({subId:e.currentTarget.dataset.id||''});this.refresh();},
 closePicker(){this.setData({picker:false});},
 choose(e){this.closePicker();U.go('record-form','kind=stories&from=home&itemId='+e.currentTarget.dataset.id);}
});
