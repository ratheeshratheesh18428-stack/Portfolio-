import { useEffect, useRef } from "react";

export function MatrixBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }

    let particles: Particle[] = [];
    const maxParticles = 65;
    const colors = ["#06b6d4", "#8b5cf6", "#3b82f6", "#6366f1"];

    function initParticles() {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    // Interactivity: capture cursor inside canvas coordinates
    const mouse = { x: -1000, y: -1000, radius: 140 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: boxWidth, height: boxHeight } = entry.contentRect;
        width = Math.floor(boxWidth);
        height = Math.floor(boxHeight);
        canvas.width = width;
        canvas.height = height;
        initParticles();
      }
    });

    resizeObserver.observe(container);

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      
      // Draw a subtle cyber grid backdrop
      ctx!.strokeStyle = "rgba(99, 102, 241, 0.03)";
      ctx!.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive mouse force
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.alpha;
        ctx!.fill();
      }

      // Draw connection lines
      ctx!.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            const alpha = (120 - dist) / 120 * 0.15;
            ctx!.beginPath();
            ctx!.strokeStyle = p1.color;
            ctx!.globalAlpha = alpha;
            ctx!.lineWidth = 0.8;
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1.0;

      // Draw a mouse glow spotlight
      if (mouse.x > -1000) {
        const gradient = ctx!.createRadialGradient(
          mouse.x, mouse.y, 10,
          mouse.x, mouse.y, mouse.radius
        );
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.05)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#020208]"
      id="matrix-bg-container"
    >
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03040b] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
