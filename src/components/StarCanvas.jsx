import { useEffect, useRef } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const randomBetween = (min, max) => min + Math.random() * (max - min);

function createStars(width, height) {
  const starCount = clamp(Math.round((width * height) / 5200), 140, 380);

  return Array.from({ length: starCount }, (_, index) => {
    const isGlow = Math.random() > 0.84;

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: randomBetween(0.45, isGlow ? 2.1 : 1.35),
      baseAlpha: randomBetween(0.24, isGlow ? 0.85 : 0.72),
      phase: randomBetween(0, Math.PI * 2),
      speed: randomBetween(0.003, 0.012),
      hue: randomBetween(205, 48),
      glow: isGlow,
      responds: index % 7 === 0 || Math.random() > 0.9,
    };
  });
}

function drawMilkyWay(ctx, width, height, time, active) {
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.rotate(-0.43);

  const bandWidth = Math.max(width, height) * 1.35;
  const bandHeight = height * 0.34;
  const gradient = ctx.createLinearGradient(0, -bandHeight, 0, bandHeight);

  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.34, 'rgba(147, 164, 211, 0.025)');
  gradient.addColorStop(0.5, active ? 'rgba(255, 221, 174, 0.095)' : 'rgba(175, 188, 230, 0.06)');
  gradient.addColorStop(0.66, 'rgba(212, 169, 194, 0.035)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.filter = `blur(${active ? 14 : 18}px)`;
  ctx.fillRect(-bandWidth / 2, -bandHeight / 2, bandWidth, bandHeight);
  ctx.filter = 'none';

  const dustAlpha = active ? 0.11 : 0.07;
  for (let i = 0; i < 42; i += 1) {
    const x = -bandWidth / 2 + ((i * 137.5) % bandWidth);
    const y = Math.sin(i * 1.7 + time * 0.00045) * bandHeight * 0.26;
    const radius = 18 + (i % 5) * 8;

    const dust = ctx.createRadialGradient(x, y, 0, x, y, radius);
    dust.addColorStop(0, `rgba(255, 239, 213, ${dustAlpha})`);
    dust.addColorStop(1, 'rgba(255, 239, 213, 0)');
    ctx.fillStyle = dust;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function createShootingStar(width, height, strong = false) {
  const startOnLeft = Math.random() > 0.25;
  const startX = startOnLeft ? randomBetween(-width * 0.18, width * 0.82) : randomBetween(width * 0.2, width * 1.05);
  const startY = randomBetween(-height * 0.08, height * 0.58);

  return {
    x: startX,
    y: startY,
    vx: randomBetween(8.2, 13.5) * (startOnLeft ? 1 : -0.72),
    vy: randomBetween(3.2, 5.8),
    length: randomBetween(strong ? 150 : 92, strong ? 260 : 170),
    life: 0,
    maxLife: randomBetween(strong ? 58 : 42, strong ? 86 : 64),
    opacity: randomBetween(strong ? 0.68 : 0.38, strong ? 0.96 : 0.72),
    width: randomBetween(strong ? 1.5 : 0.8, strong ? 2.7 : 1.6),
    gold: strong && Math.random() > 0.5,
  };
}

export default function StarCanvas({ active, burstSignal, sparkleSignal }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const burstRef = useRef(burstSignal);
  const sparkleRef = useRef(sparkleSignal);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    burstRef.current = burstSignal;
  }, [burstSignal]);

  useEffect(() => {
    sparkleRef.current = sparkleSignal;
  }, [sparkleSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    let shootingStars = [];
    let width = 0;
    let height = 0;
    let lastBurst = burstRef.current;
    let lastSparkle = sparkleRef.current;
    let randomMeteorAt = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
    };

    const spawnBurst = (count, strong = false) => {
      for (let i = 0; i < count; i += 1) {
        shootingStars.push(createShootingStar(width, height, strong));
      }
    };

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#02030a');
      gradient.addColorStop(0.42, '#081225');
      gradient.addColorStop(0.72, '#140b1f');
      gradient.addColorStop(1, '#020208');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const horizonGlow = ctx.createRadialGradient(width * 0.5, height * 1.04, 0, width * 0.5, height * 1.04, height * 0.62);
      horizonGlow.addColorStop(0, 'rgba(220, 143, 176, 0.16)');
      horizonGlow.addColorStop(0.52, 'rgba(77, 118, 172, 0.055)');
      horizonGlow.addColorStop(1, 'rgba(3, 4, 10, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, height);
    };

    const drawStars = (time) => {
      const activeBoost = activeRef.current ? 0.22 : 0;
      const sparkleBoost = sparkleRef.current !== lastSparkle ? 0.34 : 0;

      if (sparkleRef.current !== lastSparkle) {
        lastSparkle = sparkleRef.current;
      }

      for (const star of stars) {
        const twinkle = (Math.sin(time * star.speed + star.phase) + 1) * 0.5;
        const responsiveGlow = activeRef.current && star.responds ? activeBoost : 0;
        const alpha = clamp(star.baseAlpha + twinkle * 0.28 + responsiveGlow + sparkleBoost * (star.responds ? 1 : 0.22), 0.08, 1);
        const radius = star.radius + twinkle * 0.32 + (star.responds && activeRef.current ? 0.25 : 0);

        if (star.glow || star.responds) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius * (activeRef.current ? 7 : 5));
          glow.addColorStop(0, `hsla(${star.hue}, 94%, 86%, ${alpha * 0.24})`);
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, radius * (activeRef.current ? 7 : 5), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `hsla(${star.hue}, 88%, ${star.glow ? 88 : 82}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawShootingStars = () => {
      shootingStars = shootingStars.filter((meteor) => meteor.life < meteor.maxLife);

      for (const meteor of shootingStars) {
        meteor.life += 1;
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        const progress = meteor.life / meteor.maxLife;
        const fade = Math.sin(progress * Math.PI);
        const angle = Math.atan2(meteor.vy, meteor.vx);
        const tailX = meteor.x - Math.cos(angle) * meteor.length;
        const tailY = meteor.y - Math.sin(angle) * meteor.length;
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);

        gradient.addColorStop(0, meteor.gold ? `rgba(255, 223, 163, ${meteor.opacity * fade})` : `rgba(237, 246, 255, ${meteor.opacity * fade})`);
        gradient.addColorStop(0.18, `rgba(255, 255, 255, ${meteor.opacity * fade * 0.62})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = meteor.width;
        ctx.strokeStyle = gradient;
        ctx.shadowColor = meteor.gold ? 'rgba(255, 209, 129, 0.85)' : 'rgba(193, 221, 255, 0.82)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.restore();
      }
    };

    const animate = (time) => {
      if (burstRef.current !== lastBurst) {
        const difference = Math.max(1, burstRef.current - lastBurst);
        spawnBurst(clamp(difference + 1, 2, 5), true);
        lastBurst = burstRef.current;
      }

      if (activeRef.current && time > randomMeteorAt) {
        spawnBurst(Math.random() > 0.62 ? 2 : 1);
        randomMeteorAt = time + randomBetween(1300, 2700);
      }

      drawBackground();
      drawMilkyWay(ctx, width, height, time, activeRef.current);
      drawStars(time);
      drawShootingStars();
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" id="starCanvas" aria-hidden="true" />;
}
