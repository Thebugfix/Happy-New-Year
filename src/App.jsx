import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // We will define styles below

const App = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const canvasRef = useRef(null);

  // --- 1. COUNTDOWN LOGIC ---
  function calculateTimeLeft() {
    const nextYear = new Date().getFullYear() + 1;
    const difference = +new Date(`01/01/${nextYear}`) - +new Date();
    
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
        // If it's New Year, set to zeros
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // --- 2. FIREWORKS ENGINE (React Ref) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8,
        };
        this.alpha = 1;
        this.friction = 0.96;
      }

      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
          particle.draw();
          particle.update();
        } else {
          particles.splice(index, 1);
        }
      });

      // Auto fireworks
      if (Math.random() < 0.03) {
        const colors = ["#00f3ff", "#bc13fe", "#ff0043", "#ffe200"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle(x, y, color));
        }
      }
    };

    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="wrapper">
      <canvas ref={canvasRef} id="canvas" />
      
      <div className="glass-card">
        <h1>Happy New Year</h1>
        <div className="year-title">{year}</div>

        <div className="countdown-grid">
          <TimeBox value={timeLeft.days || '0'} label="Days" />
          <TimeBox value={timeLeft.hours || '0'} label="Hours" />
          <TimeBox value={timeLeft.minutes || '0'} label="Minutes" />
          <TimeBox value={timeLeft.seconds || '0'} label="Seconds" />
        </div>

        {/* --- SPOTIFY EMBED --- */}
        <div className="spotify-container">
          <iframe 
            style={{ borderRadius: "12px" }} 
            src="https://open.spotify.com/embed/playlist/0xQrHK5JXEqnPMyyT6hhnC?utm_source=generator"
            width="100%" 
            height="152" 
            frameBorder="0" 
            allowFullScreen="" 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
            loading="lazy"
            title="New Year Playlist"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const TimeBox = ({ value, label }) => (
  <div className="time-box">
    <span className="time-value">{String(value).padStart(2, '0')}</span>
    <span className="time-label">{label}</span>
  </div>
);

export default App;