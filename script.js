const $=s=>document.querySelector(s), sleep=ms=>new Promise(r=>setTimeout(r,ms));
const SUBJ=['mathematics','physics','chemistry','english','computer'];
const FIELDS={total:'Total Marks',percentage:'Percentage',mathematics:'Mathematics',physics:'Physics',chemistry:'Chemistry',computer:'Computer Science'};
const SEED=[["Aarav Sharma","CS101",92,88,85,78,95],["Diya Patel","CS102",76,72,80,85,70],["Rohan Reddy","CS103",45,52,48,60,55],["Sneha Iyer","CS104",88,91,84,90,86],
["Karthik Rao","CS105",63,58,66,70,72],["Meera Nair","CS106",35,40,38,55,42],["Arjun Singh","CS107",81,79,77,68,88],["Priya Das","CS108",95,97,93,89,98],
["Vikram Joshi","CS109",58,61,55,64,60],["Ananya Gupta","CS110",72,70,75,82,77],["Rahul Verma","CS111",50,47,52,58,49],["Isha Menon","CS112",85,83,89,92,80]];
let raw=JSON.parse(localStorage.getItem('students')||'null')||SEED.map((a,i)=>({id:i+1,name:a[0],roll:a[1],mathematics:a[2],physics:a[3],chemistry:a[4],english:a[5],computer:a[6]}));
const save=()=>localStorage.setItem('students',JSON.stringify(raw));
const grade=p=>p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F';

/* ---------- ALGORITHMS (all manual, no built-in sort) ---------- */
const snap=(st,a,key,act)=>{if(st&&st.length<400)st.push({v:a.map(key),act})};
function bubble(arr,key,st){const a=arr.slice();let c=0,s=0;for(let i=0;i<a.length-1;i++){let sw=false;for(let j=0;j<a.length-1-i;j++){c++;if(key(a[j])>key(a[j+1])){[a[j],a[j+1]]=[a[j+1],a[j]];s++;sw=true}snap(st,a,key,[j,j+1])}if(!sw)break}return{a,c,s}}
function selection(arr,key,st){const a=arr.slice();let c=0,s=0;for(let i=0;i<a.length-1;i++){let m=i;for(let j=i+1;j<a.length;j++){c++;if(key(a[j])<key(a[m]))m=j;snap(st,a,key,[m,j])}if(m!==i){[a[i],a[m]]=[a[m],a[i]];s++}}return{a,c,s}}
function merge(arr,key,st){const a=arr.slice();let c=0;
 (function rec(lo,hi){if(hi-lo<2)return;const mid=(lo+hi)>>1;rec(lo,mid);rec(mid,hi);const L=a.slice(lo,mid),R=a.slice(mid,hi);let i=0,j=0,k=lo;
  while(i<L.length&&j<R.length){c++;if(key(L[i])<=key(R[j]))a[k++]=L[i++];else a[k++]=R[j++]}
  while(i<L.length)a[k++]=L[i++];while(j<R.length)a[k++]=R[j++];snap(st,a,key,Array.from({length:hi-lo},(_,x)=>lo+x))})(0,a.length);return{a,c,s:0}}
function quick(arr,key,st){const a=arr.slice();let c=0,s=0;
 (function rec(lo,hi){if(lo>=hi)return;const p=key(a[hi]);let i=lo;for(let j=lo;j<hi;j++){c++;if(key(a[j])<p){[a[i],a[j]]=[a[j],a[i]];s++;i++}snap(st,a,key,[j,hi])}[a[i],a[hi]]=[a[hi],a[i]];s++;rec(lo,i-1);rec(i+1,hi)})(0,a.length-1);return{a,c,s}}
const ALGOS={bubble:['Bubble Sort',bubble,'O(n) / O(n²) / O(n²)','O(1)'],selection:['Selection Sort',selection,'O(n²) / O(n²) / O(n²)','O(1)'],merge:['Merge Sort',merge,'O(n log n) all cases','O(n)'],quick:['Quick Sort',quick,'O(n log n) / O(n log n) / O(n²)','O(log n)']};
function runSort(name,data,key,steps){const t=performance.now(),r=ALGOS[name][1](data,key,steps);r.ms=(performance.now()-t).toFixed(4);r.name=ALGOS[name][0];r.tc=ALGOS[name][2];r.sc=ALGOS[name][3];return r}
function binarySearch(vals,target){let low=0,high=vals.length-1,steps=[];while(low<=high){const mid=(low+high)>>1,cur=vals[mid];
 const res=cur===target?'equal → FOUND':target<cur?'target < mid value → go left':'target > mid value → go right';steps.push({n:steps.length+1,low,high,mid,cur,res});
 if(cur===target)return{idx:mid,steps};if(target<cur)high=mid-1;else low=mid+1}return{idx:-1,steps}}
function bound(vals,x,strict){let lo=0,hi=vals.length,c=0;while(lo<hi){const m=(lo+hi)>>1;c++;if(strict?vals[m]<=x:vals[m]<x)lo=m+1;else hi=m}return{i:lo,c}}
function pearson(x,y){const n=x.length,mx=x.reduce((a,b)=>a+b)/n,my=y.reduce((a,b)=>a+b)/n;let sxy=0,sxx=0,syy=0;
 for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;syy+=(y[i]-my)**2}return sxx&&syy?+(sxy/Math.sqrt(sxx*syy)).toFixed(3):0}
function buildGraph(th){const adj={},edges=[];SUBJ.forEach(s=>adj[s]=[]);
 for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const w=pearson(data().map(s=>s[SUBJ[i]]),data().map(s=>s[SUBJ[j]])),active=Math.abs(w)>=th;
  edges.push({a:SUBJ[i],b:SUBJ[j],w,active});if(active){adj[SUBJ[i]].push(SUBJ[j]);adj[SUBJ[j]].push(SUBJ[i])}}return{adj,edges}}
function traverse(adj,start,method){const order=[],explored=[],seen=new Set([start]),f=[start];
 while(f.length){const n=method==='bfs'?f.shift():f.pop();if(method==='dfs'){if(order.includes(n))continue}order.push(n);
  const nb=method==='bfs'?adj[n]:adj[n].slice().reverse();for(const m of nb){if(!order.includes(m))explored.push(n+'→'+m);
   if(method==='bfs'&&!seen.has(m)){seen.add(m);f.push(m)}if(method==='dfs'&&!order.includes(m))f.push(m)}}return{order,explored}}

/* ---------- DATA ---------- */
function data(){const e=raw.map(s=>{const total=SUBJ.reduce((a,k)=>a+s[k],0),percentage=+(total/5).toFixed(2);return{...s,total,average:percentage,percentage,grade:grade(percentage)}});
 const asc=merge(e,s=>s.total).a;asc.reverse().forEach((s,i)=>s.rank=i+1);return e}   // rank via our Merge Sort
const COLS=['rank','id','name','roll','mathematics','physics','chemistry','english','computer','total','percentage','grade'];
const tbl=(rows,cols)=>'<div class="scroll"><table><tr>'+cols.map(c=>`<th>${c}</th>`).join('')+'</tr>'+rows.map(r=>'<tr>'+cols.map(c=>`<td>${r[c]}</td>`).join('')+'</tr>').join('')+'</table></div>';
const cells=(v,cls)=>v.map((x,i)=>`<div class="${cls(i)}">${x}<br><small>${i}</small></div>`).join('');

/* ---------- UI ---------- */
document.querySelectorAll('nav button[data-t]').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id===b.dataset.t));refresh()});
$('#theme').onclick=()=>document.body.classList.toggle('dark');
document.querySelectorAll('select.fields').forEach(s=>s.innerHTML=Object.entries(FIELDS).map(([k,v])=>`<option value="${k}">${v}</option>`).join(''));
$('#g-start').innerHTML=SUBJ.map(s=>`<option>${s}</option>`).join('');
let charts=[];
function dashboard(){const d=data(),p=d.map(s=>s.percentage),top=d.find(s=>s.rank===1),{edges}=buildGraph(0);
 $('#cards').innerHTML=[['Total Students',d.length],['Avg Percentage',(p.reduce((a,b)=>a+b,0)/p.length).toFixed(2)+'%'],['Highest %',Math.max(...p)],['Lowest %',Math.min(...p)],['Top Student',top.name],['Subjects',5]].map(([a,b])=>`<div class="card"><b>${b}</b><small>${a}</small></div>`).join('');
 charts.forEach(c=>c.destroy());const col=['#4f46e5','#16a34a','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899','#64748b'];
 const mk=(id,t,l,v,n)=>new Chart($(id),{type:t,data:{labels:l,datasets:[{label:n,data:v,backgroundColor:col}]}});
 charts=[mk('#c1','bar',d.map(s=>s.name),p,'Percentage'),mk('#c2','bar',SUBJ,SUBJ.map(k=>+(d.reduce((a,s)=>a+s[k],0)/d.length).toFixed(2)),'Average'),
  mk('#c3','doughnut',['A','B','C','D','F'],['A','B','C','D','F'].map(g=>d.filter(s=>s.grade===g).length),'Students'),mk('#c4','bar',edges.map(e=>e.a.slice(0,4)+'↔'+e.b.slice(0,4)),edges.map(e=>e.w),'Correlation')]}
const FORM=['name','roll',...SUBJ];let skey='id',sdir=1;
function students(){const f=$('#filter').value.toLowerCase();
 const rows=data().filter(s=>(s.name+s.roll).toLowerCase().includes(f)).sort((a,b)=>(a[skey]>b[skey]?1:-1)*sdir);   // display-only sort
 $('#stable').innerHTML='<tr>'+COLS.map(c=>`<th data-k="${c}">${c}</th>`).join('')+'<th>Actions</th></tr>'+rows.map(s=>'<tr>'+COLS.map(c=>`<td>${s[c]}</td>`).join('')+`<td><button onclick="editS(${s.id})">Edit</button> <button class="del" onclick="delS(${s.id})">Delete</button></td></tr>`).join('');
 document.querySelectorAll('#stable th[data-k]').forEach(th=>th.onclick=()=>{sdir=skey===th.dataset.k?-sdir:1;skey=th.dataset.k;students()})}
function editS(id){const s=raw.find(x=>x.id===id);$('#ftitle').textContent='Edit Student #'+id;$('#ftitle').dataset.id=id;FORM.forEach(k=>$('#'+k).value=s[k])}
function delS(id){if(confirm('Delete this student?')){raw=raw.filter(s=>s.id!==id);save();students()}}
function clearForm(){FORM.forEach(k=>$('#'+k).value='');$('#ftitle').textContent='Add Student';delete $('#ftitle').dataset.id}
$('#clear').onclick=clearForm;$('#filter').oninput=students;
$('#save').onclick=()=>{const o={name:$('#name').value.trim(),roll:$('#roll').value.trim()};
 if(!o.name||!o.roll)return $('#msg').textContent='⚠ Name and roll number are required';
 for(const k of SUBJ){const v=$('#'+k).value;if(v===''||!Number.isInteger(+v)||+v<0||+v>100)return $('#msg').textContent='⚠ '+k+' must be a whole number from 0 to 100';o[k]=+v}
 const id=+$('#ftitle').dataset.id||0;if(raw.some(s=>s.roll===o.roll&&s.id!==id))return $('#msg').textContent='⚠ Roll number already exists';
 if(id)Object.assign(raw.find(s=>s.id===id),o);else raw.push({id:Math.max(0,...raw.map(s=>s.id))+1,...o});
 save();clearForm();$('#msg').textContent='Saved ✔';students()};
const sortKey=f=>s=>s[f];
function sortInfo(r,f,n){return`<p><b>${r.name}</b> by ${FIELDS[f]} | Input: [${data().map(sortKey(f)).join(', ')}]<br>Comparisons: <b>${r.c}</b> | Swaps: <b>${r.s}</b>${r.name==='Merge Sort'?' (merge moves items, no swaps)':''} | Time: <b>${r.ms} ms</b><br>Time complexity: ${r.tc} | Space: ${r.sc} | Data structure: array of objects</p>`}
$('#s-go').onclick=()=>{const f=$('#s-field').value,r=runSort($('#s-algo').value,data(),sortKey(f));if($('#s-order').value==='desc')r.a.reverse();
 $('#s-bars').innerHTML='';$('#s-info').innerHTML='';$('#s-out').innerHTML=sortInfo(r,f)+tbl(r.a,COLS)};
$('#s-anim').onclick=async()=>{const f=$('#s-field').value,st=[],r=runSort($('#s-algo').value,data(),sortKey(f),st),mx=Math.max(...st[0].v,1);
 for(const [i,s] of st.entries()){$('#s-bars').innerHTML=s.v.map((v,j)=>`<div class="${s.act.includes(j)?'act':''}" style="height:${v/mx*100}%">${v}</div>`).join('');
  $('#s-info').textContent=`Frame ${i+1}/${st.length} – orange bars are being compared/merged`;await sleep(60)}
 $('#s-out').innerHTML=sortInfo(r,f)+tbl(r.a.slice().reverse(),COLS)};
$('#b-go').onclick=async()=>{const f=$('#b-field').value,raw_t=$('#b-val').value.trim(),t=f==='roll'?raw_t:Number(raw_t);
 if(!raw_t||(f!=='roll'&&isNaN(t)))return $('#b-info').innerHTML='<p style="color:#dc2626">⚠ Enter a valid target</p>';
 const sorted=merge(data(),sortKey(f)).a,vals=sorted.map(sortKey(f)),r=binarySearch(vals,t);
 $('#b-info').innerHTML=`<p>Sorted array: [${vals.join(', ')}]<br>Target: <b>${t}</b> | Complexity: O(log n), space O(1)</p>`;$('#b-steps').innerHTML='';
 for(const s of r.steps){$('#b-cells').innerHTML=cells(vals,i=>i===s.mid?'mid':(i<s.low||i>s.high)?'out':'');
  $('#b-steps').innerHTML+=`<div class="step">Step ${s.n} → Low=${s.low}, High=${s.high}, Mid=${s.mid}, Value=${s.cur}, ${s.res} (items left: ${s.high-s.low+1})</div>`;await sleep(900)}
 $('#b-steps').innerHTML+=`<p><b>${r.idx>=0?'Found at index '+r.idx+': '+sorted[r.idx].name+' ('+sorted[r.idx].roll+')':'Not found'}</b> | Comparisons: ${r.steps.length} | Steps: ${r.steps.length}</p>`};
$('#r-go').onclick=()=>{const f=$('#r-field').value,lo=+$('#r-min').value,hi=+$('#r-max').value;if(lo>hi)return $('#r-info').innerHTML='<p style="color:#dc2626">⚠ Min cannot exceed max</p>';
 const sorted=merge(data(),sortKey(f)).a,vals=sorted.map(sortKey(f)),L=bound(vals,lo,false),U=bound(vals,hi,true);
 $('#r-info').innerHTML=`<p>Sorted values shown below. Lower bound (first ≥ ${lo}) = index ${L.i}; Upper bound (first &gt; ${hi}) = index ${U.i}. Matches = indices ${L.i}..${U.i-1} → <b>${U.i-L.i}</b> students.<br>Binary-search probes: ${L.c+U.c} of ${vals.length} records | O(log n + k)</p>`;
 $('#r-cells').innerHTML=cells(vals,i=>(i>=L.i&&i<U.i?'in':'')+(i===L.i||i===U.i?' bd':''));$('#r-out').innerHTML=tbl(sorted.slice(L.i,U.i),COLS)};
$('#g-go').onclick=async()=>{const th=+$('#g-th').value,start=$('#g-start').value,{adj,edges}=buildGraph(th),r=traverse(adj,start,$('#g-method').value),pos={};
 SUBJ.forEach((n,i)=>pos[n]=[250+130*Math.cos(i*2*Math.PI/5-Math.PI/2),180+130*Math.sin(i*2*Math.PI/5-Math.PI/2)]);
 const draw=vis=>$('#g-svg').innerHTML=edges.filter(e=>e.active).map(e=>`<line x1="${pos[e.a][0]}" y1="${pos[e.a][1]}" x2="${pos[e.b][0]}" y2="${pos[e.b][1]}" stroke="#94a3b8" stroke-width="${1+Math.abs(e.w)*4}"/><text x="${(pos[e.a][0]+pos[e.b][0])/2}" y="${(pos[e.a][1]+pos[e.b][1])/2}">${e.w}</text>`).join('')+
  SUBJ.map(n=>`<circle cx="${pos[n][0]}" cy="${pos[n][1]}" r="22" fill="${vis.includes(n)?'#16a34a':'#4f46e5'}"/><text x="${pos[n][0]}" y="${pos[n][1]+36}" text-anchor="middle">${vis.includes(n)?vis.indexOf(n)+1+'. ':''}${n}</text>`).join('');
 for(let i=0;i<=r.order.length;i++){draw(r.order.slice(0,i));await sleep(700)}
 $('#g-info').textContent=`${$('#g-method').value.toUpperCase()} from ${start} (adjacency list, O(V+E)). Order: ${r.order.join(' → ')} | Nodes visited: ${r.order.length} | Edges explored: ${r.explored.join(', ')||'none'}`};
$('#m-go').onclick=()=>{const f=$('#m-field').value,rows=Object.keys(ALGOS).map(a=>{const r=runSort(a,data(),sortKey(f));return{Algorithm:r.name,Comparisons:r.c,Swaps:r.s,'Time (ms)':r.ms,'Top 3':r.a.slice(-3).reverse().map(s=>s.name).join(', ')}});
 $('#m-out').innerHTML=`<p class="note">Measured on ${data().length} records by ${FIELDS[f]} (results vary by data and machine).</p>`+tbl(rows,Object.keys(rows[0]))};
function refresh(){const on=document.querySelector('section.on').id;if(on==='dash')dashboard();if(on==='stu')students()}
dashboard();