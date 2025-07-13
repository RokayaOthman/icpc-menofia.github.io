const canvas = document.getElementById("balloonCanvas");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  random = Math.random()

  const balloons = Array.from({ length: 10 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 300,
    radiusX: 20 + random * 30,
    radiusY: 40 + random * 30,
    speed: 1 + Math.random() * 1.5,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    waveOffset: Math.random() * 100,       // Phase shift
    waveAmplitude: 5 + Math.random() * 10, // How far it sways left/right
    waveFrequency: 0.01 + Math.random() * 0.01,
    done: false
  }));
  balloons.forEach(b => b.baseX = b.x);

  let animationId;

  function drawBalloon(balloon) {
    const { x, y, radiusX, radiusY, color } = balloon;

    // Balloon body
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Knot
    ctx.beginPath();
    ctx.moveTo(x, y + radiusY);
    ctx.lineTo(x - 5, y + radiusY + 10);
    ctx.lineTo(x + 5, y + radiusY + 10);
    ctx.closePath();
    ctx.fill();

    // String
    ctx.beginPath();
    ctx.moveTo(x, y + radiusY + 10);
    ctx.lineTo(x, y + radiusY + 70);
    ctx.strokeStyle = "#333";
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allGone = true;

    for (const balloon of balloons) {
      if (!balloon.done) {
        balloon.y -= balloon.speed;
        balloon.x = balloon.baseX + Math.sin(balloon.y * balloon.waveFrequency + balloon.waveOffset) * balloon.waveAmplitude;
        // Check if this balloon has floated off-screen
        if (balloon.y + balloon.radiusY < 0) {
          balloon.done = true;
        } else {
          allGone = false;
        }

        drawBalloon(balloon);
      }
    }

    if (allGone) {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.remove(); // optional
    } else {
      animationId = requestAnimationFrame(animate);
    }
  }

  animate();