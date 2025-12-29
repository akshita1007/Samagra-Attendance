// import { useEffect, useRef, useState } from 'react';

// const UseParticles = () => {
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);
//   const [particles, setParticles] = useState([]);
//   const [config, setConfig] = useState({
//     count: 150,
//     speed: 1.5,
//     size: 3,
//     lineDistance: 100,
//     lineOpacity: 0.2,
//   });

//   const colors = [
//     'rgba(155, 155, 255, 0.7)',  // Blue
//     'rgba(155, 255, 155, 0.7)',  // Green
//     'rgba(255, 155, 155, 0.7)',  // Red
//     'rgba(255, 255, 155, 0.7)',  // Yellow
//     'rgba(255, 155, 255, 0.7)',  // Magenta
//   ];

//   class Particle {
//     constructor(canvasWidth, canvasHeight, config) {
//       this.x = Math.random() * canvasWidth;
//       this.y = Math.random() * canvasHeight;
//       this.size = Math.random() * config.size + 1;
//       this.speedX = (Math.random() * config.speed * 2) - config.speed;
//       this.speedY = (Math.random() * config.speed * 2) - config.speed;
//       this.color = colors[Math.floor(Math.random() * colors.length)];
//     }

//     update(canvasWidth, canvasHeight) {
//       this.x += this.speedX;
//       this.y += this.speedY;

//       // Bounce off edges
//       if (this.x > canvasWidth || this.x < 0) {
//         this.speedX = -this.speedX;
//       }
//       if (this.y > canvasHeight || this.y < 0) {
//         this.speedY = -this.speedY;
//       }
//     }

//     draw(ctx) {
//       ctx.fillStyle = this.color;
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//       ctx.fill();
//     }
//   }

//   const initParticles = (canvas) => {
//     if (!canvas) return;
//     const newParticles = [];
//     for (let i = 0; i < config.count; i++) {
//       newParticles.push(new Particle(canvas.width, canvas.height, config));
//     }
//     setParticles(newParticles);
//   };

//   const drawLines = (ctx, particles) => {
//     for (let i = 0; i < particles.length; i++) {
//       for (let j = i + 1; j < particles.length; j++) {
//         const dx = particles[i].x - particles[j].x;
//         const dy = particles[i].y - particles[j].y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < config.lineDistance) {
//           ctx.strokeStyle = `rgba(100, 150, 255, ${config.lineOpacity * (1 - distance / config.lineDistance)})`;
//           ctx.lineWidth = 0.5;
//           ctx.beginPath();
//           ctx.moveTo(particles[i].x, particles[i].y);
//           ctx.lineTo(particles[j].x, particles[j].y);
//           ctx.stroke();
//         }
//       }
//     }
//   };

//   const animate = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
    
//     // Clear with trail effect
//     ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Update and draw particles
//     particles.forEach(particle => {
//       particle.update(canvas.width, canvas.height);
//       particle.draw(ctx);
//     });

//     // Draw connecting lines
//     drawLines(ctx, particles);

//     animationRef.current = requestAnimationFrame(animate);
//   };

//   const handleClick = (e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Create burst particles
//     const burstParticles = [];
//     for (let i = 0; i < 10; i++) {
//       const particle = new Particle(canvas.width, canvas.height, config);
//       particle.x = x;
//       particle.y = y;
//       particle.size = Math.random() * 4 + 1;
//       particle.color = `rgba(255, ${Math.floor(Math.random() * 100 + 100)}, 100, 0.8)`;
//       burstParticles.push(particle);
//     }

//     const updatedParticles = [...particles, ...burstParticles];
//     if (updatedParticles.length > 500) {
//       updatedParticles.splice(0, 50);
//     }
//     setParticles(updatedParticles);
//   };

//   const updateConfig = (key, value) => {
//     setConfig(prev => ({ ...prev, [key]: value }));
    
//     // Update existing particles for size and speed changes
//     if (key === 'size' || key === 'speed') {
//       setParticles(prevParticles => 
//         prevParticles.map(p => {
//           const newParticle = { ...p };
//           if (key === 'size') {
//             newParticle.size = (p.size / config.size) * value;
//           }
//           if (key === 'speed') {
//             const speedFactor = value / config.speed;
//             newParticle.speedX *= speedFactor;
//             newParticle.speedY *= speedFactor;
//           }
//           return newParticle;
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       initParticles(canvas);
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       initParticles(canvas);
//     }
//   }, [config.count]);

//   useEffect(() => {
//     if (particles.length > 0) {
//       animationRef.current = requestAnimationFrame(animate);
//     }
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [particles]);

//   return {
//     canvasRef,
//     config,
//     updateConfig,
//     handleClick,
//   };
// };

// export default UseParticles;

import { useEffect, useRef } from 'react';

const useParticles = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Sophisticated color palette - soft, elegant colors
  const colorPalettes = {
    primary: [
      'rgba(168, 85, 247, 0.4)',  // Soft purple
      'rgba(59, 130, 246, 0.4)',  // Soft blue
      'rgba(236, 72, 153, 0.4)',  // Soft pink
      'rgba(34, 211, 238, 0.4)',  // Soft cyan
      'rgba(52, 211, 153, 0.4)',  // Soft teal
    ],
    secondary: [
      'rgba(139, 92, 246, 0.3)',  // Muted purple
      'rgba(99, 102, 241, 0.3)',  // Muted indigo
      'rgba(244, 114, 182, 0.3)', // Muted pink
      'rgba(45, 212, 191, 0.3)',  // Muted teal
      'rgba(248, 113, 113, 0.3)', // Muted red
    ],
    accent: [
      'rgba(255, 255, 255, 0.2)',  // Very subtle white
      'rgba(255, 255, 255, 0.15)', // Even more subtle
      'rgba(200, 200, 255, 0.1)',  // Bluish white
    ]
  };

  class Particle {
    constructor(canvasWidth, canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      
      // Smaller, more elegant particle sizes
      this.size = Math.random() * 1.5 + 0.8; // Smaller size (0.8-2.3)
      
      // Much slower movement
      this.speedX = (Math.random() * 0.5 * 2) - 0.5; // Reduced from 1.5 to 0.5
      this.speedY = (Math.random() * 0.5 * 2) - 0.5; // Reduced from 1.5 to 0.5
      
      // Slower rotation for more elegant movement
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() * 0.02) - 0.01;
      
      // More subtle color selection
      const paletteType = Math.random();
      let colors;
      if (paletteType < 0.7) colors = colorPalettes.primary;
      else if (paletteType < 0.9) colors = colorPalettes.secondary;
      else colors = colorPalettes.accent;
      
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      // Opacity variation for depth effect
      this.opacity = Math.random() * 0.4 + 0.1;
      
      // Wobble effect for organic movement
      this.wobbleX = Math.random() * 0.3;
      this.wobbleY = Math.random() * 0.3;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.wobbleTime = Math.random() * Math.PI * 2;
    }

    update(canvasWidth, canvasHeight, time) {
      // Slower movement with subtle wobble
      this.x += this.speedX * 0.5 + Math.sin(this.wobbleTime) * this.wobbleX;
      this.y += this.speedY * 0.5 + Math.cos(this.wobbleTime) * this.wobbleY;
      
      // Update wobble time
      this.wobbleTime += this.wobbleSpeed;
      
      // Update rotation
      this.rotation += this.rotationSpeed;
      
      // Slower, more elegant edge wrapping instead of bouncing
      if (this.x > canvasWidth + 50) {
        this.x = -50;
      } else if (this.x < -50) {
        this.x = canvasWidth + 50;
      }
      
      if (this.y > canvasHeight + 50) {
        this.y = -50;
      } else if (this.y < -50) {
        this.y = canvasHeight + 50;
      }
      
      // Subtle opacity pulse for organic feel
      this.opacity = 0.1 + (Math.sin(time * 0.002 + this.x * 0.01) * 0.2 + 0.2);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      // Draw subtle glow effect for elegant particles
      const gradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, this.size * 2
      );
      
      gradient.addColorStop(0, this.color.replace('0.4', '0.6').replace('0.3', '0.5'));
      gradient.addColorStop(1, this.color.replace('0.4', '0').replace('0.3', '0'));
      
      ctx.fillStyle = gradient;
      ctx.globalAlpha = this.opacity;
      
      // Draw particle with slight variation in shape
      if (Math.random() > 0.7) {
        // Diamond shape (less common)
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
      } else {
        // Circle (most common)
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      }
      
      ctx.fill();
      
      // Very subtle inner highlight
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.3})`;
      ctx.fill();
      
      ctx.restore();
    }
  }

  const initParticles = (canvas) => {
    if (!canvas) return;
    particlesRef.current = [];
    
    // Fewer particles for more elegant look
    for (let i = 0; i < 80; i++) { // Reduced from 150 to 80
      particlesRef.current.push(new Particle(canvas.width, canvas.height));
    }
  };

  const drawConnections = (ctx, particles) => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Draw connections only for closer particles with very subtle lines
        if (distance < 80) { // Reduced from 100 to 80
          const opacity = 0.05 * (1 - distance / 80); // More subtle opacity
          
          // Gradient line color based on particle colors
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          
          gradient.addColorStop(0, particles[i].color.replace('0.4', opacity.toString()).replace('0.3', opacity.toString()));
          gradient.addColorStop(1, particles[j].color.replace('0.4', opacity.toString()).replace('0.3', opacity.toString()));
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.3; // Thinner lines
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear with more subtle trail for elegant effect
    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'; // More transparent for longer trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles with time parameter
    particlesRef.current.forEach(particle => {
      particle.update(canvas.width, canvas.height, time);
      particle.draw(ctx);
    });

    // Draw subtle connections
    drawConnections(ctx, particlesRef.current);

    // Add very subtle noise effect for depth
    addNoiseEffect(ctx, canvas);

    animationRef.current = requestAnimationFrame(animate);
  };

  const addNoiseEffect = (ctx, canvas) => {
    // Add a very subtle noise texture for depth
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Very subtle noise (95% chance to keep pixel as is)
      if (Math.random() > 0.95) {
        const noise = Math.random() * 10 - 5; // Very small variation
        data[i] = Math.min(255, Math.max(0, data[i] + noise));     // Red
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // Green
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // Blue
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create subtle ripple effect instead of burst
    const rippleParticles = [];
    for (let i = 0; i < 5; i++) { // Fewer, more elegant particles
      const particle = new Particle(canvas.width, canvas.height);
      particle.x = x;
      particle.y = y;
      particle.size = Math.random() * 1.2 + 0.5; // Even smaller
      particle.speedX = (Math.random() * 0.6 * 2) - 0.6;
      particle.speedY = (Math.random() * 0.6 * 2) - 0.6;
      particle.color = colorPalettes.accent[Math.floor(Math.random() * colorPalettes.accent.length)];
      rippleParticles.push(particle);
    }

    const updatedParticles = [...particlesRef.current, ...rippleParticles];
    if (updatedParticles.length > 120) {
      updatedParticles.splice(0, 5); // Remove oldest particles
    }
    particlesRef.current = updatedParticles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Start animation with time parameter
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { canvasRef, handleClick };
};

export default useParticles;