import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data available",
  description = "Get started by creating your first item.",
  icon = "Package",
  actionLabel = "Create New",
  onAction,
  type = 'general'
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'campaigns':
        return {
          title: "No campaigns yet",
          description: "Create your first marketing campaign to start tracking performance and reaching your audience.",
          icon: "Target",
          actionLabel: "Create Campaign"
        };
      case 'analytics':
        return {
          title: "No analytics data",
          description: "Once you have active campaigns, detailed analytics and insights will appear here.",
          icon: "TrendingUp",
          actionLabel: "View Campaigns"
        };
      case 'calendar':
        return {
          title: "No events scheduled",
          description: "Schedule your campaigns and important marketing events to stay organized.",
          icon: "Calendar",
          actionLabel: "Add Event"
        };
      case 'search':
        return {
          title: "No results found",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          icon: "SearchX",
          actionLabel: "Clear Filters"
        };
      default:
        return { title, description, icon, actionLabel };
    }
  };

  const content = getEmptyContent();

  const floatingElements = [
    { delay: 0, duration: 3 },
    { delay: 1, duration: 4 },
    { delay: 2, duration: 3.5 }
  ];

  return (
    <div className="flex items-center justify-center min-h-64 relative">
      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-xl"
          style={{
            left: `${20 + index * 30}%`,
            top: `${30 + index * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      <Card className="max-w-md w-full mx-auto text-center p-8 relative z-10" gradient>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6 
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 mb-6 relative"
        >
          <ApperIcon 
            name={content.icon} 
            size={40} 
            className="text-primary" 
          />
          
          {/* Animated Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {content.title}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {content.description}
          </p>

          {onAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Button
                variant="primary"
                onClick={onAction}
                icon={<ApperIcon name="Plus" size={16} />}
                className="mb-4"
              >
                {content.actionLabel}
              </Button>
            </motion.div>
          )}

          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Zap" size={14} className="text-accent" />
              <span>Quick Setup</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Shield" size={14} className="text-success" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" size={14} className="text-info" />
              <span>Real-time</span>
            </div>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

export default Empty;