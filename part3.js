window.aiTimer=0; window.aiDir=1;
window.updateGame = function(){
    if(window.isDragging){
        r.x+=(window.mx-r.x)*0.2; r.y+=(window.my+20-r.y)*0.2; r.vx=0; r.vy=0;
    }else{
        window.aiTimer--;
        if(window.aiTimer<=0){window.aiTimer=100+Math.random()*120;window.aiDir=Math.random()>0.5?1:-1;if(Math.random()>0.7)window.aiDir=0;}
        if(window.aiDir!==0){r.targetX+=window.aiDir*1.5;window.walkCycle+=0.1;}
        r.vx=(r.targetX-r.x)*0.08; r.x+=r.vx;
        let gY=window.findGround(r.x,r.y); r.y+=(gY-34-r.y)*0.12;
    }
    let inertia=r.vx*0.6; p.pelvis.x=r.x; p.pelvis.y=r.y; p.chest.x=r.x+inertia; p.chest.y=r.y-15; p.head.x=r.x+inertia*1.3; p.head.y=r.y-32;
    p.lHip.x=r.x-4; p.lHip.y=r.y+2; p.rHip.x=r.x+4; p.rHip.y=r.y+2;
    let lIdealX=r.x-8+Math.sin(window.walkCycle)*12; let lIdealY=window.findGround(lIdealX,r.y);
    p.lKnee=window.solveIK(p.lHip.x,p.lHip.y,lIdealX,lIdealY,15,15,false); p.lFoot={x:lIdealX,y:lIdealY};
    let rIdealX=r.x+8-Math.sin(window.walkCycle)*12; let rIdealY=window.findGround(rIdealX,r.y);
    p.rKnee=window.solveIK(p.rHip.x,p.rHip.y,rIdealX,rIdealY,15,15,true); p.rFoot={x:rIdealX,y:rIdealY};
    p.lShld.x=p.chest.x-5; p.lShld.y=p.chest.y-3; p.rShld.x=p.chest.x+5; p.rShld.y=p.chest.y-3;
    p.lElbow=window.solveIK(p.lShld.x,p.lShld.y,r.x-14,r.y-5,10,10,true); p.lHand={x:r.x-14,y:r.y-5};
    p.rElbow=window.solveIK(p.rShld.x,p.rShld.y,r.x+14,r.y-5,10,10,false); p.rHand={x:r.x+14,y:r.y-5};
    ctx.clearRect(0,0,cv.width,cv.height); ctx.strokeStyle='#000000'; ctx.fillStyle='#000000'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.arc(p.head.x,p.head.y,5.5,0,Math.PI*2); ctx.fill();
    function dB(p1,p2){ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
    dB(p.head,p.chest); dB(p.chest,p.pelvis); dB(p.chest,p.lShld); dB(p.lShld,p.lElbow); dB(p.lElbow,p.lHand); dB(p.chest,p.rShld); dB(p.rShld,p.rElbow); dB(p.rElbow,p.rHand);
    dB(p.pelvis,p.lHip); dB(p.lHip,p.lKnee); dB(p.lKnee,p.lFoot); dB(p.pelvis,p.rHip); dB(p.rHip,p.rKnee); dB(p.rKnee,p.rFoot);
    requestAnimationFrame(window.updateGame);
};
