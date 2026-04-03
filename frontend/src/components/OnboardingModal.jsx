import React, { useState } from 'react';
import { X, Map, Activity, Filter, Layers, Clock, ShieldCheck } from 'lucide-react';
import styles from './OnboardingModal.module.css';

export default function OnboardingModal({ onClose }) {
  const [slide, setSlide] = useState(1);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.pagination}>
            <div className={`${styles.dot} ${slide === 1 ? styles.activeDot : ''}`} />
            <div className={`${styles.dot} ${slide === 2 ? styles.activeDot : ''}`} />
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {slide === 1 ? (
            <div className={styles.slide}>
              <div className={styles.iconWrapper}>
                <ShieldCheck size={32} />
              </div>
              <h2 className={styles.title}>Player Journey Visualization</h2>
              <p className={styles.subtitle}>
                This tool helps you understand how players behave inside a game match.
                It shows where players move, loot, fight, and get eliminated on the map.
              </p>

              <div className={styles.features}>
                <div className={styles.featureItem}>
                  <TargetIcon />
                  <span>See hotspots where most fights happen</span>
                </div>
                <div className={styles.featureItem}>
                  <BoxIcon />
                  <span>Understand loot distribution across the map</span>
                </div>
                <div className={styles.featureItem}>
                  <MapIcon />
                  <span>Identify danger zones and safe areas</span>
                </div>
              </div>

              <div className={styles.audiences}>
                <p>Designed for:</p>
                <div className={styles.pills}>
                  <span>Game Designers</span>
                  <span>Product Managers</span>
                  <span>Data Analysts</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.slide}>
              <div className={styles.iconWrapper}>
                <Map size={32} />
              </div>
              <h2 className={styles.title}>How to Explore</h2>
              
              <div className={styles.stepsGrid}>
                <div className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <Map size={16} />
                    <h4>1. Select a Map & Match</h4>
                  </div>
                  <p>Choose a map and a match to start exploring.</p>
                </div>
                
                <div className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <Clock size={16} />
                    <h4>2. Use the Timeline</h4>
                  </div>
                  <p>Move the slider or press play. Watch how events unfold over time.</p>
                </div>
                
                <div className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <Filter size={16} />
                    <h4>3. Apply Filters</h4>
                  </div>
                  <p>Focus on specific events (Kills, Deaths) or player types.</p>
                </div>
                
                <div className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <Activity size={16} />
                    <h4>4. Heatmap & Global View</h4>
                  </div>
                  <p>Turn on Heatmap to see high activity zones. Switch to Global View for overall patterns.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.helperText}>You can reopen this guide anytime</p>
          <button 
            className={styles.ctaBtn} 
            onClick={() => slide === 1 ? setSlide(2) : onClose()}
          >
            {slide === 1 ? 'Next →' : 'Start Exploring'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Micro icons for slide 1
function TargetIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
function BoxIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
function MapIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
}
