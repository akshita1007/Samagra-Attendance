import React from 'react';
import { Settings, Zap, Gauge, Circle } from 'lucide-react';

const ParticleControls = ({ config, updateConfig }) => {
  const handleSliderChange = (key, value) => {
    updateConfig(key, parseFloat(value));
  };

  return (
    <div className="particle-controls">
      <h3><Settings size={20} /> Particle Settings</h3>
      
      <div className="control-group">
        <label htmlFor="particleCount">
          <Zap size={16} /> Count: <span>{config.count}</span>
        </label>
        <input
          type="range"
          min="20"
          max="300"
          value={config.count}
          onChange={(e) => handleSliderChange('count', e.target.value)}
          className="slider"
          id="particleCount"
        />
      </div>

      <div className="control-group">
        <label htmlFor="particleSpeed">
          <Gauge size={16} /> Speed: <span>{config.speed.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={config.speed}
          onChange={(e) => handleSliderChange('speed', e.target.value)}
          className="slider"
          id="particleSpeed"
        />
      </div>

      <div className="control-group">
        <label htmlFor="particleSize">
          <Circle size={16} /> Size: <span>{config.size}</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={config.size}
          onChange={(e) => handleSliderChange('size', e.target.value)}
          className="slider"
          id="particleSize"
        />
      </div>

      <div className="control-group">
        <label htmlFor="lineDistance">
          Connection Distance: <span>{config.lineDistance}</span>
        </label>
        <input
          type="range"
          min="50"
          max="200"
          value={config.lineDistance}
          onChange={(e) => handleSliderChange('lineDistance', e.target.value)}
          className="slider"
          id="lineDistance"
        />
      </div>
    </div>
  );
};

export default ParticleControls;