import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export function inspectSrt(source, fps=30) {
  if(!Number.isFinite(fps)||fps<=0)throw new Error('fps must be a positive number');
  const normalized=source.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trim();
  if(!normalized)throw new Error('Empty SRT');
  const captions=[],warnings=[];
  const timestamp='(\\d{2,}):([0-5]\\d):([0-5]\\d)[,.](\\d{3})';
  const timing=new RegExp('^'+timestamp+'\\s*-->\\s*'+timestamp+'(?:\\s+.*)?$');
  const ms=(groups)=>(Number(groups[0])*3600+Number(groups[1])*60+Number(groups[2]))*1000+Number(groups[3]);
  for(const [index,block] of normalized.split(/\n\s*\n/).entries()){
    const lines=block.split('\n');
    const timeIndex=lines.findIndex(l=>l.includes('-->'));
    const match=timeIndex>=0?lines[timeIndex].trim().match(timing):null;
    if(!match)throw new Error(`Block ${index+1}: invalid or missing timestamp`);
    const startMs=ms(match.slice(1,5)),endMs=ms(match.slice(5,9));
    if(endMs<=startMs)throw new Error(`Block ${index+1}: end must be after start`);
    const text=lines.slice(timeIndex+1).join('\n').trim();
    if(!text)throw new Error(`Block ${index+1}: missing caption text`);
    const from=Math.round(startMs*fps/1000),endFrame=Math.round(endMs*fps/1000);
    if(captions.length&&startMs<captions.at(-1).startMs)throw new Error(`Block ${index+1}: timestamps out of order`);
    if(captions.length&&startMs<captions.at(-1).endMs)warnings.push(`Block ${index+1} overlaps previous caption; review before planning`);
    captions.push({id:`caption-${index+1}`,srtIndex:timeIndex?lines[0].trim():null,text,startMs,endMs,from,durationInFrames:Math.max(1,endFrame-from)});
  }
  return {sourceSha256:createHash('sha256').update(source).digest('hex'),fps,captionCount:captions.length,subtitleEndMs:Math.max(...captions.map(c=>c.endMs)),timingPrecision:'cue-level, not word-level',warnings,captions};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  try{
    const [file,...args]=process.argv.slice(2);
    if(!file||args.length&&!(args.length===2&&args[0]==='--fps'))throw new Error('Usage: node inspect-srt.mjs <file.srt> [--fps 30]');
    console.log(JSON.stringify(inspectSrt(readFileSync(file,'utf8'),args.length?Number(args[1]):30),null,2));
  }catch(error){console.error(error.message);process.exitCode=1;}
}
