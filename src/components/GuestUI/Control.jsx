import React, { useState } from 'react';
import { handleValueChange } from '../../utils/handleValue';
const Control = ({ onCommandChange, rainSettings, setRainSettings }) => {
  let diameter;

  const windSpeedInMeters = rainSettings.windSpeed * 0.27778;
  rainSettings.rainQuantity =
    ((rainSettings.rainIntensity /
      ((4 / 3) * Math.PI * Math.pow(diameter / 2, 3))) *
      0.001) /
    3600;

  rainSettings.cornerRain =
    Math.atan(windSpeedInMeters / rainSettings.fallSpeed) * (180 / Math.PI);

  if (rainSettings.rainIntensity < 10) {
    diameter = 0.5; // Mưa nhỏ
  } else if (
    rainSettings.rainIntensity >= 10 &&
    rainSettings.rainIntensity < 50
  ) {
    diameter = 1; // Mưa vừa
  } else if (
    rainSettings.rainIntensity >= 50 &&
    rainSettings.rainIntensity < 100
  ) {
    diameter = 1.5; // Mưa to
  } else if (
    rainSettings.rainIntensity >= 100 &&
    rainSettings.rainIntensity < 200
  ) {
    diameter = 2; // Mưa rất to
  } else if (rainSettings.rainIntensity >= 200) {
    diameter = 2.5; // Mưa cực lớn
  } else {
    console.log('Lượng mưa không hợp lệ');
  }

  const handleIntensityChange = handleValueChange(
    setRainSettings,
    'rainIntensity'
  );
  const handleFallSpeed = handleValueChange(setRainSettings, 'fallSpeed');
  const handleSpeedWindChange = handleValueChange(setRainSettings, 'windSpeed');

  const handleSetCommand = (event) => {
    const newCommand = event.target.value;
    onCommandChange(newCommand); // Call the parent's handler
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '8px',
        width: '200px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <label>
        Lượng mưa (mm/h)
        <input
          type="number"
          value={rainSettings.rainIntensity}
          onChange={handleIntensityChange}
        />
      </label>
      <label>
        Tốc độ rơi (m/s)
        <input
          type="number"
          step="0.1"
          value={rainSettings.fallSpeed}
          onChange={handleFallSpeed}
        />
      </label>
      <label>
        Tốc độ gió (km/h)
        <input
          type="number"
          step="1"
          value={rainSettings.windSpeed}
          onChange={handleSpeedWindChange}
        />
      </label>
      <label>
        Trạng thái
        <select name="animations" id="animations" onChange={handleSetCommand}>
          <option value="idle">idle</option>
          <option value="walk">walk</option>
          <option value="run">run</option>
          <option value="pray">pray</option>
        </select>
      </label>
    </div>
  );
};

export default Control;
