const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dest=process.argv[2];
if(!dest||path.resolve(dest)!==path.resolve('C:/Users/彤酱/Desktop/好物/代码'))throw Error('Unexpected deployment target');
fs.mkdirSync(dest,{recursive:true});
for(const entry of fs.readdirSync(root)){if(entry==='node_modules')continue;fs.cpSync(path.join(root,entry),path.join(dest,entry),{recursive:true});}
console.log('Project saved to '+dest);
