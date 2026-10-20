const path=require('node:path');const {wxmlToJs,wxssToJs}=require('miniprogram-compiler');
const root=path.resolve(__dirname,'../miniprogram');
for(const [name,compile]of [['WXML',wxmlToJs],['WXSS',wxssToJs]]){const result=compile(root);if(!result||result.length<100)throw Error(name+' produced no output');new Function('global',result);console.log('PASS '+name+' native compiler ('+result.length+' generated characters)');}
