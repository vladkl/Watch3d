import { useState, useCallback } from 'react';
import WatchScene from './components/WatchScene';
import CustomizerPanel from './components/CustomizerPanel';
import ARMode from './components/ARMode';

export interface WatchConfig {
  caseColor: string;
  caseMaterial: 'metal' | 'ceramic' | 'gold' | 'rosegold';
  dialColor: string;
  dialStyle: 'sunburst' | 'guilloche' | 'matte' | 'carbon';
  strapColor: string;
  strapMaterial: 'leather' | 'rubber' | 'metal' | 'fabric';
  handColor: string;
  handStyle: 'dauphine' | 'sword' | 'baton';
  showDate: boolean;
  showChronograph: boolean;
  showMoonphase: boolean;
}

const defaultConfig: WatchConfig = {
  caseColor: '#c0c0c0',
  caseMaterial: 'metal',
  dialColor: '#1a1a2e',
  dialStyle: 'sunburst',
  strapColor: '#2d1810',
  strapMaterial: 'leather',
  handColor: '#ffffff',
  handStyle: 'dauphine',
  showDate: true,
  showChronograph: false,
  showMoonphase: false,
};

export default function App() {
  const [config, setConfig] = useState<WatchConfig>(defaultConfig);
  const [arMode, setArMode] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const updateConfig = useCallback((updates: Partial<WatchConfig>) => {
    if (updates.strapColor !== undefined && updates.strapColor !== config.strapColor) {
      setIsSwapping(true);
      setTimeout(() => setIsSwapping(false), 800);
    }
    setConfig(prev => ({ ...prev, ...updates }));
  }, [config.strapColor]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-xs font-bold text-black">L</span>
          </div>
          <h1 className="text-lg font-light tracking-widest uppercase">Luxe Studio</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setArMode(!arMode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              arMode
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              AR Try-On
            </span>
          </button>
        </div>
      </header>

      {/* 3D Watch Scene */}
      <WatchScene config={config} isSwapping={isSwapping} arMode={arMode} />

      {/* Customizer Panel */}
      {!arMode && (
        <CustomizerPanel config={config} updateConfig={updateConfig} />
      )}

      {/* AR Mode Overlay */}
      {arMode && <ARMode onClose={() => setArMode(false)} />}

      {/* Info Badge */}
      <div className="absolute bottom-4 left-4 z-20 text-xs text-white/40">
        <p>Drag to orbit • Scroll to zoom • Hover complications for glow</p>
      </div>
    </div>
  );
}
