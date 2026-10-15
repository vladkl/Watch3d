import { useState } from 'react';
import type { WatchConfig } from '../App';

interface Props {
  config: WatchConfig;
  updateConfig: (updates: Partial<WatchConfig>) => void;
}

const caseColors = [
  { name: 'Silver', value: '#c0c0c0' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Rose Gold', value: '#e8a87c' },
  { name: 'Black', value: '#1a1a1a' },
  { name: 'Blue', value: '#1a3a5c' },
  { name: 'Bronze', value: '#cd7f32' },
];

const dialColors = [
  { name: 'Midnight', value: '#1a1a2e' },
  { name: 'Arctic', value: '#f5f5f5' },
  { name: 'Ocean', value: '#0a3d62' },
  { name: 'Forest', value: '#1a4a2a' },
  { name: 'Burgundy', value: '#4a0e0e' },
  { name: 'Champagne', value: '#f5e6c8' },
];

const strapColors = [
  { name: 'Espresso', value: '#2d1810' },
  { name: 'Black', value: '#111111' },
  { name: 'Navy', value: '#1a2744' },
  { name: 'Cognac', value: '#8b4513' },
  { name: 'Olive', value: '#3d4a2a' },
  { name: 'Burgundy', value: '#4a0e1e' },
];

type TabType = 'case' | 'dial' | 'strap' | 'hands' | 'complications';

export default function CustomizerPanel({ config, updateConfig }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('case');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'case', label: 'Case', icon: '⚙️' },
    { id: 'dial', label: 'Dial', icon: '🕐' },
    { id: 'strap', label: 'Strap', icon: '⌚' },
    { id: 'hands', label: 'Hands', icon: '🔧' },
    { id: 'complications', label: 'Extras', icon: '✨' },
  ];

  return (
    <div
      className={`absolute right-0 top-16 bottom-0 z-10 transition-all duration-500 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-6 h-16 bg-white/10 backdrop-blur-sm rounded-l-lg flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <span className="text-white/60 text-xs">{isCollapsed ? '◀' : '▶'}</span>
      </button>

      {!isCollapsed && (
        <div className="h-full bg-black/40 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
          {/* Tab navigation */}
          <div className="flex border-b border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <div className="text-center">
                  <div className="text-base mb-0.5">{tab.icon}</div>
                  <div>{tab.label}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 space-y-5">
            {activeTab === 'case' && (
              <>
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Case Color</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {caseColors.map(c => (
                      <button
                        key={c.value}
                        onClick={() => updateConfig({ caseColor: c.value })}
                        className={`group relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                          config.caseColor === c.value
                            ? 'border-amber-400 shadow-lg shadow-amber-400/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ backgroundColor: c.value }}
                      >
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Material</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(['metal', 'ceramic', 'gold', 'rosegold'] as const).map(mat => (
                      <button
                        key={mat}
                        onClick={() => updateConfig({ caseMaterial: mat })}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          config.caseMaterial === mat
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {mat === 'rosegold' ? 'Rose Gold' : mat.charAt(0).toUpperCase() + mat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'dial' && (
              <>
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Dial Color</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {dialColors.map(c => (
                      <button
                        key={c.value}
                        onClick={() => updateConfig({ dialColor: c.value })}
                        className={`group relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                          config.dialColor === c.value
                            ? 'border-amber-400 shadow-lg shadow-amber-400/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ backgroundColor: c.value }}
                      >
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Dial Finish</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(['sunburst', 'guilloche', 'matte', 'carbon'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updateConfig({ dialStyle: style })}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          config.dialStyle === style
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'strap' && (
              <>
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Strap Color</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {strapColors.map(c => (
                      <button
                        key={c.value}
                        onClick={() => updateConfig({ strapColor: c.value })}
                        className={`group relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                          config.strapColor === c.value
                            ? 'border-amber-400 shadow-lg shadow-amber-400/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ backgroundColor: c.value }}
                      >
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Strap Material</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(['leather', 'rubber', 'metal', 'fabric'] as const).map(mat => (
                      <button
                        key={mat}
                        onClick={() => updateConfig({ strapMaterial: mat })}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          config.strapMaterial === mat
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {mat.charAt(0).toUpperCase() + mat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] text-white/30 italic">
                    💡 Changing strap triggers an animated swap effect
                  </p>
                </div>
              </>
            )}

            {activeTab === 'hands' && (
              <>
                <div>
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Hand Color</label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { name: 'Silver', value: '#ffffff' },
                      { name: 'Gold', value: '#ffd700' },
                      { name: 'Black', value: '#111111' },
                      { name: 'Blue', value: '#4488ff' },
                    ].map(c => (
                      <button
                        key={c.value}
                        onClick={() => updateConfig({ handColor: c.value })}
                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                          config.handColor === c.value
                            ? 'border-amber-400 shadow-lg shadow-amber-400/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Hand Style</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(['dauphine', 'sword', 'baton'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updateConfig({ handStyle: style })}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          config.handStyle === style
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-[10px] text-white/30 italic">
                    ⏱️ Hands sweep in real-time at your local time
                  </p>
                </div>
              </>
            )}

            {activeTab === 'complications' && (
              <>
                <div className="space-y-3">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Complications</label>
                  <p className="text-[10px] text-white/30">Hover over complications on the dial for a glow effect</p>

                  {[
                    { key: 'showDate' as const, label: 'Date Window', desc: '3 o\'clock position' },
                    { key: 'showChronograph' as const, label: 'Chronograph', desc: '12 o\'clock sub-dial' },
                    { key: 'showMoonphase' as const, label: 'Moon Phase', desc: '6 o\'clock display' },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => updateConfig({ [item.key]: !config[item.key] })}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        config[item.key]
                          ? 'bg-amber-500/20 border border-amber-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-sm font-medium ${config[item.key] ? 'text-amber-400' : 'text-white/70'}`}>
                            {item.label}
                          </div>
                          <div className="text-[10px] text-white/40 mt-0.5">{item.desc}</div>
                        </div>
                        <div
                          className={`w-8 h-4 rounded-full transition-all ${
                            config[item.key] ? 'bg-amber-500' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white transition-transform mt-0.5 ${
                              config[item.key] ? 'ml-[18px]' : 'ml-0.5'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 mt-4">
            <div className="text-center">
              <p className="text-xs text-white/30">Luxe Watch Studio v1.0</p>
              <p className="text-[10px] text-white/20 mt-1">PBR Materials • Real-time Rendering</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
