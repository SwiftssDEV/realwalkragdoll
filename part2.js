window.mx=0; window.my=0; window.isDragging=false; window.draggedPoint=null;
window.addEventListener('mousemove',e=>{window.mx=e.clientX;window.my=e.clientY;},true);
window.addEventListener('mousedown',()=>{
    let d=Math.sqrt((window.mx-p.head.x)**2+(window.my-p.head.y)**2);
    if(d<25){
        window.isDragging=true; window.draggedPoint=p.head;
        if(Math.random()>0.5){
            let pr=['Отпусти голову!','Ааа, VR костюм забаговался!','Хватит меня дёргать!'];
            let md=document.createElement('div');
            md.innerHTML='<b>Геймер:</b> '+pr[Math.floor(Math.random()*pr.length)];
            log.appendChild(md); log.scrollTop=log.scrollHeight;
        }
    }
},true);
window.addEventListener('mouseup',()=>{window.isDragging=false;window.draggedPoint=null;});
window.r={x:window.innerWidth/2,y:150,vx:0,vy:0,targetX:window.innerWidth/2};
window.p={head:{x:0,y:-32},chest:{x:0,y:-16},pelvis:{x:0,y:0},lHip:{x:-5,y:2},lKnee:{x:-8,y:16},lFoot:{x:-6,y:32},rHip:{x:5,y:2},rKnee:{x:8,y:16},rFoot:{x:6,y:32},lShld:{x:-8,y:-16},lElbow:{x:-16,y:-8},lHand:{x:-22,y:0},rShld:{x:8,y:-16},rElbow:{x:16,y:-8},rHand:{x:22,y:0}};
window.walkCycle=0;
window.solveIK = function(bx,by,tx,ty,l1,l2,f){
    let dx=tx-bx,dy=ty-by,d=Math.sqrt(dx*dx+dy*dy);
    if(d>l1+l2){let a=Math.atan2(dy,dx);return{x:bx+Math.cos(a)*l1,y:by+Math.sin(a)*l1};}
    let a=l1,b=l2,c=d;let cos1=(a*a+c*c-b*b)/(2*a*c);if(isNaN(cos1))cos1=1;
    let ang=Math.atan2(dy,dx)+(f?Math.acos(cos1):-Math.acos(cos1));
    return{x:bx+Math.cos(ang)*l1,y:by+Math.sin(ang)*l1};
};
window.findGround = function(sx,cy){
    let b=window.innerHeight;
    for(let p of platforms){if(sx>=p.left&&sx<=p.right&&p.top>=cy-15&&p.top<b)b=p.top;}
    return b;
};
