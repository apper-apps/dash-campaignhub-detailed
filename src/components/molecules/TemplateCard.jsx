import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TemplateCard = ({ template, onPreview, onUseTemplate }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col overflow-hidden group cursor-pointer" onClick={() => onPreview(template)}>
        {/* Template Preview Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ApperIcon name={getChannelIcon(template.channel)} size={48} className="text-primary/60" />
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="white" className="backdrop-blur-sm">
              {template.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={getDifficultyVariant(template.difficulty)}>
              {template.difficulty}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        </div>

        {/* Template Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <ApperIcon name={getChannelIcon(template.channel)} size={20} className="text-gray-400 flex-shrink-0 ml-2" />
          </div>
          
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
            {template.description}
          </p>

          {/* Template Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {Object.values(template.metrics)[0]}
              </div>
              <div className="text-xs text-gray-500">
                {Object.keys(template.metrics)[0].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {template.estimatedTime}
              </div>
              <div className="text-xs text-gray-500">Setup Time</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                +{template.tags.length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template);
              }}
              className="flex-1"
              icon={<ApperIcon name="Eye" size={14} />}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onUseTemplate(template);
              }}
              className="flex-1"
              icon={<ApperIcon name="Plus" size={14} />}
            >
              Use Template
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TemplateCard;