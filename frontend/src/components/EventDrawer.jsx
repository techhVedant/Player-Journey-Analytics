import React from 'react';
import { X, Clock, Map, Target, Skull } from 'lucide-react';
import styles from './EventDrawer.module.css';

export default function EventDrawer({ event, onClose }) {
  if (!event) return null;

  const formatTime = (ts) => {
    if (!ts) return "00:00";
    const d = new Date(ts);
    return `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const isKill = event.event === 'Kill' || event.event === 'BotKill';
  const isDeath = event.event === 'Killed' || event.event === 'BotKilled';

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />
      
      {/* Drawer */}
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h3 className={styles.title}>Event Details</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          
          <div className={styles.heroSection}>
            <div className={styles.eventIconBadge} style={{
              backgroundColor: isKill ? 'rgba(239, 68, 68, 0.1)' : 
                             isDeath ? 'rgba(163, 163, 163, 0.1)' : 
                             event.event === 'Loot' ? 'rgba(250, 204, 21, 0.1)' :
                             'rgba(168, 85, 247, 0.1)',
              color: isKill ? '#ef4444' : 
                     isDeath ? '#a3a3a3' : 
                     event.event === 'Loot' ? '#facc15' : '#a855f7'
            }}>
              {isKill ? <Target size={24} /> : 
               isDeath ? <Skull size={24} /> : 
               <Map size={24} />}
            </div>
            <div className={styles.eventName}>{event.event}</div>
            <div className={styles.playerType}>{event.player_type?.toUpperCase()}</div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statRow}>
              <div className={styles.statIcon}><Clock size={16} /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Time Found</span>
                <span className={styles.statValue}>{formatTime(event.ts)}</span>
              </div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statIcon}><Map size={16} /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Map Coordinates</span>
                <span className={styles.statValue}>X: {Math.round(event.px)} / Y: {Math.round(event.py)}</span>
              </div>
            </div>
            
            {event.map_id && (
              <div className={styles.statRow}>
                <div className={styles.statIcon}><Target size={16} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Region</span>
                  <span className={styles.statValue}>{event.map_id}</span>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}
