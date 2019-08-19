function GradCircle(ctx) {
  var self = this;

  self.ctx = ctx;

  self.drawGradCircle = function (x, y, radius) {
    self.ctx.beginPath();
    var grad = this.ctx.createRadialGradient(x, y, 0, x, y, radius/2);
    grad.addColorStop(0,'rgb(255, 0, 0)');
    grad.addColorStop(1,'rgba(255,0,0,0)');
    self.ctx.fillStyle = grad;
    self.ctx.rect(x - radius/2 ,y - radius/2, x+radius/2, y+ radius/2);
    self.ctx.fill();
    // self.ctx.beginPath();
    // self.ctx.arc(x, y, radius/2 , 0, Math.PI * 2);
    // self.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    // self.ctx.strokeWidth = 1;
    // self.ctx.stroke();
  }

}
