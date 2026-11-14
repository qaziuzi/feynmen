---
id: coulomb
title: Coulomb's law
field: electronics
builds_on:
leads_to: superposition, electric-field
recall: Two charges are moved three times farther apart. What fraction of the force is left?
answer: One ninth. The force falls with the square of the distance.
sources: Feynman Lectures Vol. II §1-1 and §4-2; Purcell & Morin, Electricity and Magnetism, ch. 1
---
**The question.** Rub a balloon on your hair and it pulls the hair toward it across empty air. What is doing the pulling, and how does the pull change with distance?

**Big picture.** Every electrical thing, a wire, a capacitor, a transistor, a motor, is charges pushing and pulling on other charges. This is the root rule. Everything else in electronics is built on top of it.

**How it works.**

- Matter carries a property called electric charge, and it comes in two kinds, named positive and negative. Protons carry one kind and electrons the other, in exactly equal amounts.
- Like kinds push apart. Unlike kinds pull together. The force acts along the straight line between the two charges, because in empty space that line is the only direction the two charges pick out.
- More charge means proportionally more force: double either charge and the force doubles.
- Distance matters strongly. The force falls with the square of the distance: twice as far gives a quarter of the force, three times as far gives a ninth.
- Nothing deeper explains this rule. Coulomb measured it in 1785, it has been tested to extraordinary precision since, and it is one of the experimental starting points of electromagnetism.
- Why we rarely notice it: between an electron and a proton the electric force is about 10³⁹ times stronger than gravity, but ordinary matter holds almost exactly equal amounts of both kinds, so the pushes and pulls cancel. Rubbing a balloon moves only a tiny fraction of the electrons, and even that is enough to lift hair.

**Predict first.** Before you touch the distance slider: if you move the charges twice as far apart, how much shorter do the arrows get?

**Takeaway.** Two charges push or pull along the line between them, in proportion to each charge, and the force falls as one over the distance squared.

<!-- widget -->
<h2 class="sr-only">Two charges on a line with sliders for each charge and their distance; arrows show the force on each charge.</h2>
<style>
.cl-row{display:flex;align-items:center;gap:12px;margin:0 0 10px}
.cl-row label{font-size:14px;color:var(--text-secondary);min-width:96px}
.cl-row output{font-size:14px;font-weight:500;min-width:64px;text-align:right;font-variant-numeric:tabular-nums}
.cl-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:1rem 0}
.cl-stat{background:var(--surface-1);border-radius:var(--radius);padding:12px 16px}
.cl-stat span{display:block;font-size:13px;color:var(--text-secondary)}
.cl-stat b{display:block;font-size:20px;font-weight:500;font-variant-numeric:tabular-nums}
.cl-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
</style>
<svg width="100%" viewBox="0 0 680 200" role="img"><title>Force between two charges</title><desc>Each charge has an arrow showing the force on it; arrow length is proportional to the force.</desc>
<line x1="20" y1="100" x2="660" y2="100" stroke="var(--border-strong)" stroke-width="0.5"/>
<g id="cl-arrows"></g>
<circle id="cl-c1" cy="100" r="15"/><text id="cl-s1" class="th" y="100" text-anchor="middle" dominant-baseline="central" fill="#fff"></text>
<circle id="cl-c2" cy="100" r="15"/><text id="cl-s2" class="th" y="100" text-anchor="middle" dominant-baseline="central" fill="#fff"></text>
<text id="cl-rl" class="ts" x="340" y="186" text-anchor="middle"></text>
</svg>
<div class="cl-row"><label for="cl-q1">Charge 1</label><input type="range" id="cl-q1" min="-4" max="4" step="1" value="2" style="flex:1"><output id="cl-q1o"></output></div>
<div class="cl-row"><label for="cl-q2">Charge 2</label><input type="range" id="cl-q2" min="-4" max="4" step="1" value="2" style="flex:1"><output id="cl-q2o"></output></div>
<div class="cl-row"><label for="cl-r">Distance</label><input type="range" id="cl-r" min="2" max="8" step="0.5" value="4" style="flex:1"><output id="cl-ro"></output></div>
<div class="cl-stats">
<div class="cl-stat"><span>Force on each charge</span><b id="cl-F"></b></div>
<div class="cl-stat"><span>Push or pull</span><b id="cl-kind"></b></div>
<div class="cl-stat"><span>Compared with the start</span><b id="cl-rel"></b></div>
</div>
<div class="cl-acts">
<button id="cl-reset">Reset</button>
<button class="ld-ask" onclick="sendPrompt('Show me the maths behind Coulomb\'s law')">Show me the maths ↗</button>
<button class="ld-ask" onclick="sendPrompt('Next: how do forces from three or more charges combine?')">Next: three or more charges ↗</button>
<button class="ld-ask" onclick="sendPrompt('Quiz me on Coulomb\'s law')">Quiz me ↗</button>
</div>
<script>
(function(){
var K=8.9875e9, NS='http://www.w3.org/2000/svg', $=function(i){return document.getElementById(i)};
var F0=K*4e-18/Math.pow(0.04,2);
function col(q){return q>0?'#D85A30':q<0?'#378ADD':'#888780'}
function sign(q){return q>0?'+':q<0?'−':'0'}
function arrow(g,x,y,dir,L){
  var x2=Math.max(20,Math.min(660,x+dir*L)), h=Math.min(9,L);
  var ln=document.createElementNS(NS,'line');
  ln.setAttribute('x1',x);ln.setAttribute('y1',y);ln.setAttribute('x2',x2-dir*h*0.8);ln.setAttribute('y2',y);
  ln.setAttribute('stroke','var(--text-primary)');ln.setAttribute('stroke-width','2.5');g.appendChild(ln);
  var p=document.createElementNS(NS,'polygon');
  p.setAttribute('points',x2+','+y+' '+(x2-dir*h)+','+(y-h*0.5)+' '+(x2-dir*h)+','+(y+h*0.5));
  p.setAttribute('fill','var(--text-primary)');g.appendChild(p);
}
function draw(){
  var q1=+$('cl-q1').value,q2=+$('cl-q2').value,r=+$('cl-r').value;
  var F=K*q1*q2*1e-18/Math.pow(r/100,2), a=Math.abs(F);
  var sep=r*50,x1=340-sep/2,x2=340+sep/2;
  [[1,x1,q1],[2,x2,q2]].forEach(function(c){
    $('cl-c'+c[0]).setAttribute('cx',c[1]);$('cl-c'+c[0]).setAttribute('fill',col(c[2]));
    $('cl-s'+c[0]).setAttribute('x',c[1]);$('cl-s'+c[0]).textContent=sign(c[2]);
  });
  var g=$('cl-arrows');while(g.firstChild)g.removeChild(g.firstChild);
  if(a>0){
    var L=Math.max(6,Math.min(190,a/F0*40)), d=F>0?-1:1;
    arrow(g,x1,58,d,L);arrow(g,x2,142,-d,L);
  }
  $('cl-rl').textContent='distance '+r.toFixed(1)+' cm';
  $('cl-q1o').textContent=sign(q1)+(q1?Math.abs(q1):'')+' nC';
  $('cl-q2o').textContent=sign(q2)+(q2?Math.abs(q2):'')+' nC';
  $('cl-ro').textContent=r.toFixed(1)+' cm';
  $('cl-F').textContent=a===0?'none':(a*1e6).toFixed(a*1e6<10?1:0)+' µN';
  $('cl-kind').textContent=F>0?'Push apart':F<0?'Pull together':'No force';
  var rel=a/F0;
  $('cl-rel').textContent=a===0?'—':(rel>=1?'×'+(rel<10?rel.toFixed(2).replace(/\.?0+$/,''):Math.round(rel)):'1/'+(1/rel<10?(1/rel).toFixed(2).replace(/\.?0+$/,''):Math.round(1/rel)));
}
['cl-q1','cl-q2','cl-r'].forEach(function(i){$(i).addEventListener('input',draw)});
$('cl-reset').addEventListener('click',function(){$('cl-q1').value=2;$('cl-q2').value=2;$('cl-r').value=4;draw()});
draw();
})();
</script>
