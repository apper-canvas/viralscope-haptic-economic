import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-secondary to-secondary-light rounded-2xl flex items-center justify-center shadow-glow">
              <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-bold text-surface-800 dark:text-surface-100">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-surface-700 dark:text-surface-200">
              Page Not Found
            </h2>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to a different location.
            </p>
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <ApperIcon name="Home" className="w-5 h-5" />
              Return to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound