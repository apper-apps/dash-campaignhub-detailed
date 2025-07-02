import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TemplateModal = ({ template, onClose, onUseTemplate }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!template) return null;

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      'Beginner': 'success',
      'Intermediate': 'warning', 
      'Advanced': 'error',
      'Expert': 'dark'
    };
    return variants[difficulty] || 'default';
  };

  const getChannelIcon = (channel) => {
    const icons = {
      email: 'Mail',
      social: 'Share2',
      search: 'Search',
      display: 'Monitor',
      video: 'Video'
    };
    return icons[channel] || 'Target';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <div className="h-64 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name={getChannelIcon(template.channel)} size={80} className="text-white/80" />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(90vh-16rem)] overflow-y-auto">
            {/* Title and Badges */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{template.name}</h2>
                <p className="text-gray-600 text-lg">{template.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <Badge variant="primary">{template.category}</Badge>
                <Badge variant={getDifficultyVariant(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {template.estimatedTime}
                </div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
              {Object.entries(template.metrics).map(([key, value], index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                  <div className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                </div>
              ))}
            </div>

            {/* Template Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Campaign Settings</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center">
                          <ApperIcon name="Check" size={16} className="text-green-500 mr-2 flex-shrink-0" />
                          Pre-configured budget: ${template.template.budget.toLocaleString()}
                        </li>
                        <li className="flex items-center">
                          <ApperIcon name="Check" size={16} className="text-green-500 mr-2 flex-shrink-0" />
                          Channel: {template.template.channel}
                        </li>
                        <li className="flex items-center">
                          <ApperIcon name="Check" size={16} className="text-green-500 mr-2 flex-shrink-0" />
                          Campaign structure and setup
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Content & Assets</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {Object.keys(template.template.content).map((key, index) => (
                          <li key={index} className="flex items-center">
                            <ApperIcon name="Check" size={16} className="text-green-500 mr-2 flex-shrink-0" />
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Start your campaign with this proven template
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onUseTemplate(template)}
                  icon={<ApperIcon name="Rocket" size={16} />}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplateModal;