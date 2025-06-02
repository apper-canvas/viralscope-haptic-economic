import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 glass-card border-0 border-b border-surface-200/50 dark:border-surface-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center animate-glow">
                  <ApperIcon name="Activity" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ViralScope
                </h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                  COVID-19 Global Tracker
                </p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Last Updated Indicator */}
              <div className="hidden md:flex data-refresh-indicator">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon 
                  name={isDarkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 sm:w-5 sm:h-5" 
                />
              </motion.button>

              {/* Help Button */}
              <motion.button
                onClick={() => toast.info("ViralScope provides real-time COVID-19 statistics with interactive filtering and visualization tools.")}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="HelpCircle" className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MainFeature onDataUpdate={setLastUpdated} />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-12 sm:mt-16 border-t border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Data sourced from reliable health organizations and updated regularly
            </p>
            <div className="mt-4 flex justify-center items-center space-x-4 text-xs text-surface-500 dark:text-surface-500">
              <span className="flex items-center gap-1">
                <ApperIcon name="Shield" className="w-3 h-3" />
                Real-time Tracking
              </span>
              <span className="flex items-center gap-1">
                <ApperIcon name="Globe" className="w-3 h-3" />
                Global Coverage
              </span>
              <span className="flex items-center gap-1">
                <ApperIcon name="BarChart3" className="w-3 h-3" />
                Data Visualization
              </span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home