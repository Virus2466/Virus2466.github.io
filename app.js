(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const projectDialog = document.querySelector('#project-dialog');
  const projectBody = document.querySelector('#project-body');
  const projectNotes = {
    caliber: `<p class="eyebrow">01 / C++20 · OPENGL · GLSL</p><h2 id="dialog-title">Inside Caliber.</h2><p>A real-time rendering and animation testbench built to explore engine programming through animated 3D models.</p><h3>Light, material, and motion</h3><p>The rendering work combines physically based shading with a Cook–Torrance model and GLSL. Skeletal animation uses state-driven playback, while procedural viewmodel sway uses spring-damper physics.</p><h3>The math underneath</h3><p>Axis-angle encoding, spherical linear interpolation (Slerp), and quaternion operations keep rotation handling stable.</p><h3>Building the pipeline</h3><p>glTF models are loaded through Assimp. The project uses CMake/Ninja and integrates GLFW, GLM, Dear ImGui, GLAD, and stb_image through Git submodules.</p><div class="tags"><span>C++20</span><span>OpenGL</span><span>GLSL</span><span>Assimp</span><span>CMake / Ninja</span></div><p class="note">The graphic on this page is a pipeline illustration. The interactive torus knot is a separate geometry study made for this website.</p><a class="button button-dark" href="https://github.com/Virus2466?tab=repositories&q=Caliber" target="_blank" rel="noopener noreferrer">Find Caliber on GitHub <span aria-hidden="true">↗</span></a>`,
    signal: `<p class="eyebrow">03 / REACT · NODE.JS · EXPRESS</p><h2 id="dialog-title">Follow the signal.</h2><p>A full-stack music recommendation app that starts with a track and helps listeners find something new.</p><h3>The recommendation flow</h3><p>Search for a track or upload one. Signal generates an AI-driven recommendation, a match score, and a playlist of 10–15 similar songs.</p><h3>From interface to deployment</h3><p>A React frontend connects to a Node.js/Express backend. The app was deployed on Netlify. Its off-white, sharp-cornered interface keeps the focus on music discovery.</p><div class="tags"><span>React</span><span>Node.js</span><span>Express</span><span>Netlify</span></div><p class="note">The Signal artwork on this page is an illustration of the project, rather than a screenshot of the app.</p><a class="button button-dark" href="https://github.com/Virus2466?tab=repositories&q=Signal" target="_blank" rel="noopener noreferrer">Find Signal on GitHub <span aria-hidden="true">↗</span></a>`,
    aws: `<p class="eyebrow">04 / PYTHON · DOCKER · AWS</p><h2 id="dialog-title">From code to delivery.</h2><p>An end-to-end CI/CD demo built around a sample Python application.</p><h3>Repeatable builds</h3><p>The app is containerized with Docker. CodeBuild and CodePipeline automate the build and package stages, while CodeDeploy uses an <code>appspec.yml</code> deployment configuration to connect the final stage.</p><h3>What it demonstrates</h3><p>A small application carried through a repeatable build, packaging, and deployment workflow. The focus is understanding the complete delivery path.</p><div class="tags"><span>Python</span><span>Docker</span><span>CodeBuild</span><span>CodePipeline</span><span>CodeDeploy</span></div><a class="button button-dark" href="https://github.com/Virus2466?tab=repositories" target="_blank" rel="noopener noreferrer">Browse my repositories <span aria-hidden="true">↗</span></a>`
  };
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    projectBody.innerHTML = projectNotes[button.dataset.project];
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
  }));
  document.querySelector('#resume-open').addEventListener('click', () => document.querySelector('#resume-dialog').showModal());
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
    new MutationObserver(() => { if (dialog.open) document.body.style.overflow = 'hidden'; }).observe(dialog, {attributes:true,attributeFilter:['open']});
  });
  document.querySelector('#print-resume').addEventListener('click', () => {
    const copy = document.querySelector('.resume-body').cloneNode(true);
    copy.style.display = 'none';
    copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    document.body.append(copy);
    window.addEventListener('afterprint', () => copy.remove(), {once:true});
    window.print();
  });
  const copyButton = document.querySelector('#copy-email');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('devpatel20402@gmail.com');
      document.querySelector('#copy-status').textContent = 'Email address copied.';
      copyButton.innerHTML = '<span style="font-size:12px">Copied ✓</span>';
    } catch {
      document.querySelector('#copy-status').textContent = 'Copy unavailable. Select the email address to copy it.';
      copyButton.innerHTML = '<span style="font-size:11px">Select to copy</span>';
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email-group > a'));
      window.getSelection().removeAllRanges();window.getSelection().addRange(range);
    }
  });
  const memoryGrid = document.querySelector('.memory-grid');
  memoryGrid.innerHTML = Array.from({length:72}, () => '<span class="memory-cell"></span>').join('');
  const cells = [...memoryGrid.children];
  let memoryStep = 0, memoryVisible = false;
  const memoryObserver = new IntersectionObserver(entries => { memoryVisible = entries[0].isIntersecting; }, {threshold:.1});
  memoryObserver.observe(memoryGrid);
  function illuminateMemory() {
    const head = memoryStep % cells.length;
    cells.forEach((cell,i) => {cell.classList.toggle('lit', i === head); cell.classList.toggle('trail', i < head && i >= head - 11);});
  }
  illuminateMemory();
  setInterval(() => { if (memoryVisible && !document.hidden && !reducedMotion.matches) {memoryStep++;illuminateMemory();} },100);
  document.querySelector('.signal-wave').innerHTML = Array.from({length:72},(_,i) => {
    const height = 8 + Math.abs(Math.sin(i*.4) * Math.cos(i*.17)) * 54;
    return `<span style="height:${height.toFixed(1)}px"></span>`;
  }).join('');

  // A small, standalone WebGL renderer. This is a website study, not a Caliber port.
  const canvas = document.querySelector('#geometry');
  let gl;
  try { gl = canvas.getContext('webgl', {alpha:true,antialias:true,powerPreference:'low-power'}); } catch { gl = null; }
  if (!gl) { renderSoftwareStudy(canvas); return; }
  const vertexSource = `attribute vec3 aPosition; attribute vec3 aNormal;
    uniform mat4 uMvp; uniform mat4 uModel; varying vec3 vNormal; varying vec3 vPosition;
    void main(){vec4 p=uModel*vec4(aPosition,1.);vPosition=p.xyz;vNormal=mat3(uModel)*aNormal;gl_Position=uMvp*vec4(aPosition,1.);}`;
  const fragmentSource = `precision mediump float;varying vec3 vNormal;varying vec3 vPosition;uniform float uMode;
    void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-2.,3.,4.));vec3 eye=normalize(vec3(0.,0.,5.)-vPosition);
      float diffuse=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,eye),0.),2.5);
      float spec=pow(max(dot(n,normalize(light+eye)),0.),35.);
      vec3 base=vec3(.56,.72,.36);vec3 color=base*(.23+diffuse*.83)+vec3(.28,.33,.21)*spec+vec3(.35,.45,.23)*rim*.5;
      if(uMode>1.5)color=vec3(.66,.79,.49)*(.55+diffuse*.45);
      else if(uMode>.5)color=vec3(.105,.135,.105);
      gl_FragColor=vec4(pow(color,vec3(.85)),1.);}`;
  function shader(type, source) {
    const result = gl.createShader(type);gl.shaderSource(result,source);gl.compileShader(result);
    if (!gl.getShaderParameter(result,gl.COMPILE_STATUS)) throw new Error('Geometry shader could not compile.');
    return result;
  }
  let program;
  try {
    program = gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Geometry renderer could not initialize.');
  } catch {
    canvas.hidden=true;document.querySelector('#render-fallback').hidden=false;
    document.querySelector('.render-controls').hidden=true;document.querySelector('.live-label').textContent='STATIC';return;
  }
  const center = t => [(1+.36*Math.cos(3*t))*Math.cos(2*t),(1+.36*Math.cos(3*t))*Math.sin(2*t),.44*Math.sin(3*t)];
  const normalize = v => {const length=Math.hypot(...v);return v.map(x=>x/length);};
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const segments=180,sides=20,positions=[],normals=[],indices=[],edges=[];
  for(let i=0;i<=segments;i++) {
    const t=i/segments*Math.PI*2,c=center(t),next=center(t+.001),tangent=normalize(next.map((v,k)=>v-c[k]));
    const normal=normalize(cross(tangent,[0,0,1])),binormal=normalize(cross(tangent,normal));
    for(let j=0;j<=sides;j++) {
      const angle=j/sides*Math.PI*2,n=normal.map((v,k)=>v*Math.cos(angle)+binormal[k]*Math.sin(angle));
      positions.push(...c.map((v,k)=>v+.225*n[k]));normals.push(...n);
      if(i<segments&&j<sides) {
        const a=i*(sides+1)+j,b=a+sides+1;
        indices.push(a,b,a+1,a+1,b,b+1);
        if(i%3===0)edges.push(a,a+1);
        if(j%2===0)edges.push(a,b);
      }
    }
  }
  gl.useProgram(program);
  function attribute(name,data) {
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);
  }
  attribute('aPosition',positions);attribute('aNormal',normals);
  function elementBuffer(data) {const buffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(data),gl.STATIC_DRAW);return buffer;}
  const triangles=elementBuffer(indices),lines=elementBuffer(edges);
  const mvpLocation=gl.getUniformLocation(program,'uMvp'),modelLocation=gl.getUniformLocation(program,'uModel'),modeLocation=gl.getUniformLocation(program,'uMode');
  function multiply(a,b) {const result=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)result[c*4+r]+=a[k*4+r]*b[c*4+k];return result;}
  function perspective(aspect) {const f=1/Math.tan(.55/2),near=.1,far=100;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);}
  function rotateX(a) {return new Float32Array([1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1]);}
  function rotateY(a) {return new Float32Array([Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),0,Math.cos(a),0,0,0,0,1]);}
  const view=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,-7.6,1]);
  let xRotation=.75,yRotation=.35,paused=reducedMotion.matches,mode='solid',lastTime=0,visible=true,dragging=false,previousX=0,previousY=0,frameRequested=false;
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  function draw(time) {
    frameRequested=false;
    const delta=Math.min((time-lastTime)/1000,.04);lastTime=time;
    if(!paused&&!dragging)yRotation+=delta*.17;
    const ratio=Math.min(window.devicePixelRatio||1,2),width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    gl.viewport(0,0,width,height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const model=multiply(rotateY(yRotation),rotateX(xRotation)),mvp=multiply(perspective(width/height),multiply(view,model));
    gl.uniformMatrix4fv(modelLocation,false,model);gl.uniformMatrix4fv(mvpLocation,false,mvp);gl.uniform1f(modeLocation,mode==='solid'?0:1);
    gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triangles);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);gl.disable(gl.POLYGON_OFFSET_FILL);
    if(mode==='wire'){gl.uniform1f(modeLocation,2);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lines);gl.drawElements(gl.LINES,edges.length,gl.UNSIGNED_SHORT,0);}
    if(!paused&&visible&&!document.hidden)requestDraw();
  }
  function requestDraw(){if(!frameRequested){frameRequested=true;requestAnimationFrame(draw);}}
  const pauseButton=document.querySelector('#pause');
  function updatePause(){pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',paused?'Play animation':'Pause animation');document.querySelector('#pause-text').textContent=paused?'Play':'Pause';document.querySelector('#pause-icon').textContent=paused?'▷':'Ⅱ';}
  pauseButton.addEventListener('click',()=>{paused=!paused;updatePause();requestDraw();});
  reducedMotion.addEventListener('change',event=>{paused=event.matches;updatePause();requestDraw();});
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
    mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});requestDraw();
  }));
  canvas.tabIndex=0;
  canvas.setAttribute('aria-label','Interactive torus knot. Drag with a mouse or use arrow keys to rotate.');
  canvas.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();xRotation+=event.key==='ArrowUp'?-.15:event.key==='ArrowDown'?.15:0;yRotation+=event.key==='ArrowLeft'?-.15:event.key==='ArrowRight'?.15:0;requestDraw();});
  canvas.addEventListener('pointerdown' ,event=>{if(event.pointerType==='touch')return;dragging=true;previousX=event.clientX;previousY=event.clientY;canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!dragging)return;yRotation+=(event.clientX-previousX)*.008;xRotation+=(event.clientY-previousY)*.008;previousX=event.clientX;previousY=event.clientY;requestDraw();});
  const endDrag=()=>{dragging=false;};canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
  new ResizeObserver(requestDraw).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible)requestDraw();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();paused=true;updatePause();document.querySelector('#render-hint').textContent='RELOAD TO RESTORE GEOMETRY';});
  updatePause();requestDraw();

  function renderSoftwareStudy(target) {
    const ctx=target.getContext('2d');
    if(!ctx){target.hidden=true;document.querySelector('#render-fallback').hidden=false;document.querySelector('.render-controls').hidden=true;return;}
    document.querySelector('.render-caption > span').textContent='TORUS KNOT · LIVE GEOMETRY';
    target.tabIndex=0;
    target.setAttribute('aria-label','Interactive torus knot. Drag with a mouse or use arrow keys to rotate.');
    let angleX=.7,angleY=.5,stop=reducedMotion.matches,display='solid',inView=true,held=false,px=0,py=0,last=0,pending=false;
    const count=105,ring=14,verts=[],faces=[];
    const unit=v=>{const l=Math.hypot(...v);return v.map(n=>n/l);};
    const vcross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const curve=t=>[(1+.36*Math.cos(3*t))*Math.cos(2*t),(1+.36*Math.cos(3*t))*Math.sin(2*t),.44*Math.sin(3*t)];
    for(let i=0;i<=count;i++) {
      const t=i/count*Math.PI*2,c=curve(t),d=curve(t+.001),tangent=unit(d.map((v,k)=>v-c[k]));
      const n=unit(vcross(tangent,[0,0,1])),b=unit(vcross(tangent,n));
      for(let j=0;j<=ring;j++) {
        const a=j/ring*Math.PI*2,normal=n.map((v,k)=>v*Math.cos(a)+b[k]*Math.sin(a));
        verts.push({p:c.map((v,k)=>v+.225*normal[k]),n:normal});
        if(i<count&&j<ring){const k=i*(ring+1)+j,q=k+ring+1;faces.push([k,q,k+1],[k+1,q,q+1]);}
      }
    }
    const light=unit([-2,3,4]);
    function rotate(v){const ca=Math.cos(angleX),sa=Math.sin(angleX),cb=Math.cos(angleY),sb=Math.sin(angleY),y=v[1]*ca-v[2]*sa,z=v[1]*sa+v[2]*ca;return [v[0]*cb+z*sb,y,-v[0]*sb+z*cb];}
    function request(){if(!pending){pending=true;requestAnimationFrame(paint);}}
    function paint(time){
      pending=false;const dt=Math.min((time-last)/1000,.05);last=time;if(!stop&&!held)angleY+=dt*.17;
      const width=target.clientWidth,height=target.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
      if(target.width!==Math.round(width*dpr)||target.height!==Math.round(height*dpr)){target.width=Math.round(width*dpr);target.height=Math.round(height*dpr);}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
      const scale=Math.min(width*.26,height*.27),points=verts.map(v=>{const p=rotate(v.p),n=rotate(v.n),f=5/(5-p[2]);return {x:width/2+p[0]*scale*f,y:height/2-p[1]*scale*f,z:p[2],n};});
      const ordered=faces.map(face=>({face,z:face.reduce((sum,i)=>sum+points[i].z,0)/3})).sort((a,b)=>a.z-b.z);
      for(const {face} of ordered){const a=points[face[0]],b=points[face[1]],c=points[face[2]],n=unit(a.n.map((v,k)=>v+b.n[k]+c.n[k]));
        const diffuse=Math.max(n.reduce((sum,v,k)=>sum+v*light[k],0),0),shine=Math.pow(Math.max(n[2],0),12)*.1;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();
        if(display==='solid') {const intensity=.29+diffuse*.69+shine;ctx.fillStyle=`rgb(${Math.round(180*intensity)},${Math.round(210*intensity)},${Math.round(132*intensity)})`;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.6;ctx.fill();ctx.stroke();}
        else{ctx.fillStyle='#1b221c';ctx.fill();ctx.strokeStyle=`rgba(191,216,155,${.25+diffuse*.65})`;ctx.lineWidth=.55;ctx.stroke();}
      }
      if(!stop&&inView&&!document.hidden)request();
    }
    const control=document.querySelector('#pause');
    function sync(){control.setAttribute('aria-pressed',String(stop));control.setAttribute('aria-label',stop?'Play animation':'Pause animation');document.querySelector('#pause-text').textContent=stop?'Play':'Pause';document.querySelector('#pause-icon').textContent=stop?'▷':'Ⅱ';}
    control.addEventListener('click',()=>{stop=!stop;sync();request();});
    document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{display=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});request();}));
    target.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')return;held=true;px=event.clientX;py=event.clientY;target.setPointerCapture(event.pointerId);});
    target.addEventListener('pointermove',event=>{if(!held)return;angleY+=(event.clientX-px)*.008;angleX+=(event.clientY-py)*.008;px=event.clientX;py=event.clientY;request();});
    target.addEventListener('pointerup',()=>{held=false;});target.addEventListener('pointercancel',()=>{held=false;});
    target.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();angleX+=event.key==='ArrowUp'?-.15:event.key==='ArrowDown'?.15:0;angleY+=event.key==='ArrowLeft'?-.15:event.key==='ArrowRight'?.15:0;request();});
    new ResizeObserver(request).observe(target);
    new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)request();}).observe(target);
    document.addEventListener('visibilitychange',()=>{if(inView&&!document.hidden)request();});
    reducedMotion.addEventListener('change',event=>{stop=event.matches;sync();request();});
    sync();request();
  }
})();
