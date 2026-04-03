import React from 'react';
import { HelpCircle } from 'lucide-react';
import styles from './TopNav.module.css';

export default function TopNav({ useGlobal, setUseGlobal, onOpenIntro }) {
  return (
    <nav className={styles.container}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Lila Logo" className={styles.logoImage} />
        </div>
        <div className={styles.brandDivider} aria-hidden="true" />
        <div className={styles.wordmark}>
          <span className={styles.eyebrow}>Analytics</span>
          <span className={styles.title}>Player Journey</span>
        </div>
      </div>

      <div className={styles.modeToggle}>
        <button
          className={`${styles.toggleButton} ${!useGlobal ? styles.active : ''}`}
          onClick={() => setUseGlobal(false)}
        >
          Match View
        </button>
        <button
          className={`${styles.toggleButton} ${useGlobal ? styles.active : ''}`}
          onClick={() => setUseGlobal(true)}
        >
          Global View
        </button>
      </div>

      <div className={styles.actions}>
        <button className={styles.helpButton} onClick={onOpenIntro}>
          <HelpCircle size={20} />
          <span>Guide</span>
        </button>
      </div>
    </nav>
  );
}
