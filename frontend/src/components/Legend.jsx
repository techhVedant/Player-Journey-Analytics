import React from 'react';
import styles from './Legend.module.css';

export default function Legend() {
  const items = [
    { label: 'Kill', color: '#ef4444' }, // red-500
    { label: 'Death', color: '#a3a3a3' }, // neutral-400
    { label: 'Loot', color: '#facc15' }, // yellow-400
    { label: 'Storm', color: '#a855f7' }, // purple-500
  ];

  return (
    <div className={styles.legendContainer}>
      <h4 className={styles.title}>Map Legend</h4>
      <div className={styles.items}>
        {items.map(item => (
          <div key={item.label} className={styles.item}>
            <div 
              className={styles.colorBox}
              style={{ 
                backgroundColor: item.color,
                boxShadow: `0 0 8px ${item.color}`
              }}
            />
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
