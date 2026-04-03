import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './MapCanvas.module.css';

const getEventColor = (event) => {
  switch (event) {
    case "Kill":
    case "BotKill":
      return "rgb(239, 68, 68)"; // red-500
    case "Killed":
    case "BotKilled":
      return "rgb(163, 163, 163)"; // neutral-400
    case "Loot":
      return "rgb(250, 204, 21)"; // yellow-400
    case "KilledByStorm":
      return "rgb(168, 85, 247)"; // purple-500
    default:
      return "rgb(115, 115, 115)"; // neutral-500
  }
};

export default function MapCanvas({
  selectedMap,
  showHeatmap,
  importantEvents,
  filteredHeatmapData,
  onEventClick
}) {
  
  const getMapImage = (map) => {
    if (!map) return "";
    if (map === "Lockdown") return `/maps/${map}_Minimap.jpg`;
    return `/maps/${map}_Minimap.png`;
  };

  if (!selectedMap) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>🗺️</div>
          <h2>Select a Map</h2>
          <p>Choose a map from the target panel to begin visualizing player journeys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
        limitToBounds={false}
        centerZoomedOut={false}
        panning={{ disabled: false, velocityDisabled: false }}
      >
        <TransformComponent wrapperClass={styles.transformWrapper} contentClass={styles.transformContent}>
          <div className={styles.mapAspectWrapper}>
            <img
              src={getMapImage(selectedMap)}
              alt="map"
              className={styles.mapImage}
              draggable="false"
            />

            <div className={`${styles.layer} ${showHeatmap ? styles.layerVisible : styles.layerHidden}`}>
              {filteredHeatmapData.map((e, i) => (
                <div
                  key={`heat-${i}`}
                  className={styles.heatmapPoint}
                  style={{
                    left: `${(e.px / 1024) * 100}%`,
                    top: `${(e.py / 1024) * 100}%`,
                    backgroundColor: getEventColor(e.event),
                  }}
                />
              ))}
            </div>

            <div className={`${styles.layer} ${!showHeatmap ? styles.layerVisible : styles.layerHidden}`}>
              {importantEvents.map((e, i) => (
                <div
                  key={`dot-${i}`}
                  className={styles.dotPoint}
                  style={{
                    left: `${(e.px / 1024) * 100}%`,
                    top: `${(e.py / 1024) * 100}%`,
                    backgroundColor: getEventColor(e.event),
                    boxShadow: `0 0 8px ${getEventColor(e.event)}`
                  }}
                  onClick={() => onEventClick && onEventClick(e)}
                >
                  <div className={styles.tooltip}>{e.event} - {e.player_type}</div>
                </div>
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
