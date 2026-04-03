import React, { useMemo } from 'react';
import styles from './TimelineSlider.module.css';

export default function TimelineSlider({ minTime, maxTime, currentTime, setCurrentTime, events }) {
  
  const percentage = maxTime > minTime 
    ? ((currentTime - minTime) / (maxTime - minTime)) * 100 
    : 0;

  const handleSliderChange = (e) => {
    setCurrentTime(Number(e.target.value));
  };

  const formatTime = (ts) => {
    if (!ts) return "00:00";
    const d = new Date(ts);
    return `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  // Generate 100 bins for sparkline
  const bins = useMemo(() => {
    if (!events || events.length === 0 || maxTime <= minTime) return [];
    
    const numBins = 100;
    const binCounts = new Array(numBins).fill(0);
    const timeRange = maxTime - minTime;

    events.forEach(e => {
      const ts = new Date(e.ts).getTime();
      let binIndex = Math.floor(((ts - minTime) / timeRange) * numBins);
      if (binIndex >= numBins) binIndex = numBins - 1;
      if (binIndex >= 0) {
        binCounts[binIndex]++;
      }
    });

    const maxCount = Math.max(...binCounts, 1);
    return binCounts.map(count => count / maxCount);
  }, [events, minTime, maxTime]);

  return (
    <div className={styles.container}>
      <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
      
      <div className={styles.sliderWrapper}>
        <div className={styles.sparkline}>
          {bins.map((val, i) => (
            <div 
              key={i} 
              className={styles.sparkbar} 
              style={{
                height: `${val * 100}%`,
                opacity: (i / 100) * 100 <= percentage ? 0.8 : 0.2
              }}
            />
          ))}
        </div>

        <div 
          className={styles.sliderTrack} 
          style={{ '--progress': `${percentage}%` }}
        ></div>
        <input
          type="range"
          min={minTime}
          max={maxTime}
          value={currentTime}
          onChange={handleSliderChange}
          className={styles.slider}
          disabled={!maxTime}
        />
      </div>

      <span className={styles.timeLabel}>{formatTime(maxTime)}</span>
    </div>
  );
}
