
(() => {
  // 只在concept页运行
  if (document.body.classList.contains('usecases')) return;

  const R = 120;                               
  const DRY_R = Math.round(R * 1.25);          
  const OPACITY = 0.26;                         
  const DENSITY_BASE = 14000;                   
  const SPEED_MIN = 7, SPEED_MAX = 15;          
  const LEN_MIN = 12, LEN_MAX = 24;             

  let drops = [];
  let mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 };

  // 追踪鼠标
  document.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  // 雨滴
  class Drop {
    constructor(init=false){ this.reset(init); }
    reset(init){
      this.x = random(-50, width + 50);
      this.y = init ? random(-height, height) : -random(20, 300);
      this.speed = random(SPEED_MIN, SPEED_MAX);
      this.len = random(LEN_MIN, LEN_MAX);
      this.wind = random(-0.6, 0.6); 
    }
    update(){
      this.y += this.speed;
      this.x += this.wind;
      if (this.y - this.len > height + 30) this.reset(false);
    }
    // 命中检测：竖直线段与伞下半圆相交则不画，进一步减少伞下雨滴
    underUmbrella(){
      const top = this.y - this.len;
      const bottom = this.y;
      if (bottom <= mouse.y) return false;
      const yClosest = constrain(mouse.y, top, bottom);
      const dx = this.x - mouse.x;
      const dy = yClosest - mouse.y;       
      return (dx*dx + dy*dy) < (DRY_R * DRY_R);
    }
    draw(){
      if (this.underUmbrella()) return; // 伞下不画
      stroke(220, 230, 255, 200);
      strokeWeight(1.15);
      line(this.x, this.y - this.len, this.x, this.y);
    }
  }

  // p5 生命周期
  window.setup = function(){
    const c = createCanvas(windowWidth, windowHeight);
    c.position(0, 0);
    c.style('position', 'fixed');
    c.style('top', '0'); c.style('left', '0');
    c.style('width', '100vw'); c.style('height', '100vh');
    c.style('pointer-events', 'none');
    c.style('z-index', '3');
    c.style('opacity', String(OPACITY));

    pixelDensity(1);
    frameRate(60);

    const target = constrain(Math.floor((windowWidth * windowHeight) / DENSITY_BASE), 200, 1000);
    drops = Array.from({ length: target }, () => new Drop(true));
  };

  window.draw = function(){
    clear();
    // 画雨
    for (const d of drops){ d.update(); d.draw(); }
    // 设置伞下干燥区
    carveDryZone(mouse.x, mouse.y);
    // 画伞
    drawUmbrella(mouse.x, mouse.y);
  };

  window.windowResized = function(){
    resizeCanvas(windowWidth, windowHeight);
    const target = constrain(Math.floor((windowWidth * windowHeight) / DENSITY_BASE), 200, 1000);
    const delta = target - drops.length;
    if (delta > 0) { for (let i = 0; i < delta; i++) drops.push(new Drop(true)); }
    else if (delta < 0) { drops.splice(target); }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) noLoop(); else loop();
  });

  // 挖掉伞下半圆区域的雨
  function carveDryZone(x, y){
    push();
    drawingContext.save();
    drawingContext.globalCompositeOperation = 'destination-out';
    noStroke();
    fill(0, 0, 0, 255);
    arc(x, y, DRY_R * 2, DRY_R * 2, PI, TWO_PI, PIE);
    drawingContext.restore();
    pop();
  }

  // 伞造型
  function drawUmbrella(x, y){
    push();
    noStroke();

    // 伞面阴影
    fill(0, 0, 0, 60);
    arc(x + 6, y + 8, R * 2, R * 2, PI, TWO_PI);

    // 伞面渐变
    drawingContext.save();
    const g = drawingContext.createLinearGradient(x, y - R, x, y + R);
    g.addColorStop(0, '#93c5fd');  
    g.addColorStop(1, '#a7f3d0');  
    drawingContext.fillStyle = g;
    arc(x, y, R * 2, R * 2, PI, TWO_PI);
    drawingContext.restore();

    // 伞柄
    stroke(230, 230, 240, 220);
    strokeWeight(3);
    line(x, y, x, y + R + 22);
    noFill();
    strokeWeight(3);
    arc(x + 14, y + R + 22, 28, 28, HALF_PI, PI); // 小勾

    pop();
  }
})();
