/*
 * 3B Dönüşüm Laboratuvarı — bağımlılıksız JavaScript / Canvas 2D sürümü.
 * Homojen 4×4 matrisler satır-major düzende tutulur; p bir sütun vektörüdür.
 * Her dönüşüm soldan çarpılır: M_yeni = D × M_eski.
 */
import {identity, multiply, translate, scale, rotate, mirror, shear, transformPoint, formatNumber} from './math.js';

/** Initializes a single AEM block instance; its DOM and state are fully isolated. */
export function initCubeTransform(block, prefix, initialProjection='perspective') {
  const $ = (selector) => block.querySelector(selector.startsWith('#') ? `#${prefix}-${selector.slice(1)}` : selector);
  const I = identity;
  const mul = multiply;
  const trans = translate;
  const point = transformPoint;
  const fmt = formatNumber;
  const host = $('#canvas-container');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Etkileşimli 3 boyutlu küp');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none';
  host.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const status = $('#canvas-status');

  const dot = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const minus = (a,b) => a.map((v,i) => v-b[i]);
  const plus = (a,b) => a.map((v,i) => v+b[i]);
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const normalize = (a) => {const l = Math.hypot(...a) || 1;return a.map(v=>v/l);};

  const vertices = [
    [-.8,-.8,-.8],[.8,-.8,-.8],[.8,.8,-.8],[-.8,.8,-.8],
    [-.8,-.8,.8],[.8,-.8,.8],[.8,.8,.8],[-.8,.8,.8]
  ];
  const faces = [
    {ids:[5,1,2,6], color:'#21d69b'}, {ids:[0,4,7,3], color:'#0d7760'},
    {ids:[7,6,2,3], color:'#3b85ff'}, {ids:[0,1,5,4], color:'#1e4cbd'},
    {ids:[4,5,6,7], color:'#ff4e58'}, {ids:[1,0,3,2], color:'#a62242'}
  ];
  const cubeEdges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const shearLabels = {x:'X′ = X + k₁Y + k₂Z',y:'Y′ = Y + k₁X + k₂Z',z:'Z′ = Z + k₁X + k₂Y'};
  let matrix = I();
  const history = [];
  let wire = false, axesOn = false, ortho = initialProjection === 'orthographic';
  let yaw = 0.64, pitch = 0.42, radius = 8, orthoZoom = 1;
  let target = [0,0,0];
  let width = 1, height = 1;

  function camera() {
    const pos = plus(target,[radius*Math.cos(pitch)*Math.sin(yaw),radius*Math.sin(pitch),radius*Math.cos(pitch)*Math.cos(yaw)]);
    const forward = normalize(minus(target,pos));
    const right = normalize(cross(forward,[0,1,0]));
    const up = normalize(cross(right,forward));
    return {pos,forward,right,up};
  }
  function project(p, c) {
    const v = minus(p,c.pos);
    const d = dot(v,c.forward);
    const f = ortho ? (height / 6.5)*orthoZoom : height / (2 * Math.tan(44*Math.PI/360)) / Math.max(d,.06);
    return {x:width/2+dot(v,c.right)*f,y:height/2-dot(v,c.up)*f,d};
  }
  function lineSegment(a,b,color,thickness=1) {
    ctx.strokeStyle=color;ctx.lineWidth=thickness;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  function determinantSign(m) {
    const det = m[0]*(m[5]*m[10]-m[6]*m[9]) - m[1]*(m[4]*m[10]-m[6]*m[8]) + m[2]*(m[4]*m[9]-m[5]*m[8]);
    return det < 0 ? -1 : 1;
  }
  function drawAxes(c) {
    ctx.save();ctx.setLineDash([]);
    for (let n=-4; n<=4; n++) {
      lineSegment(project([-4,-1.8,n],c),project([4,-1.8,n],c),'rgba(124,150,182,.14)');
      lineSegment(project([n,-1.8,-4],c),project([n,-1.8,4],c),'rgba(124,150,182,.14)');
    }
    for (const [p,color] of [[[2.7,0,0],'#ff566a'],[[0,2.7,0],'#29d394'],[[0,0,2.7],'#5189ff']]) {
      lineSegment(project([0,0,0],c),project(p,c),color,2);
    }
    ctx.restore();
  }
  function render() {
    ctx.clearRect(0,0,width,height);
    const c = camera();
    if (axesOn) drawAxes(c);
    const points = vertices.map(p => point(matrix,p));
    const projections = points.map(p => project(p,c));
    if (wire) {
      ctx.lineWidth=1.8;
      for(const [i,j] of cubeEdges) {
        lineSegment(projections[i], projections[j], 'rgba(164,195,255,.84)',1.8);
      }
      for (const p of projections) {
        ctx.beginPath();ctx.arc(p.x,p.y,2.3,0,Math.PI*2);ctx.fillStyle='#d6e4ff';ctx.fill();
      }
      return;
    }
    const winding = determinantSign(matrix);
    const painted = faces.map(f => {
      const [p0,p1,p2] = f.ids.map(i => points[i]);
      const normal = cross(minus(p1,p0),minus(p2,p0));
      const center = f.ids.reduce((sum,i) => plus(sum,points[i]),[0,0,0]).map(v=>v/4);
      const visible = dot(normal,minus(c.pos,center))*winding > 0;
      const depth = f.ids.reduce((s,i) => s+projections[i].d,0)/4;
      return {...f,visible,depth};
    }).filter(f=>f.visible).sort((a,b)=>b.depth-a.depth);
    ctx.lineJoin='round';
    for(const f of painted) {
      ctx.beginPath();
      f.ids.forEach((i,n)=>{ const p=projections[i];if(n===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y); });
      ctx.closePath();
      ctx.fillStyle=f.color;
      ctx.shadowColor=f.color;ctx.shadowBlur=15;
      ctx.fill();ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(235,244,255,.28)';ctx.lineWidth=1.3;ctx.stroke();
    }
  }
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1,2);
    width=Math.max(1,host.clientWidth);height=Math.max(1,host.clientHeight);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    render();
  }
  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (resizeObserver) resizeObserver.observe(host);
  else window.addEventListener('resize', resize);
  function message(text){status.textContent=text;}
  function getNums(...ids) {
    return ids.map(id=>{
      const el=$('#'+id);const raw=el.value.trim(),n=Number(raw);
      if(!raw||!Number.isFinite(n)||Math.abs(n)>100000){el.focus();throw Error('Geçerli bir sayı girin (−100000 ile 100000 arası).');}
      return n;
    });
  }
  function checked(name){return $(`input[name="${prefix}-${name}"]:checked`).value;}
  async function act(callback){try{await callback();}catch(error){message('Hata: '+error.message);}}
  function table() {
    const tb=$('#matrix-table tbody');tb.replaceChildren();
    for(let r=0;r<4;r++){
      const tr=document.createElement('tr');
      for(let c=0;c<4;c++){const td=document.createElement('td');td.textContent=fmt(matrix[r*4+c]);tr.append(td);}
      tb.append(tr);
    }
  }
  function historyUi() {
    const ol=$('#history-list');ol.replaceChildren();
    if(history.length===0){const li=document.createElement('li');li.className='empty-history';li.textContent='Henüz dönüşüm uygulanmadı.';ol.append(li);}
    for(let i=history.length-1;i>=Math.max(0,history.length-5);i--){
      const li=document.createElement('li');li.textContent=history[i].label;
      const count=document.createElement('span');count.textContent='#'+(i+1);li.append(count);ol.append(li);
    }
    $('#undo-btn').disabled=history.length===0;
  }
  function apply(t,label){history.push({before:[...matrix],label});matrix=mul(t,matrix);table();historyUi();render();message('Uygulandı: '+label);}
  $('#translate-btn').addEventListener('click',()=>act(()=>{
    const [x,y,z]=getNums('tx','ty','tz');apply(trans(x,y,z),`Öteleme (${fmt(x)}, ${fmt(y)}, ${fmt(z)})`);
  }));
  $('#rotate-btn').addEventListener('click',()=>act(()=>{
    const [x,y,z]=getNums('rx','ry','rz');
    const p=$('#arbitrary').checked?getNums('px','py','pz'):[0,0,0];
    apply(rotate(x,y,z,p),`Döndürme (${x}°, ${y}°, ${z}°)`);
  }));
  $('#arbitrary').addEventListener('change',e=>{
    $('#pivot-controls').classList.toggle('is-disabled',!e.target.checked);
    for(const id of ['px','py','pz'])$('#'+id).disabled=!e.target.checked;
  });
  $('#pivot-controls').classList.add('is-disabled');
  $('#keep-ratio').addEventListener('change',e=>{
    if(e.target.checked){$('#sy').value=$('#sx').value;$('#sz').value=$('#sx').value;}
  });
  for(const id of ['sx','sy','sz'])$('#'+id).addEventListener('input',e=>{
    if(!$('#keep-ratio').checked)return;
    for(const other of ['sx','sy','sz'])if(other!==id)$('#'+other).value=e.target.value;
  });
  $('#scale-btn').addEventListener('click',()=>act(()=>{
    const [x,y,z]=getNums('sx','sy','sz');apply(scale(x,y,z),`Ölçekleme (${fmt(x)}, ${fmt(y)}, ${fmt(z)})`);
  }));
  $('#mirror-btn').addEventListener('click',()=>{
    const axis=checked('mirror-axis');apply(mirror(axis),`${axis.toUpperCase()} eksenine göre aynalama`);
  });
  block.querySelectorAll(`input[name="${prefix}-shear-axis"]`).forEach(r=>r.addEventListener('change',()=>{
    $('#shear-explanation').textContent=shearLabels[checked('shear-axis')];
  }));
  $('#shear-btn').addEventListener('click',()=>act(()=>{
    const [a,b]=getNums('sh1','sh2');const axis=checked('shear-axis');
    apply(shear(axis,a,b),`${axis.toUpperCase()} kaydırma (k₁=${fmt(a)}, k₂=${fmt(b)})`);
  }));
  function updateOptions(){
    $('#wireframe-label').textContent=wire?'Tel kafes':'Katı yüzey';
    $('#projection-label').textContent=ortho?'Ortografik':'Perspektif';
    $('#axes-label').textContent=axesOn?'Açık':'Kapalı';
    $('#wireframe-btn').setAttribute('aria-pressed',String(wire));
    $('#projection-btn').setAttribute('aria-pressed',String(ortho));
    $('#axes-btn').setAttribute('aria-pressed',String(axesOn));
    render();
  }
  $('#wireframe-btn').addEventListener('click',()=>{wire=!wire;updateOptions();message(wire?'Tel kafes görünümü etkin.':'Katı yüzey görünümü etkin.');});
  $('#projection-btn').addEventListener('click',()=>{ortho=!ortho;updateOptions();message(ortho?'Ortografik projeksiyon etkin.':'Perspektif projeksiyon etkin.');});
  $('#axes-btn').addEventListener('click',()=>{axesOn=!axesOn;updateOptions();message(axesOn?'Koordinat eksenleri gösteriliyor.':'Koordinat eksenleri gizlendi.');});
  function resetCamera(){yaw=.64;pitch=.42;radius=8;orthoZoom=1;target=[0,0,0];render();}
  $('#camera-reset-btn').addEventListener('click',()=>{resetCamera();message('Kamera başlangıç konumunda.');});
  $('#undo-btn').addEventListener('click',()=>{
    const item=history.pop();if(!item)return;
    matrix=item.before;table();historyUi();render();message('Geri alındı: '+item.label);
  });
  $('#reset-btn').addEventListener('click',()=>{
    matrix=I();history.length=0;wire=false;axesOn=false;ortho=false;
    for(const id of ['tx','ty','tz','rx','ry','rz','px','py','pz'])$('#'+id).value=0;
    for(const id of ['sx','sy','sz'])$('#'+id).value=1;
    $('#sh1').value=.5;$('#sh2').value=0;
    $('#keep-ratio').checked=false;$('#arbitrary').checked=false;
    $('#arbitrary').dispatchEvent(new Event('change'));
    $('input[name="'+prefix+'-mirror-axis"][value="x"]').checked=true;
    $('input[name="'+prefix+'-shear-axis"][value="x"]').checked=true;
    $('#shear-explanation').textContent=shearLabels.x;
    resetCamera();table();historyUi();updateOptions();message('Tüm dönüşümler ve görünüm sıfırlandı.');
  });
  $('#copy-matrix-btn').addEventListener('click',()=>act(async()=>{
    const output=Array.from({length:4},(_,r)=>matrix.slice(r*4,r*4+4).map(n=>fmt(n).padStart(9)).join(' ')).join('\n');
    if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(output);
    else{const t=document.createElement('textarea');t.value=output;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok)throw Error('Tarayıcı pano erişimini engelledi.');}
    message('4 × 4 matris panoya kopyalandı.');
  }));
  $('#snapshot-btn').addEventListener('click',()=>{
    render();const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='3b-donusum-gorunumu.png';a.click();message('PNG görüntüsü kaydedildi.');
  });
  const onKeyDown = (e) => {
    if (!block.contains(document.activeElement)) return;
    if(document.activeElement?.matches('input,textarea,[contenteditable]'))return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();$('#undo-btn').click();}
  };
  window.addEventListener('keydown', onKeyDown);
  // Fare/touch hareketi: sol tuş = kamerayı döndür, Shift + sürükle = kaydır.
  let dragging=false,lastX=0,lastY=0,panMode=false;
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0&&e.button!==1)return;
    dragging=true;panMode=e.shiftKey||e.button===1;lastX=e.clientX;lastY=e.clientY;
    canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';
  });
  canvas.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;
    if(panMode){
      const c=camera();const factor=(ortho?6.5/orthoZoom:radius)*.002;
      target=plus(target,plus(c.right.map(v=>-v*dx*factor),c.up.map(v=>v*dy*factor)));
    }else{yaw-=dx*.007;pitch=Math.max(-1.43,Math.min(1.43,pitch+dy*.007));}
    render();
  });
  const stopDrag=()=>{dragging=false;canvas.style.cursor='grab';};
  canvas.addEventListener('pointerup',stopDrag);
  canvas.addEventListener('pointercancel',stopDrag);
  canvas.style.cursor='grab';
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();const factor=Math.exp(e.deltaY*.001);
    if(ortho)orthoZoom=Math.max(.3,Math.min(8,orthoZoom/factor));
    else radius=Math.max(2.3,Math.min(40,radius*factor));
    render();
  },{passive:false});

  resize();table();historyUi();updateOptions();
  // AEM re-decoration / DOM removal cleanup, and explicit disposal for tests.
  return () => {
    resizeObserver?.disconnect();
    if (!resizeObserver) window.removeEventListener('resize',resize);
    window.removeEventListener('keydown',onKeyDown);
  };
}
