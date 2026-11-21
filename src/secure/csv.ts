/** Quoted CSV parser, handles embedded newlines and escaped double-quotes. */
export function parseCsv(input:string):string[][] {
  const rows:string[][]=[]; let row:string[]=[]; let cell=''; let quoted=false;
  const text=input.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"') { if(quoted && text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted; }
    else if(c===',' && !quoted){row.push(cell.trim());cell='';}
    else if((c==='\r'||c==='\n')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(x=>x))rows.push(row);row=[];cell='';}
    else cell+=c;
  }
  if(quoted) throw new Error('CSV contains an unclosed quotation mark.');
  if(cell || row.length){row.push(cell.trim());if(row.some(x=>x))rows.push(row);}
  return rows;
}
export function csvObjects(input:string):Record<string,string>[] {
  const [header,...rows]=parseCsv(input);
  if(!header) throw new Error('CSV is empty');
  if(new Set(header.map(x=>x.toLowerCase())).size!==header.length)throw new Error('CSV has repeated headings');
  return rows.map((r,i)=>{if(r.length!==header.length)throw new Error(`CSV row ${i+2} has ${r.length} columns, expected ${header.length}`);return Object.fromEntries(header.map((h,j)=>[h,r[j]]));});
}
