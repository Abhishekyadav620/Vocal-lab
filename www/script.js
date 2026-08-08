// ==================== PARTICLES ====================
(function(){
    var c=document.getElementById('particleCanvas');if(!c)return;
    var x=c.getContext('2d'),w,h,pts=[],N=40,D=140,D2=D*D,lastTime=0,fpsInterval=1000/30;
    function rs(){w=c.width=innerWidth;h=c.height=innerHeight}
    addEventListener('resize',rs);rs();
    for(var i=0;i<N;i++)pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.2+.4});
    var mx=-1,my=-1;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
    function draw(now){
        requestAnimationFrame(draw);
        if(now - lastTime < fpsInterval) return;
        lastTime = now;
        x.clearRect(0,0,w,h);
        for(var i=0;i<pts.length;i++){
            var p=pts[i];p.x+=p.vx;p.y+=p.vy;
            if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
            x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle='rgba(0,212,255,0.3)';x.fill();
            for(var j=i+1;j<pts.length;j++){
                var q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d2=dx*dx+dy*dy;
                if(d2<D2){var d=Math.sqrt(d2);x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.strokeStyle='rgba(0,212,255,'+(1-d/D)*.1+')';x.lineWidth=.5;x.stroke()}
            }
            if(mx>0){var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
                if(d2<32400){var d=Math.sqrt(d2);x.beginPath();x.moveTo(p.x,p.y);x.lineTo(mx,my);x.strokeStyle='rgba(0,212,255,'+(1-d/180)*.15+')';x.lineWidth=.6;x.stroke()}}
        }
    }
    requestAnimationFrame(draw);
})();

// ==================== BOOT SEQUENCE ====================
(function(){
    var lines=['bl1','bl2','bl3','bl4','bl5'],bar=document.getElementById('bootFill'),p=0;
    function finishBoot(){
        var b=document.getElementById('BootScreen');
        if(b) b.remove();
        var m=document.getElementById('JarvisMain');
        if(m) m.removeAttribute('hidden');
        var cb=document.getElementById('chatbox');
        if(cb) cb.focus();
    }
    var bElem=document.getElementById('BootScreen');
    if(bElem) bElem.addEventListener('click', finishBoot);

    var iv=setInterval(function(){
        p+=1;if(bar)bar.style.width=p+'%';
        if(p===12){var e=document.getElementById(lines[0]);if(e)e.classList.add('vis')}
        if(p===32){var e=document.getElementById(lines[1]);if(e)e.classList.add('vis')}
        if(p===55){var e=document.getElementById(lines[2]);if(e)e.classList.add('vis')}
        if(p===78){var e=document.getElementById(lines[3]);if(e)e.classList.add('vis')}
        if(p===95){var e=document.getElementById(lines[4]);if(e)e.classList.add('vis')}
        if(p>=100){
            clearInterval(iv);
            setTimeout(finishBoot, 400);
        }
    },25);
})();

// ==================== CLOCK ====================
(function(){
    var days=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var months=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    function upd(){
        var n=new Date(),h=String(n.getHours()).padStart(2,'0'),m=String(n.getMinutes()).padStart(2,'0');
        var tT=document.getElementById('topTime'),tDy=document.getElementById('topDay'),tDt=document.getElementById('topDate');
        if(tT)tT.textContent=h+':'+m;
        if(tDy)tDy.textContent=n.getDate();
        if(tDt)tDt.textContent=months[n.getMonth()]+' '+days[n.getDay()];
    }
    upd();setInterval(upd,1000);
})();

// ==================== RADAR ====================
(function(){
    var c=document.getElementById('radarCanvas');if(!c)return;
    var x=c.getContext('2d'),angle=0;
    function draw(){
        var w=c.width,h=c.height,cx=w/2,cy=h/2,r=Math.min(cx,cy)-5;
        x.clearRect(0,0,w,h);
        // Rings
        for(var i=1;i<=4;i++){x.beginPath();x.arc(cx,cy,r*i/4,0,Math.PI*2);x.strokeStyle='rgba(0,212,255,0.12)';x.lineWidth=.5;x.stroke()}
        // Cross
        x.beginPath();x.moveTo(cx-r,cy);x.lineTo(cx+r,cy);x.moveTo(cx,cy-r);x.lineTo(cx,cy+r);x.strokeStyle='rgba(0,212,255,0.08)';x.stroke();
        // Sweep
        var grad=x.createConicalGradient?null:null;
        x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,angle-0.5,angle);x.closePath();
        x.fillStyle='rgba(0,212,255,0.15)';x.fill();
        x.beginPath();x.moveTo(cx,cy);var ex=cx+Math.cos(angle)*r,ey=cy+Math.sin(angle)*r;
        x.lineTo(ex,ey);x.strokeStyle='rgba(0,212,255,0.6)';x.lineWidth=1.5;x.stroke();
        // Blips
        var t=Date.now()/1000;
        for(var i=0;i<5;i++){
            var ba=i*1.256+Math.sin(t*.2+i)*0.3,bd=r*(.3+i*.12);
            var bx=cx+Math.cos(ba)*bd,by=cy+Math.sin(ba)*bd;
            var diff=Math.abs(((angle-ba)%(Math.PI*2)+Math.PI*2)%(Math.PI*2));
            if(diff<1.5){x.beginPath();x.arc(bx,by,2,0,Math.PI*2);x.fillStyle='rgba(0,212,255,'+(1-diff/1.5)*.8+')';x.fill()}
        }
        angle+=0.02;if(angle>Math.PI*2)angle-=Math.PI*2;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ==================== AUDIO LEVELS ====================
(function(){
    var c=document.getElementById('audioLevelCanvas');if(!c)return;
    var x=c.getContext('2d'),bars=24,vals=[];
    for(var i=0;i<bars;i++)vals.push(Math.random());
    function draw(){
        var w=c.width,h=c.height,bw=w/bars;
        x.clearRect(0,0,w,h);
        for(var i=0;i<bars;i++){
            vals[i]+=(Math.random()-.5)*.15;vals[i]=Math.max(.05,Math.min(1,vals[i]));
            var bh=vals[i]*h*.8,by=h-bh;
            x.fillStyle='rgba(0,212,255,'+(0.3+vals[i]*0.5)+')';
            x.fillRect(i*bw+1,by,bw-2,bh);
        }
        setTimeout(function(){requestAnimationFrame(draw)},100);
    }
    draw();
})();

// ==================== ORB TICKS ====================
(function(){
    var g=document.getElementById('orbTicks');if(!g)return;
    for(var i=0;i<60;i++){
        var a=i*6*Math.PI/180,r1=122,r2=i%5===0?128:125;
        var l=document.createElementNS('http://www.w3.org/2000/svg','line');
        l.setAttribute('x1',130+Math.cos(a)*r1);l.setAttribute('y1',130+Math.sin(a)*r1);
        l.setAttribute('x2',130+Math.cos(a)*r2);l.setAttribute('y2',130+Math.sin(a)*r2);
        l.setAttribute('stroke','rgba(0,212,255,0.3)');l.setAttribute('stroke-width',i%5===0?'1':'0.5');
        g.appendChild(l);
    }
})();

// ==================== REAL-TIME STATS ====================
(function(){
    var diskCreated=false;
    function poll(){
        if(typeof eel==='undefined')return;
        eel.getSystemStats()(function(d){
            if(!d)return;
            // CPU
            var cb=document.getElementById('cpuBar'),cv=document.getElementById('cpuVal');
            if(cb)cb.style.width=d.cpu+'%';if(cv)cv.textContent=Math.round(d.cpu)+'%';
            // RAM
            var rb=document.getElementById('ramBar'),rv=document.getElementById('ramVal');
            if(rb)rb.style.width=d.ram+'%';if(rv)rv.textContent=Math.round(d.ram)+'%';
            // RAM gauge (top bar)
            var ra=document.getElementById('ramArc'),rp=document.getElementById('ramPct');
            if(ra){var off=150.8*(1-d.ram/100);ra.setAttribute('stroke-dashoffset',off)}
            if(rp)rp.textContent=Math.round(d.ram)+'%';
            // Network
            var ns=document.getElementById('netSent'),nr=document.getElementById('netRecv'),ip=document.getElementById('ipAddr');
            if(ns)ns.textContent=d.net_sent+' MB';if(nr)nr.textContent=d.net_recv+' MB';if(ip)ip.textContent=d.ip;
            // Disks — create elements once, update values after
            var dc=document.getElementById('diskBars');
            if(dc&&d.disks){
                if(!diskCreated){
                    dc.innerHTML='';
                    for(var k in d.disks){
                        var item=document.createElement('div');item.className='disk-item';item.dataset.disk=k;
                        var lbl=document.createElement('span');lbl.textContent=k;
                        var bar=document.createElement('div');bar.className='disk-bar';
                        var fill=document.createElement('div');fill.className='disk-fill dsk-fill';fill.style.width=d.disks[k]+'%';
                        var val=document.createElement('span');val.textContent=d.disks[k]+'%';
                        bar.appendChild(fill);
                        item.appendChild(lbl);item.appendChild(bar);item.appendChild(val);
                        dc.appendChild(item);
                    }
                    diskCreated=true;
                } else {
                    for(var k in d.disks){
                        var item=dc.querySelector('[data-disk="'+k+'"]');
                        if(item){
                            var fill=item.querySelector('.disk-fill');
                            var val=item.querySelector('span:last-child');
                            if(fill)fill.style.width=d.disks[k]+'%';
                            if(val)val.textContent=d.disks[k]+'%';
                        }
                    }
                }
            }
        });
    }
    setInterval(poll,2000);setTimeout(poll,3000);
})();

// ==================== QUICK CMD ====================
function quickCmd(cmd){if(typeof eel!=='undefined')eel.allCommands(cmd)()}

// ==================== MOBILE PANELS ====================
function toggleLeftPanel(){
    var p = document.querySelector('.panel-left');
    if(p) p.classList.toggle('active');
}
function toggleRightPanel(){
    var p = document.querySelector('.panel-right');
    if(p) p.classList.toggle('active');
}