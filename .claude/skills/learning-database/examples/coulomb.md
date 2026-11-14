---
id: coulomb
title: Coulomb's law and superposition
field: electronics
builds_on:
leads_to: electric-field, gauss-law
recall: Two charges are moved three times farther apart, and one of them is doubled. What happens to the force?
answer: It becomes 2/9 of what it was: three times farther divides it by 9, double charge multiplies it by 2.
sources: Feynman Lectures Vol. II §1-1, §4-2 (§4-2 checked online); Purcell & Morin, Electricity and Magnetism, ch. 1; Griffiths §2.1; MIT OCW 8.02 ch. 2; NIST CODATA 2022 (e, ε₀)
---
**The question.** Rub a balloon on your hair and the hair rises toward it across empty air. Two objects that are not touching push or pull on each other. What exactly is that force: how does it depend on how much charge each carries, on the distance between them, and on direction? And when there are many charges, how do their forces combine?

**Big picture.** Every electrical device, a wire, a capacitor, a transistor, a motor, comes down to charges pushing and pulling on other charges. Electric field, voltage, capacitance and current are all built on the answer to this question. This card differs from the ones that follow in one way: nothing here is derived from something deeper. These are the experimental facts electromagnetism is built on, so the task is to state them exactly and understand what each part says.

**What experiment establishes about charge.**

- **Two kinds.** Matter carries a property called electric charge, which comes in two kinds. Same kinds repel, different kinds attract. Naming the kinds positive and negative lets charge be a signed number whose amounts add. Which kind is called positive is a convention; under it the electron is negative.
- **Conserved.** The total charge of an isolated system never changes. Charge can be moved around, and created or destroyed only in equal and opposite amounts.
- **Quantized.** Every free charge ever observed is a whole-number multiple of the elementary charge, 1.602 × 10⁻¹⁹ coulomb (exact, since 2019 it defines the coulomb). The proton carries +1 unit and the electron −1, equal in size to at least one part in 10²⁰. That is why ordinary matter is so nearly neutral.

**Coulomb's law, part by part.** In 1785 Coulomb measured the force between small charged spheres with a torsion balance. For two charges at rest, each small compared with the distance between them ("point charges"):

- **Direction: along the line joining them.** Two points in empty space single out exactly one direction, the line through them. A sideways force would have to point somewhere around that line, and nothing in the situation picks where.
- **Sign: like charges repel, unlike attract.** Each charge feels a force of the same size, in the opposite direction, as the other (Newton's third law).
- **Size grows in proportion to each charge.** Charge adds and forces add, so two equal charges placed together act like one double charge and exert double the force.
- **Size falls as the inverse square of the distance.** Twice as far, a quarter of the force; ten times as far, a hundredth. This is a measured fact and one of the most precisely tested in physics: if the power were not exactly 2, laboratory tests limit the difference to a few parts in 10¹⁶.
- **The overall strength is a measured constant.** Two charges of one coulomb each, one metre apart, would push with about 9 × 10⁹ newtons, roughly the weight of a million tonnes. In practice circuits move charges of nanocoulombs to microcoulombs.

**Predict first.** Set both charges to +4 nC and the distance to 6 cm and note the force. If you halve the distance and also halve one charge, what is the new force?

<!-- widget -->
<h2 class="sr-only">Two point charges with sliders for each charge and their distance; arrows show the force on each, and a log-log plot shows force against distance.</h2>
<style>
.c1-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}
.c1-panel{background:var(--surface-1);border-radius:12px;padding:6px;min-width:0}
.c1-row{display:flex;align-items:center;gap:12px;margin:12px 0 0}
.c1-row label{font-size:14px;color:var(--text-secondary);min-width:84px}
.c1-row output{font-size:14px;font-weight:500;min-width:64px;text-align:right;font-variant-numeric:tabular-nums}
.c1-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0 8px}
.c1-stat{background:var(--surface-1);border-radius:var(--radius);padding:10px 14px}
.c1-stat span{display:block;font-size:13px;color:var(--text-secondary)}
.c1-stat b{display:block;font-size:20px;font-weight:500;font-variant-numeric:tabular-nums}
.c1-note{font-size:13px;color:var(--text-muted);margin:4px 0 12px;line-height:1.5}
.c1-acts{display:flex;flex-wrap:wrap;gap:8px}
</style>
<div class="c1-grid">
<div class="c1-panel"><svg id="c1-scene" width="100%" viewBox="0 0 340 220" role="img"><title>Two charges</title><desc>Arrows show the force on each charge.</desc></svg></div>
<div class="c1-panel"><svg id="c1-plot" width="100%" viewBox="0 0 340 220" role="img"><title>Force against distance</title><desc>Log-log plot of force against distance; the inverse-square law is a straight line of slope minus two.</desc></svg></div>
</div>
<div class="c1-row"><label for="c1-q1">Charge q₁</label><input type="range" id="c1-q1" min="-10" max="10" step="0.5" value="4" style="flex:1"><output id="c1-q1o"></output></div>
<div class="c1-row"><label for="c1-q2">Charge q₂</label><input type="range" id="c1-q2" min="-10" max="10" step="0.5" value="4" style="flex:1"><output id="c1-q2o"></output></div>
<div class="c1-row"><label for="c1-r">Distance r</label><input type="range" id="c1-r" min="2" max="20" step="0.1" value="6" style="flex:1"><output id="c1-ro"></output></div>
<div class="c1-stats">
<div class="c1-stat"><span>Force on each charge</span><b id="c1-F"></b></div>
<div class="c1-stat"><span>Push or pull</span><b id="c1-kind"></b></div>
<div class="c1-stat"><span>Compared with the start</span><b id="c1-rel"></b></div>
</div>
<p class="c1-note">Positions are to scale. Arrow length follows the logarithm of the force, because the force changes by a factor of 100 across this range of distance. On the plot both axes are logarithmic.</p>
<div class="c1-acts">
<button id="c1-reset">Reset</button>
<button class="ld-ask" onclick="sendPrompt('Show me the maths behind Coulomb\'s law')">Show me the maths ↗</button>
<button class="ld-ask" onclick="sendPrompt('Why is the electric force exactly inverse-square?')">Why exactly inverse-square? ↗</button>
</div>
<script>
(function(){
var K=8.9875517923e9,$=function(i){return document.getElementById(i)};
var F0=K*16e-18/Math.pow(0.06,2);
function col(q){return q>0?'#D85A30':q<0?'#378ADD':'#888780'}
function sg(q){return q>0?'+':q<0?'−':''}
function fmt(x,u){if(!isFinite(x)||x===0)return '0 '+u;var P={'-12':'p','-9':'n','-6':'µ','-3':'m','0':''};var e=Math.floor(Math.log10(Math.abs(x))/3)*3;e=Math.max(-12,Math.min(0,e));var v=Math.abs(x)/Math.pow(10,e);return (v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+' '+P[e]+u}
function arr(x1,y,x2,c,w){var d=x2>x1?1:-1,h=Math.min(8,Math.abs(x2-x1));return '<line x1="'+x1+'" y1="'+y+'" x2="'+(x2-d*h*0.8)+'" y2="'+y+'" style="stroke:'+c+';stroke-width:'+w+'"/><polygon points="'+x2+','+y+' '+(x2-d*h)+','+(y-h*0.55)+' '+(x2-d*h)+','+(y+h*0.55)+'" style="fill:'+c+'"/>'}
function draw(){
  var q1=+$('c1-q1').value,q2=+$('c1-q2').value,r=+$('c1-r').value;
  var F=K*q1*q2*1e-18/Math.pow(r/100,2),a=Math.abs(F);
  var ink='var(--text-primary)',mut='var(--text-muted)',ln='var(--border-strong)';
  var x1=170-r*7,x2=170+r*7,cy=110,s='';
  s+='<line x1="10" y1="'+cy+'" x2="330" y2="'+cy+'" style="stroke:'+ln+';stroke-width:0.5"/>';
  if(a>0){
    var L=Math.max(10,Math.min(90,10+14*(Math.log10(a)+7.5))),d=F>0?-1:1;
    s+='<line x1="'+x1+'" y1="'+(cy-12)+'" x2="'+x1+'" y2="60" style="stroke:'+mut+';stroke-width:0.5;stroke-dasharray:2 3"/>';
    s+='<line x1="'+x2+'" y1="'+(cy+12)+'" x2="'+x2+'" y2="160" style="stroke:'+mut+';stroke-width:0.5;stroke-dasharray:2 3"/>';
    s+=arr(x1,60,Math.max(6,Math.min(334,x1+d*L)),ink,2.5)+arr(x2,160,Math.max(6,Math.min(334,x2-d*L)),ink,2.5);
  }
  [[x1,q1],[x2,q2]].forEach(function(c){s+='<circle cx="'+c[0]+'" cy="'+cy+'" r="11" style="fill:'+col(c[1])+'"/><text class="th" x="'+c[0]+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central" style="fill:#fff">'+(sg(c[1])||'0')+'</text>'});
  s+='<text class="ts" x="'+Math.max(36,Math.min(304,x1))+'" y="30" text-anchor="middle">q₁ = '+sg(q1)+Math.abs(q1)+' nC</text>';
  s+='<text class="ts" x="'+Math.max(36,Math.min(304,x2))+'" y="200" text-anchor="middle">q₂ = '+sg(q2)+Math.abs(q2)+' nC</text>';
  $('c1-scene').innerHTML=s;
  var m={l:56,r:12,t:12,b:38},pw=340-m.l-m.r,ph=220-m.t-m.b,lx0=Math.log10(2),lx1=Math.log10(20);
  function X(rc){return m.l+(Math.log10(rc)-lx0)/(lx1-lx0)*pw}
  function Y(f){return m.t+(-2-Math.log10(f))/6*ph}
  var p='<defs><clipPath id="c1-clip"><rect x="'+m.l+'" y="'+m.t+'" width="'+pw+'" height="'+ph+'"/></clipPath></defs>';
  var lab={'-8':'10 nN','-7':'100 nN','-6':'1 µN','-5':'10 µN','-4':'100 µN','-3':'1 mN','-2':'10 mN'};
  for(var e=-8;e<=-2;e++){var y=Y(Math.pow(10,e));p+='<line x1="'+m.l+'" y1="'+y+'" x2="'+(m.l+pw)+'" y2="'+y+'" style="stroke:var(--border);stroke-width:0.5"/>'+(e>-8?'<text class="ts" x="'+(m.l-6)+'" y="'+y+'" text-anchor="end" dominant-baseline="central">'+lab[e]+'</text>':'')}
  [2,5,10,20].forEach(function(v){var x=X(v);p+='<line x1="'+x+'" y1="'+m.t+'" x2="'+x+'" y2="'+(m.t+ph)+'" style="stroke:var(--border);stroke-width:0.5"/><text class="ts" x="'+x+'" y="'+(m.t+ph+14)+'" text-anchor="middle">'+v+' cm</text>'});
  p+='<text class="ts" x="'+(m.l+pw/2)+'" y="'+(m.t+ph+30)+'" text-anchor="middle">distance r (log scale)</text>';
  if(a>0){
    var kq=K*Math.abs(q1*q2)*1e-18,f=function(rc){return kq/Math.pow(rc/100,2)};
    p+='<line clip-path="url(#c1-clip)" x1="'+X(2)+'" y1="'+Y(f(2))+'" x2="'+X(20)+'" y2="'+Y(f(20))+'" style="stroke:var(--text-accent);stroke-width:2"/>';
    var px=X(r),py=Y(a);
    if(py>=m.t&&py<=m.t+ph){p+='<line x1="'+px+'" y1="'+py+'" x2="'+px+'" y2="'+(m.t+ph)+'" style="stroke:'+mut+';stroke-width:0.5;stroke-dasharray:3 3"/><circle cx="'+px+'" cy="'+py+'" r="5" style="fill:var(--text-accent);stroke:var(--surface-1);stroke-width:2"/>'}
    p+='<text class="ts" x="'+(m.l+pw-6)+'" y="'+(m.t+12)+'" text-anchor="end">slope −2</text>';
  } else p+='<text class="t" x="'+(m.l+pw/2)+'" y="'+(m.t+ph/2)+'" text-anchor="middle" dominant-baseline="central">No force: a charge is zero</text>';
  $('c1-plot').innerHTML=p;
  $('c1-q1o').textContent=sg(q1)+Math.abs(q1)+' nC';$('c1-q2o').textContent=sg(q2)+Math.abs(q2)+' nC';$('c1-ro').textContent=r.toFixed(1)+' cm';
  $('c1-F').textContent=a===0?'none':fmt(a,'N');
  $('c1-kind').textContent=F>0?'Repel':F<0?'Attract':'No force';
  var rel=a/F0;$('c1-rel').textContent=a===0?'—':rel>=1?'×'+(rel<10?rel.toFixed(2).replace(/\.?0+$/,''):Math.round(rel)):'1/'+(1/rel<10?(1/rel).toFixed(2).replace(/\.?0+$/,''):Math.round(1/rel));
}
['c1-q1','c1-q2','c1-r'].forEach(function(i){$(i).addEventListener('input',draw)});
$('c1-reset').addEventListener('click',function(){$('c1-q1').value=4;$('c1-q2').value=4;$('c1-r').value=6;draw()});
draw();
})();
</script>
<!-- /widget -->

**The answer.** Halving the distance multiplies the force by four; halving one charge divides it by two. The force doubles, and the "compared with the start" tile shows ×2. On the plot, the inverse-square law is a straight line of slope −2 on logarithmic axes. Changing the charges slides the line up or down but never changes its slope.

**How strong it is.** In a hydrogen atom the electron and proton are about 0.053 nanometres apart, and the electric pull between them is about 8 × 10⁻⁸ newtons. That sounds small, but it acts on an electron with a mass of 10⁻³⁰ kg. Gravity between the same two particles also falls as the inverse square, so the ratio of the two forces is the same at every distance: the electric force is about 2 × 10³⁹ times stronger.

Gravity dominates the large-scale universe anyway because matter is so precisely neutral. Positive and negative charge cancel almost perfectly, while mass has only one sign and always adds. The cancellation is delicate. Following an estimate in the Feynman Lectures, if two people standing at arm's length each had one percent more electrons than protons, the repulsion between them would be of order 10²⁵ newtons, comparable to the weight of the whole Earth.

**Superposition: the second fact.** Coulomb's law speaks only about two charges. For three or more, experiment adds a separate fact: the force on a charge from several others is the vector sum of the forces each would exert if it were alone. A third charge does not change the force between the first two.

- **It is not a consequence of Coulomb's law.** A world where a third charge altered the force between a pair is logically possible. Experiment says ours is not like that.
- **Forces add as arrows, not as numbers.** Placed tip to tail, two forces of the same size can cancel completely or add up to twice their size, depending on direction.
- **The test charge factors out.** The test charge's own size multiplies every term, so the net force on it is its charge times something that depends only on the other charges and on where it sits. That "something" is the electric field, the next card.

**Predict first.** Choose "+4 and +1": a +4 nC and a +1 nC charge, 9 cm apart. Is there a point between them where a third charge feels no net force? Is it nearer the big charge or the small one, and does it matter what the third charge is? Drag the test charge to find out.

<!-- widget -->
<h2 class="sr-only">Superposition: drag source charges and a test charge; the force from each source and the net force are drawn as arrows.</h2>
<style>
.c2-panel{background:var(--surface-1);border-radius:12px;padding:6px}
.c2-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0 0}
.c2-bar button[aria-pressed="true"]{background:var(--bg-accent);color:var(--text-accent);border-color:var(--text-accent)}
.c2-bar label{font-size:14px;color:var(--text-secondary);display:flex;gap:8px;align-items:center;margin-left:auto}
.c2-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin:16px 0 8px}
.c2-stat{background:var(--surface-1);border-radius:var(--radius);padding:10px 14px}
.c2-stat span{display:block;font-size:13px;color:var(--text-secondary)}
.c2-stat b{display:block;font-size:18px;font-weight:500;font-variant-numeric:tabular-nums}
.c2-stat b.ok{color:var(--text-success)}
.c2-note{font-size:13px;color:var(--text-muted);margin:4px 0 12px;line-height:1.5}
.c2-acts{display:flex;flex-wrap:wrap;gap:8px}
</style>
<div class="c2-panel"><svg id="c2-svg" width="100%" viewBox="0 0 680 350" role="img" style="touch-action:none;cursor:default"><title>Superposition of forces</title><desc>Each source charge exerts a force on the test charge; the arrows add tip to tail to give the net force.</desc></svg></div>
<div class="c2-bar" id="c2-presets">
<button data-p="equal">Two equal (+, +)</button>
<button data-p="dipole">Opposite (+, −)</button>
<button data-p="four">+4 and +1</button>
<button data-p="tri">Three charges</button>
<label for="c2-q0">Test charge <select id="c2-q0"><option value="1">+1 nC</option><option value="2">+2 nC</option><option value="-1">−1 nC</option></select></label>
</div>
<div class="c2-stats" id="c2-stats"></div>
<p class="c2-note">Positions are to scale: grid squares are 2 cm. Force arrows share one linear scale, reset so the longest has a fixed length. The dashed path adds the individual forces tip to tail and ends at the tip of the net force. Charges cannot come closer than 1.2 cm.</p>
<div class="c2-acts">
<button class="ld-ask" onclick="sendPrompt('Show me the maths of superposition for these charges')">Show me the maths ↗</button>
<button class="ld-ask" onclick="sendPrompt('Next: teach me the electric field')">Next: the electric field ↗</button>
</div>
<script>
(function(){
var K=8.9875517923e9,S=28,CX=340,CY=175,MIN=1.2,$=function(i){return document.getElementById(i)},svg=$('c2-svg');
var SUB=['₁','₂','₃'];
var PRE={equal:{s:[[4,-4.5,0],[4,4.5,0]],t:[0,4]},dipole:{s:[[4,-4.5,0],[-4,4.5,0]],t:[0,4]},four:{s:[[4,-4.5,0],[1,4.5,0]],t:[0,3]},tri:{s:[[3,-5,-3],[3,5,-3],[-3,0,4.5]],t:[0,0]}};
var st={q0:1,src:[],t:{x:0,y:4},cur:'equal'},act=null;
function col(q){return q>0?'#D85A30':'#378ADD'}
function sg(q){return q>0?'+':'−'}
function fmt(x){x=Math.abs(x);if(x===0)return '0 N';var e=Math.floor(Math.log10(x)/3)*3;e=Math.max(-12,Math.min(0,e));var v=x/Math.pow(10,e);return (v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+' '+{'-12':'p','-9':'n','-6':'µ','-3':'m','0':''}[e]+'N'}
function X(x){return CX+x*S}function Y(y){return CY-y*S}
function arrow(x1,y1,x2,y2,c,w,h){var dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);if(L<1)return '';var ux=dx/L,uy=dy/L;h=Math.min(h||10,L);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+(x2-ux*h*0.8)+'" y2="'+(y2-uy*h*0.8)+'" style="stroke:'+c+';stroke-width:'+w+'"/><polygon points="'+x2+','+y2+' '+(x2-ux*h-uy*h*0.45)+','+(y2-uy*h+ux*h*0.45)+' '+(x2-ux*h+uy*h*0.45)+','+(y2-uy*h-ux*h*0.45)+'" style="fill:'+c+'"/>'}
function clampX(v){return Math.max(16,Math.min(664,v))}function clampY(v){return Math.max(14,Math.min(336,v))}
function draw(){
  var s='',g='';
  for(var gx=-12;gx<=12;gx+=2)g+='M'+X(gx)+' 0V350';
  for(var gy=-6;gy<=6;gy+=2)g+='M0 '+Y(gy)+'H680';
  s+='<path d="'+g+'" style="stroke:var(--border);stroke-width:0.5;fill:none"/>';
  var fs=st.src.map(function(c){var dx=(st.t.x-c.x)/100,dy=(st.t.y-c.y)/100,d=Math.hypot(dx,dy),k=K*st.q0*c.q*1e-18/(d*d*d);return {x:k*dx,y:k*dy,m:Math.abs(k)*d}});
  var nx=0,ny=0,sum=0,big=0;fs.forEach(function(f){nx+=f.x;ny+=f.y;sum+=f.m;big=Math.max(big,f.m)});
  var nm=Math.hypot(nx,ny);big=Math.max(big,nm);var sc=big>0?110/big:0,tx=X(st.t.x),ty=Y(st.t.y),bal=nm<0.03*sum;
  if(fs.length>1){var px=tx,py=ty,path='M'+px+' '+py;fs.forEach(function(f){px+=f.x*sc;py-=f.y*sc;path+='L'+px+' '+py});s+='<path d="'+path+'" style="fill:none;stroke:var(--text-muted);stroke-width:1;stroke-dasharray:4 4"/>'}
  fs.forEach(function(f,i){var ex=tx+f.x*sc,ey=ty-f.y*sc,c=col(st.src[i].q),u=f.m*sc;s+=arrow(tx,ty,ex,ey,c,2);if(u>18){var ux=f.x*sc/u,uy=-f.y*sc/u;s+='<text class="ts" x="'+clampX(tx+ux*u*0.55-uy*14)+'" y="'+clampY(ty+uy*u*0.55+ux*14)+'" text-anchor="middle" dominant-baseline="central" style="fill:'+c+'">F'+SUB[i]+'</text>'}});
  if(!bal){var ex=tx+nx*sc,ey=ty-ny*sc,u=nm*sc,ux=nx*sc/u,uy=-ny*sc/u;s+=arrow(tx,ty,ex,ey,'var(--text-primary)',3.5,12);s+='<text class="th" x="'+clampX(ex+ux*18+uy*14)+'" y="'+clampY(ey+uy*18-ux*14)+'" text-anchor="middle" dominant-baseline="central">net</text>'}
  st.src.forEach(function(c,i){s+='<circle cx="'+X(c.x)+'" cy="'+Y(c.y)+'" r="13" style="fill:'+col(c.q)+'"/><text class="th" x="'+X(c.x)+'" y="'+Y(c.y)+'" text-anchor="middle" dominant-baseline="central" style="fill:#fff">'+sg(c.q)+'</text><text class="ts" x="'+clampX(X(c.x))+'" y="'+clampY(Y(c.y)+26)+'" text-anchor="middle">q'+SUB[i]+' = '+sg(c.q)+Math.abs(c.q)+' nC</text>'});
  var tc=bal?'var(--text-success)':'var(--text-accent)';
  s+='<circle cx="'+tx+'" cy="'+ty+'" r="8" style="fill:var(--surface-2);stroke:'+tc+';stroke-width:3"/>';
  if(bal)s+='<circle cx="'+tx+'" cy="'+ty+'" r="17" style="fill:none;stroke:'+tc+';stroke-width:1.5"/>';
  s+='<text class="th" x="'+clampX(tx+16)+'" y="'+clampY(ty-16)+'" style="fill:'+tc+'">'+(bal?'test charge: net force ≈ 0':'test charge')+'</text>';
  s+='<path d="M14 336H'+(14+2*S)+'M14 331V341M'+(14+2*S)+' 331V341" style="stroke:var(--text-muted);stroke-width:1.5;fill:none"/><text class="ts" x="'+(20+2*S)+'" y="336" dominant-baseline="central">2 cm</text>';
  svg.innerHTML=s;
  var h=fs.map(function(f,i){return '<div class="c2-stat"><span>Force from q'+SUB[i]+'</span><b>'+fmt(f.m)+'</b></div>'}).join('');
  h+='<div class="c2-stat"><span>Net force</span><b class="'+(bal?'ok':'')+'">'+fmt(nm)+(bal?' (balanced)':'')+'</b></div>';
  $('c2-stats').innerHTML=h;
}
function preset(n){st.cur=n;st.src=PRE[n].s.map(function(a){return {q:a[0],x:a[1],y:a[2]}});st.t={x:PRE[n].t[0],y:PRE[n].t[1]};
  [].forEach.call(document.querySelectorAll('#c2-presets button'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-p')===n?'true':'false')});draw()}
function pt(e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;var q=p.matrixTransform(svg.getScreenCTM().inverse());return {x:(q.x-CX)/S,y:(CY-q.y)/S}}
function place(o,x,y){x=Math.max(-11.5,Math.min(11.5,x));y=Math.max(-5.8,Math.min(5.8,y));
  var others=o===st.t?st.src:[st.t];
  for(var k=0;k<3;k++)others.forEach(function(p){var dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);if(d<MIN){if(d<1e-6){dx=1;dy=0;d=1}x=p.x+dx/d*MIN;y=p.y+dy/d*MIN}});
  if(others.every(function(p){return Math.hypot(x-p.x,y-p.y)>=MIN-1e-6})){o.x=x;o.y=y}}
svg.addEventListener('pointerdown',function(e){var p=pt(e),best=null,bd=0.8;st.src.concat([st.t]).forEach(function(o){var d=Math.hypot(p.x-o.x,p.y-o.y);if(d<bd){bd=d;best=o}});if(best){act=best;try{svg.setPointerCapture(e.pointerId)}catch(err){}e.preventDefault();svg.style.cursor='grabbing'}});
svg.addEventListener('pointermove',function(e){var p=pt(e);if(act){place(act,p.x,p.y);draw()}else{var near=st.src.concat([st.t]).some(function(o){return Math.hypot(p.x-o.x,p.y-o.y)<0.8});svg.style.cursor=near?'grab':'default'}});
function end(){act=null;svg.style.cursor='default'}svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
$('c2-presets').addEventListener('click',function(e){var b=e.target.closest('button');if(b)preset(b.getAttribute('data-p'))});
$('c2-q0').addEventListener('change',function(){st.q0=+this.value;draw()});
preset('equal');
})();
</script>
<!-- /widget -->

**Result.** Two point charges at rest exert on each other a force along the line joining them, proportional to the product of the charges and to the inverse square of their distance, repulsive for like signs and attractive for unlike. With more charges present, the force on any one of them is the arrow sum of the forces from each of the others.

**Where it stops being true.**

- **Charges at rest.** Moving charges also exert magnetic forces, and a change in one charge's position reaches the others only at the speed of light (later cards).
- **Point charges.** For objects that are not small compared with the distance between them, apply the law to each small piece of charge and add the pieces.
- **Empty space.** Inside matter, the surrounding charges shift in response and must be counted too; that is what a dielectric does (capacitance card).
- **Superposition** is exact in classical electromagnetism. Quantum effects break it only in fields around 10¹⁸ volts per metre, far beyond anything in a circuit.

**Check yourself.** Pick an answer for each; the explanation appears when you choose.

<!-- widget -->
<h2 class="sr-only">Three multiple-choice questions on Coulomb's law and superposition, with explanations.</h2>
<style>
.c3-q{background:var(--surface-1);border-radius:12px;padding:14px 16px;margin:0 0 12px}
.c3-q p{margin:0 0 10px;font-size:15px;line-height:1.55}
.c3-q .n{font-size:13px;color:var(--text-secondary);display:block;margin-bottom:4px}
.c3-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}
.c3-opts button{text-align:left;font-size:14px;padding:8px 12px}
.c3-opts button.right{background:var(--bg-success);color:var(--text-success);border-color:var(--text-success)}
.c3-opts button.wrong{background:var(--bg-danger);color:var(--text-danger);border-color:var(--text-danger)}
.c3-ex{margin:10px 0 0;font-size:14px;line-height:1.6;color:var(--text-secondary)}
.c3-ex b{font-weight:500;color:var(--text-primary)}
.c3-acts{display:flex;flex-wrap:wrap;gap:8px}
</style>
<div id="c3-list"></div>
<div class="c3-acts"><button class="ld-ask" onclick="sendPrompt('Give me a harder question on Coulomb\'s law')">Harder question ↗</button></div>
<script>
(function(){
var Q=[
{q:'Charges of +4 nC at x = 0 and +1 nC at x = 9 cm are fixed. Where between them does a third charge feel zero net force?',o:['3 cm','4.5 cm','6 cm','7.2 cm'],a:2,e:'<b>6 cm, twice as far from the bigger charge.</b> Between the charges the two forces point opposite ways, so they cancel where they are equal in size. The +4 nC charge is four times stronger, and four times stronger is offset by being twice as far away (inverse square). The third charge multiplies both forces equally, so the point is the same for any third charge of either sign. The balance is not stable in every direction: a positive test charge nudged sideways is pushed further out.'},
{q:'Two identical small metal spheres carry +6 nC and −2 nC and attract with force F. They touch, then go back to the same distance apart. What is the force now?',o:['F/3, attractive','F/3, repulsive','2F/3, repulsive','F, repulsive'],a:1,e:'<b>F/3, repulsive.</b> Charge is conserved: the total is +4 nC. The spheres are identical, so by symmetry each ends with +2 nC. Before, the product of the charges was 12 (with opposite signs: attraction); after, it is 4 (same signs: repulsion). The force is one third as big and now pushes the spheres apart.'},
{q:'Two equal positive charges; a test charge sits on the line that bisects them at right angles. Each source alone pushes it with force F₁. What is the net force?',o:['Exactly 2F₁','Less than 2F₁, along the bisector','Zero','Less than 2F₁, toward one source'],a:1,e:'<b>Less than 2F₁, along the bisector, pointing away from the sources.</b> Forces add as arrows. By mirror symmetry the components along the line joining the sources are equal and opposite and cancel; the components along the bisector add. The net force reaches 2F₁ only far away, where both pushes point almost the same way. Try it on the superposition bench with "Two equal".'}];
var h='';Q.forEach(function(x,i){h+='<div class="c3-q"><span class="n">Question '+(i+1)+'</span><p>'+x.q+'</p><div class="c3-opts" data-i="'+i+'">'+x.o.map(function(o,j){return '<button data-j="'+j+'">'+o+'</button>'}).join('')+'</div><p class="c3-ex" id="c3-ex'+i+'" hidden></p></div>'});
var L=document.getElementById('c3-list');L.innerHTML=h;
L.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var box=b.parentNode,i=+box.getAttribute('data-i'),j=+b.getAttribute('data-j'),x=Q[i];
  [].forEach.call(box.children,function(c){c.classList.remove('right','wrong')});
  b.classList.add(j===x.a?'right':'wrong');if(j!==x.a)box.children[x.a].classList.add('right');
  var ex=document.getElementById('c3-ex'+i);ex.innerHTML=(j===x.a?'Correct. ':'Not quite. ')+x.e;ex.hidden=false});
})();
</script>
<!-- /widget -->

**Where it leads.**

- **Electric field and Gauss's law** (next card): divide out the test charge and the force law becomes a field defined at every point in space.
- **Gravity:** Newton's law of gravitation has the same inverse-square form, so everything built on this card carries over to gravity with mass in place of charge, and one sign instead of two.
- **Semiconductors:** the Coulomb pull between an electron and a dopant atom, weakened by the surrounding silicon, sets how easily dopants release the carriers that make transistors work.

**Build spark.** A balance that reads 0.001 g resolves forces near 10⁻⁵ newtons, the size of the forces on the first bench. Put a small foil-covered sphere on an insulating post on the pan, hold an identical one above it on an insulating rod, charge both from the same source, and record the reading against the gap. On log-log axes the slope should approach −2 while the gap stays large compared with the spheres. At small gaps the spheres stop acting like point charges, and in humid air the charge leaks away within minutes.
