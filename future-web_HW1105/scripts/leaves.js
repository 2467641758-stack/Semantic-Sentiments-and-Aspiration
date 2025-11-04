
(() => {
    // 只在 Use Cases 页运行
    if (!document.body.classList.contains('usecases')) return;
  
    const PALETTE = [
      '#86efac','#a7f3d0','#34d399', 
      '#fde68a','#fca5a5','#fbcfe8', 
      '#93c5fd','#ddd6fe'            
    ];
  
    const LEAF_MIN = 42;   
    const LEAF_MAX = 96;   
    let leaves = [];
    let t0 = 0;
  
    class Leaf {
      constructor(initial = false) { this.reset(initial); }
      reset(initial) {
        this.x = random(-50, width + 50);
        this.y = initial ? random(-height, height) : -random(20, 200);
        this.size = random(12, 28);
        this.speed = random(0.5, 1.4);    
        this.swayAmp = random(10, 28);    
        this.swayFreq = random(0.0025, 0.006); 
        this.rot = random(TWO_PI);
        this.rotSpeed = random(-0.01, 0.01);
        this.col = color(random(PALETTE));
        this.shape = floor(random(3));    
      }
      update(t) {
        this.y += this.speed;
        this.x += sin(t * this.swayFreq + this.x * 0.01) * 0.6;
        this.rot += this.rotSpeed;
        if (this.y - this.size > height + 30) this.reset(false);
      }
      draw() {
        push();
        translate(this.x, this.y);
        rotate(this.rot);
        noStroke();
        // 半透明，柔和一些
        const a = 170;
        fill(red(this.col), green(this.col), blue(this.col), a);
        switch (this.shape) {
          case 0: 
            ellipse(0, 0, this.size * 0.9, this.size * 1.2);
            break;
          case 1: 
            beginShape();
            vertex(0, -this.size * 0.6);
            bezierVertex(this.size * 0.7, -this.size * 0.6, this.size * 0.7, this.size * 0.3, 0, this.size * 0.6);
            bezierVertex(-this.size * 0.7, this.size * 0.3, -this.size * 0.7, -this.size * 0.6, 0, -this.size * 0.6);
            endShape(CLOSE);
            break;
          default: 
            beginShape();
            vertex(-this.size * 0.15, -this.size * 0.7);
            bezierVertex(this.size * 0.4, -this.size * 0.5, this.size * 0.4, this.size * 0.5, -this.size * 0.15, this.size * 0.7);
            bezierVertex(-this.size * 0.6, this.size * 0.5, -this.size * 0.6, -this.size * 0.5, -this.size * 0.15, -this.size * 0.7);
            endShape(CLOSE);
        }
        pop();
      }
    }
  
    
    window.setup = function () {
      const c = createCanvas(windowWidth, windowHeight);
      c.position(0, 0);
      c.style('position', 'fixed');
      c.style('top', '0'); c.style('left', '0');
      c.style('width', '100vw'); c.style('height', '100vh');
      c.style('pointer-events', 'none');
      c.style('z-index', '1');      
      c.style('opacity', '0.22');    
  
      pixelDensity(1);              
      frameRate(60);
  
      const target = constrain(floor((windowWidth * windowHeight) / 22000), LEAF_MIN, LEAF_MAX);
      leaves = Array.from({ length: target }, () => new Leaf(true));
      t0 = millis();
    };
  
    window.draw = function () {
      clear(); 
      const t = (millis() - t0);
      for (const leaf of leaves) {
        leaf.update(t);
        leaf.draw();
      }
    };
  
    window.windowResized = function () {
      resizeCanvas(windowWidth, windowHeight);
      const target = constrain(floor((windowWidth * windowHeight) / 22000), LEAF_MIN, LEAF_MAX);
      const delta = target - leaves.length;
      if (delta > 0) {
        for (let i = 0; i < delta; i++) leaves.push(new Leaf(true));
      } else if (delta < 0) {
        leaves.splice(target);
      }
    };
  
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) noLoop(); else loop();
    });
  })();
  