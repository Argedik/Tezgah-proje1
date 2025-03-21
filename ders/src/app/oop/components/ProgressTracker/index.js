import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import styles from './styles.module.css';

export default function ProgressTracker({ 
  concepts, 
  learnedConcepts, 
  progressPercentage, 
  darkMode,
  onToggleLearned,
  menuOpen
}) {
  // Zorluk seviyesine ve öğrenilme durumuna göre sıralama
  const sortedConcepts = [...concepts].sort((a, b) => {
    // Öğrenme durumlarını kontrol et
    const aLearned = learnedConcepts.includes(a.id);
    const bLearned = learnedConcepts.includes(b.id);
    
    // Öğrenme durumları farklıysa, öğrenilmemiş olanları üste al
    if (aLearned !== bLearned) {
      return aLearned ? 1 : -1;
    }
    
    // Öğrenme durumları aynıysa, zorluk seviyesine göre sırala
    return a.difficultyLevel - b.difficultyLevel;
  });

  return (
    <div className={`${styles.sidebar} ${darkMode ? styles.darkSidebar : ''} ${menuOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.progressContainer}>
        <h3 className={styles.sidebarTitle}>Öğrenme İlerlemesi</h3>
        
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar}
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <span className={styles.progressText}>
            %{Math.round(progressPercentage)}
          </span>
        </div>
        
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Öğrenilen:</span>
            <span className={styles.statValue}>{learnedConcepts.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Toplam:</span>
            <span className={styles.statValue}>{concepts.length}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.conceptsList}>
        <h3 className={styles.sidebarSubtitle}>Tüm Kavramlar</h3>
        
        {sortedConcepts.map((concept) => {
          const isLearned = learnedConcepts.includes(concept.id);
          
          return (
            <motion.div 
              key={concept.id}
              className={`${styles.conceptItem} ${isLearned ? styles.conceptLearned : ''}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.conceptInfo}>
                <span 
                  className={styles.conceptDot}
                  style={{ backgroundColor: concept.color }}
                ></span>
                <span className={styles.conceptTitle}>{concept.title}</span>
                
                <div className={styles.difficultyLevel}>
                  {'⭐'.repeat(concept.difficultyLevel)}
                </div>
              </div>
              
              <button 
                className={`${styles.learnedCheckbox} ${isLearned ? styles.checked : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLearned(concept.id);
                }}
                aria-label={isLearned ? "İşareti kaldır" : "Öğrenildi olarak işaretle"}
              >
                {isLearned ? '✓' : ''}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

ProgressTracker.propTypes = {
  concepts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      difficultyLevel: PropTypes.number.isRequired
    })
  ).isRequired,
  learnedConcepts: PropTypes.arrayOf(PropTypes.string).isRequired,
  progressPercentage: PropTypes.number.isRequired,
  darkMode: PropTypes.bool,
  onToggleLearned: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool
};

ProgressTracker.defaultProps = {
  darkMode: false,
  menuOpen: false
}; 