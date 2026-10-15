import { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  onClose: () => void;
}

export default function ARMode({ onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchPosition, setWatchPosition] = useState({ x: 0.5, y: 0.65 });
  const [watchScale, setWatchScale] = useState(0.3);
  const [isDragging, setIsDragging] = useState(false);
  const animFrameRef = useRef<number>(0);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions to use AR mode.');
      console.error('Camera error:', err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Draw watch overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWatch = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * watchPosition.x;
      const cy = h * watchPosition.y;
      const size = Math.min(w, h) * watchScale;

      // Watch case
      ctx.save();
      ctx.translate(cx, cy);

      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 5;

      // Outer case
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      const caseGrad = ctx.createLinearGradient(-size * 0.5, -size * 0.5, size * 0.5, size * 0.5);
      caseGrad.addColorStop(0, '#e0e0e0');
      caseGrad.addColorStop(0.5, '#c0c0c0');
      caseGrad.addColorStop(1, '#a0a0a0');
      ctx.fillStyle = caseGrad;
      ctx.fill();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Bezel
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.48, 0, Math.PI * 2);
      ctx.strokeStyle = '#d4d4d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Dial
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
      const dialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.44);
      dialGrad.addColorStop(0, '#1a1a3e');
      dialGrad.addColorStop(1, '#0a0a1e');
      ctx.fillStyle = dialGrad;
      ctx.fill();

      // Hour markers
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const inner = size * 0.36;
        const outer = size * 0.42;
        const isMain = i % 3 === 0;

        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
        ctx.strokeStyle = isMain ? '#ffffff' : '#888888';
        ctx.lineWidth = isMain ? 3 : 1.5;
        ctx.stroke();
      }

      // Get current time
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      // Hour hand
      const hourAngle = (hours / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(hourAngle) * size * 0.22, Math.sin(hourAngle) * size * 0.22);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Minute hand
      const minAngle = (minutes / 60) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(minAngle) * size * 0.32, Math.sin(minAngle) * size * 0.32);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Second hand
      const secAngle = (seconds / 60) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(secAngle + Math.PI) * size * 0.06, Math.sin(secAngle + Math.PI) * size * 0.06);
      ctx.lineTo(Math.cos(secAngle) * size * 0.36, Math.sin(secAngle) * size * 0.36);
      ctx.strokeStyle = '#ff3333';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center pin
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Crown
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(size * 0.48, -size * 0.04, size * 0.08, size * 0.08);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.strokeRect(size * 0.48, -size * 0.04, size * 0.08, size * 0.08);

      // Strap top
      ctx.fillStyle = '#2d1810';
      ctx.fillRect(-size * 0.18, -size * 0.85, size * 0.36, size * 0.4);

      // Strap bottom
      ctx.fillStyle = '#2d1810';
      ctx.fillRect(-size * 0.18, size * 0.45, size * 0.36, size * 0.4);

      // Glass reflection
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.43, 0, Math.PI * 2);
      const glassGrad = ctx.createLinearGradient(-size * 0.3, -size * 0.3, size * 0.3, size * 0.3);
      glassGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
      glassGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
      glassGrad.addColorStop(1, 'rgba(255,255,255,0.05)');
      ctx.fillStyle = glassGrad;
      ctx.fill();

      ctx.restore();

      // AR indicator
      ctx.fillStyle = 'rgba(255,215,0,0.8)';
      ctx.font = '12px sans-serif';
      ctx.fillText('AR Mode Active', 10, h - 10);

      animFrameRef.current = requestAnimationFrame(drawWatch);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    drawWatch();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [watchPosition, watchScale]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setWatchPosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setWatchPosition({
        x: Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0.1, Math.min(0.9, (e.clientY - rect.top) / rect.height)),
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setWatchScale(prev => Math.max(0.1, Math.min(0.6, prev - e.deltaY * 0.001)));
  };

  if (error) {
    return (
      <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-4xl mb-4">📷</div>
          <h3 className="text-lg font-medium text-white mb-2">Camera Access Required</h3>
          <p className="text-sm text-white/60 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Watch overlay canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{ transform: 'scaleX(-1)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* AR Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setWatchScale(prev => Math.max(0.1, prev - 0.05))}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <span className="text-white text-lg">−</span>
        </button>

        <div className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
          <span className="text-xs text-white/80">Drag to position • Scroll to resize</span>
        </div>

        <button
          onClick={() => setWatchScale(prev => Math.min(0.6, prev + 0.05))}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <span className="text-white text-lg">+</span>
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* AR badge */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500/80 backdrop-blur-sm rounded-full">
        <span className="text-xs font-medium text-black">🔴 AR Try-On</span>
      </div>
    </div>
  );
}
