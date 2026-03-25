/**
 * AI PET LAB — Unified Pet Sprite System
 * Renders a consistent, animated pet across all lessons.
 * Pet type (dog/cat/robot) and color persist from lesson 1 via localStorage.
 */

const PetSprite = (function() {
  // Get saved pet config
  const petType = localStorage.getItem('petlab_pet_type') || 'dog';
  const petColor = localStorage.getItem('petlab_pet_color') || '#FF6B35';

  const PETS = {
    dog: {
      body: (ctx, x, y, s, state) => {
        // Body
        ctx.fillStyle = petColor;
        ctx.beginPath();
        ctx.ellipse(x, y + s * 0.1, s * 0.35, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(x, y - s * 0.2, s * 0.22, 0, Math.PI * 2);
        ctx.fill();
        // Ears (floppy)
        ctx.beginPath();
        ctx.ellipse(x - s * 0.2, y - s * 0.35, s * 0.08, s * 0.14, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + s * 0.2, y - s * 0.35, s * 0.08, s * 0.14, 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.strokeStyle = petColor;
        ctx.lineWidth = s * 0.06;
        ctx.lineCap = 'round';
        const tailWag = state === 'happy' ? Math.sin(Date.now() / 150) * 0.4 : 0.2;
        ctx.beginPath();
        ctx.moveTo(x + s * 0.3, y + s * 0.05);
        ctx.quadraticCurveTo(x + s * 0.45, y - s * 0.15 + tailWag * s * 0.2, x + s * 0.4, y - s * 0.2);
        ctx.stroke();
      },
      face: (ctx, x, y, s, state, blink) => {
        const ey = y - s * 0.22;
        // Eyes
        if (blink) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = s * 0.03;
          ctx.beginPath(); ctx.moveTo(x - s * 0.08, ey); ctx.lineTo(x - s * 0.04, ey); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + s * 0.04, ey); ctx.lineTo(x + s * 0.08, ey); ctx.stroke();
        } else {
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.arc(x - s * 0.06, ey, s * 0.03, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + s * 0.06, ey, s * 0.03, 0, Math.PI * 2); ctx.fill();
          // Eye shine
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(x - s * 0.055, ey - s * 0.01, s * 0.012, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + s * 0.065, ey - s * 0.01, s * 0.012, 0, Math.PI * 2); ctx.fill();
        }
        // Nose
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(x, y - s * 0.14, s * 0.025, 0, Math.PI * 2); ctx.fill();
        // Mouth
        if (state === 'happy') {
          ctx.strokeStyle = '#333'; ctx.lineWidth = s * 0.02;
          ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.06, 0.1, Math.PI - 0.1); ctx.stroke();
        } else if (state === 'confused') {
          ctx.strokeStyle = '#333'; ctx.lineWidth = s * 0.02;
          ctx.beginPath(); ctx.moveTo(x - s * 0.04, y - s * 0.1); ctx.lineTo(x + s * 0.04, y - s * 0.08); ctx.stroke();
        } else if (state === 'sad') {
          ctx.strokeStyle = '#333'; ctx.lineWidth = s * 0.02;
          ctx.beginPath(); ctx.arc(x, y - s * 0.08, s * 0.05, Math.PI + 0.2, -0.2); ctx.stroke();
        }
      }
    },
    cat: {
      body: (ctx, x, y, s, state) => {
        ctx.fillStyle = petColor;
        // Body (sleeker than dog)
        ctx.beginPath();
        ctx.ellipse(x, y + s * 0.1, s * 0.3, s * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(x, y - s * 0.2, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Pointed ears
        ctx.beginPath();
        ctx.moveTo(x - s * 0.15, y - s * 0.32);
        ctx.lineTo(x - s * 0.22, y - s * 0.48);
        ctx.lineTo(x - s * 0.06, y - s * 0.35);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + s * 0.15, y - s * 0.32);
        ctx.lineTo(x + s * 0.22, y - s * 0.48);
        ctx.lineTo(x + s * 0.06, y - s * 0.35);
        ctx.fill();
        // Tail (curvy)
        ctx.strokeStyle = petColor;
        ctx.lineWidth = s * 0.05;
        ctx.lineCap = 'round';
        const curl = state === 'happy' ? Math.sin(Date.now() / 200) * 0.3 : 0;
        ctx.beginPath();
        ctx.moveTo(x + s * 0.25, y + s * 0.15);
        ctx.bezierCurveTo(x + s * 0.5, y + s * 0.1, x + s * 0.45 + curl * s * 0.1, y - s * 0.2, x + s * 0.35, y - s * 0.25);
        ctx.stroke();
      },
      face: (ctx, x, y, s, state, blink) => {
        const ey = y - s * 0.22;
        // Cat eyes (more almond-shaped)
        if (blink) {
          ctx.strokeStyle = '#000'; ctx.lineWidth = s * 0.025;
          ctx.beginPath(); ctx.moveTo(x - s * 0.1, ey); ctx.lineTo(x - s * 0.03, ey); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + s * 0.03, ey); ctx.lineTo(x + s * 0.1, ey); ctx.stroke();
        } else {
          ctx.fillStyle = '#2a2';
          ctx.beginPath(); ctx.ellipse(x - s * 0.06, ey, s * 0.035, s * 0.025, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + s * 0.06, ey, s * 0.035, s * 0.025, 0, 0, Math.PI * 2); ctx.fill();
          // Pupils (vertical slits)
          ctx.fillStyle = '#000';
          ctx.beginPath(); ctx.ellipse(x - s * 0.06, ey, s * 0.012, s * 0.022, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + s * 0.06, ey, s * 0.012, s * 0.022, 0, 0, Math.PI * 2); ctx.fill();
        }
        // Nose (triangle)
        ctx.fillStyle = '#e8a';
        ctx.beginPath();
        ctx.moveTo(x, y - s * 0.16);
        ctx.lineTo(x - s * 0.02, y - s * 0.13);
        ctx.lineTo(x + s * 0.02, y - s * 0.13);
        ctx.fill();
        // Whiskers
        ctx.strokeStyle = '#55556a'; ctx.lineWidth = s * 0.01;
        [-1, 1].forEach(side => {
          ctx.beginPath(); ctx.moveTo(x + side * s * 0.05, y - s * 0.13); ctx.lineTo(x + side * s * 0.2, y - s * 0.15); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + side * s * 0.05, y - s * 0.11); ctx.lineTo(x + side * s * 0.18, y - s * 0.1); ctx.stroke();
        });
        // Mouth
        if (state === 'happy') {
          ctx.strokeStyle = '#333'; ctx.lineWidth = s * 0.015;
          ctx.beginPath(); ctx.arc(x, y - s * 0.1, s * 0.04, 0.1, Math.PI - 0.1); ctx.stroke();
        }
      }
    },
    robot: {
      body: (ctx, x, y, s, state) => {
        // Body (boxy)
        ctx.fillStyle = petColor;
        const bw = s * 0.5, bh = s * 0.4;
        ctx.beginPath();
        ctx.roundRect(x - bw / 2, y - s * 0.05, bw, bh, s * 0.05);
        ctx.fill();
        // Head
        const hw = s * 0.4, hh = s * 0.32;
        ctx.beginPath();
        ctx.roundRect(x - hw / 2, y - s * 0.4, hw, hh, s * 0.04);
        ctx.fill();
        // Antenna
        ctx.strokeStyle = petColor; ctx.lineWidth = s * 0.03;
        ctx.beginPath(); ctx.moveTo(x, y - s * 0.4); ctx.lineTo(x, y - s * 0.5); ctx.stroke();
        // Antenna tip (blinks)
        const blink = Math.sin(Date.now() / 300) > 0;
        ctx.fillStyle = blink ? '#fff' : petColor + '80';
        ctx.beginPath(); ctx.arc(x, y - s * 0.52, s * 0.03, 0, Math.PI * 2); ctx.fill();
        // Arms
        ctx.strokeStyle = petColor; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round';
        const wave = state === 'happy' ? Math.sin(Date.now() / 200) * 0.2 : 0;
        ctx.beginPath(); ctx.moveTo(x - bw / 2, y + s * 0.05); ctx.lineTo(x - s * 0.35, y + s * 0.15 + wave * s * 0.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + bw / 2, y + s * 0.05); ctx.lineTo(x + s * 0.35, y + s * 0.15 - wave * s * 0.1); ctx.stroke();
      },
      face: (ctx, x, y, s, state, blink) => {
        const ey = y - s * 0.28;
        // LED eyes
        const eyeColor = state === 'happy' ? '#4ade80' : state === 'confused' ? '#fb923c' : state === 'sad' ? '#f87171' : '#38bdf8';
        if (blink) {
          ctx.fillStyle = eyeColor + '40';
        } else {
          ctx.fillStyle = eyeColor;
        }
        ctx.beginPath(); ctx.roundRect(x - s * 0.12, ey - s * 0.025, s * 0.08, s * 0.05, s * 0.01); ctx.fill();
        ctx.beginPath(); ctx.roundRect(x + s * 0.04, ey - s * 0.025, s * 0.08, s * 0.05, s * 0.01); ctx.fill();
        // Mouth (LED display)
        ctx.fillStyle = eyeColor + '80';
        if (state === 'happy') {
          ctx.beginPath(); ctx.roundRect(x - s * 0.06, y - s * 0.18, s * 0.12, s * 0.03, s * 0.01); ctx.fill();
        } else if (state === 'confused') {
          ctx.beginPath(); ctx.roundRect(x - s * 0.04, y - s * 0.18, s * 0.08, s * 0.025, s * 0.01); ctx.fill();
        } else {
          ctx.beginPath(); ctx.roundRect(x - s * 0.05, y - s * 0.17, s * 0.1, s * 0.02, s * 0.01); ctx.fill();
        }
      }
    }
  };

  // Idle animation state
  let breathOffset = 0;
  let blinkTimer = 0;
  let isBlinking = false;

  function render(canvas, state = 'neutral', size = null) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const s = size || Math.min(w, h) * 0.8;
    const x = w / 2, y = h / 2 + s * 0.05;

    // Breathing
    breathOffset = Math.sin(Date.now() / 800) * s * 0.015;

    // Blinking
    blinkTimer++;
    if (blinkTimer > 180 + Math.random() * 120) {
      isBlinking = true;
      blinkTimer = 0;
      setTimeout(() => { isBlinking = false; }, 150);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x, y + s * 0.35, s * 0.25, s * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, breathOffset);

    const pet = PETS[petType] || PETS.dog;
    pet.body(ctx, x, y, s, state);
    pet.face(ctx, x, y, s, state, isBlinking);

    ctx.restore();
  }

  function startAnimation(canvas, getState = () => 'neutral', size = null) {
    function loop() {
      render(canvas, getState(), size);
      requestAnimationFrame(loop);
    }
    loop();
  }

  return { render, startAnimation, petType, petColor };
})();
