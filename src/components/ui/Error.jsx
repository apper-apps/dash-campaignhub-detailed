import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Oops! Something went wrong",
  type = 'general'
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff';
      case 'notFound':
        return 'SearchX';
      case 'permission':
        return 'ShieldAlert';
      default:
        return 'AlertTriangle';
    }
  };

  const getErrorColor = () => {
    switch (type) {
      case 'network':
        return 'text-warning';
      case 'notFound':
        return 'text-info';
      case 'permission':
        return 'text-error';
      default:
        return 'text-error';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-64">
      <Card className="max-w-md w-full mx-auto text-center p-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6 
          }}
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-error/10 to-error/20 mb-6`}
        >
          <ApperIcon 
            name={getErrorIcon()} 
            size={32} 
            className={getErrorColor()} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          <div className="space-y-3">
            {onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                icon={<ApperIcon name="RefreshCw" size={16} />}
                className="w-full"
              >
                Try Again
              </Button>
            )}
            
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              icon={<ApperIcon name="RotateCcw" size={16} />}
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              If this problem persists, please contact our support team.
            </p>
            <Button
              variant="ghost"
              size="sm"
              icon={<ApperIcon name="HelpCircle" size={14} />}
              className="mt-2"
            >
              Get Help
            </Button>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

export default Error;