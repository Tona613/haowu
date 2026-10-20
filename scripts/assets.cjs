const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const sharp=require('C:/Users/彤酱/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
async function main(){await sharp(process.argv[2]).jpeg({quality:90,mozjpeg:true}).toFile(path.join(root,'miniprogram/assets/collection.jpg'));
for(const rel of ['miniprogram/components/art/index.wxml','preview/runtime.js','preview/server.cjs','docs/DECISIONS.md']){const p=path.join(root,rel);let txt=fs.readFileSync(p,'utf8').replaceAll('collection.png','collection.jpg');if(rel==='preview/server.cjs')txt=txt.replace("'.png':'image/png'","'.png':'image/png','.jpg':'image/jpeg'");fs.writeFileSync(p,txt);}let bytes=0;function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else bytes+=fs.statSync(p).size;}}walk(path.join(root,'miniprogram'));console.log('Native package bytes: '+bytes);}
main().catch(e=>{console.error(e);process.exitCode=1;});
