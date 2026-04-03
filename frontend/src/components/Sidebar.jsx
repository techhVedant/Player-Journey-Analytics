import React from 'react';
import { Play, Pause, Flame, Crosshair, Skull, Box, CloudLightning } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({
  maps, selectedMap, setSelectedMap,
  matches, selectedMatch, setSelectedMatch,
  isPlaying, setIsPlaying,
  showHeatmap, setShowHeatmap,
  selectedEventGroups, toggleEventGroup,
  selectedPlayerTypes, togglePlayerType
}) {
  
  const events = [
    { id: 'Kill', label: 'Kill', icon: Crosshair, color: '#ef4444' }, // red
    { id: 'Death', label: 'Death', icon: Skull, color: '#a3a3a3' }, // gray
    { id: 'Loot', label: 'Loot', icon: Box, color: '#facc15' }, // yellow
    { id: 'Storm', label: 'Storm', icon: CloudLightning, color: '#a855f7' } // purple
  ];

  return (
    <div className={styles.sidebar}>
      
      {/* Target Selection */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Target</h3>
        
        <div className={styles.controlGroup}>
          <label className={styles.label}>Map</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value)}
            >
              <option value="">Select Map</option>
              {maps.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
            <div className={styles.chevron}></div>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Match</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              disabled={!selectedMap}
            >
              <option value="">Select Match</option>
              {matches.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
            <div className={styles.chevron}></div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Playback Controls */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Playback</h3>
        <button 
          className={`${styles.playButton} ${isPlaying ? styles.isPlaying : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
        </button>

        <button 
          className={`${styles.heatmapButton} ${showHeatmap ? styles.activeHeatmap : ''}`}
          onClick={() => setShowHeatmap(!showHeatmap)}
        >
          <Flame size={18} className={showHeatmap ? styles.flameActive : ''} />
          <span>Heatmap Mode</span>
        </button>
      </div>

      <div className={styles.divider} />

      {/* Filters */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Event Filters</h3>
        <div className={styles.pillGrid}>
          {events.map((ev) => {
            const isActive = selectedEventGroups.includes(ev.id);
            const Icon = ev.icon;
            return (
              <button
                key={ev.id}
                className={`${styles.eventPill} ${isActive ? styles.activePill : ''}`}
                onClick={() => toggleEventGroup(ev.id)}
                style={{ '--pill-color': ev.color }}
              >
                <Icon size={14} />
                <span>{ev.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Player Type</h3>
        <div className={styles.segmentedControl}>
          {["human", "bot"].map((p) => {
            const isActive = selectedPlayerTypes.includes(p);
            return (
              <button
                key={p}
                className={`${styles.segment} ${isActive ? styles.activeSegment : ''}`}
                onClick={() => togglePlayerType(p)}
              >
                {p === "human" ? "Human" : "Bot"}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
