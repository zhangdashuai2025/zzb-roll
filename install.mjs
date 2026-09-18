import {cpSync, existsSync, mkdirSync, renameSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url));
const source=join(root,'zzb-roll');
const args=process.argv.slice(2);
let customTarget;
let force=false;
for(let i=0;i<args.length;i++){
  if(args[i]==='--force'){force=true;continue;}
  if(args[i]==='--target'&&args[i+1]&&!args[i+1].startsWith('--')){customTarget=args[++i];continue;}
  console.error('用法：node install.mjs [--target 技能目录] [--force]');
  process.exit(2);
}
const skillsDir=customTarget?resolve(customTarget):join(process.env.CODEX_HOME || join(homedir(),'.codex'),'skills');
const destination=join(skillsDir,'zzb-roll');
if(!existsSync(join(source,'SKILL.md'))){console.error('发布包不完整：缺少 zzb-roll/SKILL.md');process.exit(1);}
mkdirSync(skillsDir,{recursive:true});
if(existsSync(destination)){
  if(!force){console.error(`已经存在：${destination}\n若要更新，请运行 node install.mjs --force（会先备份旧版本）。`);process.exit(1);}
  const backup=`${destination}.backup-${new Date().toISOString().replace(/[:.]/g,'-')}`;
  renameSync(destination,backup);
  console.log(`旧版已备份：${backup}`);
}
cpSync(source,destination,{recursive:true,errorOnExist:true,force:false});
console.log(`zzb-roll 已安装：${destination}`);
console.log('重启 Codex 后，输入：使用 $zzb-roll，根据我的视频和 SRT 先做分镜审核与预览。');
