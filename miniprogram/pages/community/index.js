const U=require('../../utils/ui'),S=require('../../utils/sharing');
const samplePosts = [
      {
        id: 'sample-sofa',
        author: '好物体验示例',
        item: '小棕沙发',
        duration: '建档 128 天',
        title: '把周末，留给自己',
        text: '阳光刚好，窝在沙发上读完一本书。用了这段时间，最喜欢它坐起来舒服，也很耐看。',
        art: 'sofa',
        status: '正在使用'
      },
      {
        id: 'sample-kindle',
        author: '好物体验示例',
        item: 'Kindle',
        duration: '建档 365 天',
        title: '睡前读几页，刚刚好',
        text: '带它出门很轻便，屏幕在阳光下也清楚。记录一年真实使用后的感受。',
        art: 'kindle',
        status: '正在使用'
      },
      {
        id: 'sample-camera',
        author: '好物体验示例',
        item: '相机',
        duration: '建档 520 天后转赠',
        title: '把喜欢的瞬间留给下一位',
        text: '它陪我记录了很多旅行。后来送给了同样喜欢摄影的朋友，这段使用记忆还在。',
        art: 'camera',
        status: '已经离开'
      }
];

Page({
  data: {
    activeFilter: '最新',
    filters: ['最新', '正在使用', '已经离开'],
    allPosts: samplePosts,
    posts: samplePosts,
    localAllPosts: [],
    localPosts: []
  },
  onShow(){U.run(()=>{const localAllPosts=S.list().map(p=>Object.assign({},p,{item:Object.assign({},p.item,{createdDays:S.createdDays(p.item.createdDate)})}));this.setData({localAllPosts,localPosts:this.data.activeFilter==='最新'?localAllPosts:localAllPosts.filter(p=>p.status===this.data.activeFilter)});});},
  openShare(e){U.go('share-post','id='+encodeURIComponent(e.currentTarget.dataset.id));},
  noop(e){e&&e.stopPropagation&&e.stopPropagation();},
  selectFilter(e) {
    const activeFilter = e.currentTarget.dataset.value;
    const posts = activeFilter === '最新' ? this.data.allPosts : this.data.allPosts.filter(post => post.status === activeFilter);
    const localPosts=activeFilter==='最新'?this.data.localAllPosts:this.data.localAllPosts.filter(p=>p.status===activeFilter);
    this.setData({ activeFilter, posts, localPosts });
  }
});
