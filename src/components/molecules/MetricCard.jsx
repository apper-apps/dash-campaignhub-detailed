import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon, 
  color = 'primary',
  format = 'number',
  className = '' 
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return new Intl.NumberFormat().format(val);
  };
  
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10'
  };
  
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-gray-500'
  };
  
  return (
    <Card className={`p-6 ${className}`} hover gradient>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <motion.div
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {formatValue(value)}
          </motion.div>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={14} 
                className="mr-1" 
              />
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;