import { motion } from 'framer-motion';

const ProgressBar = ({ 
  value, 
  max = 100, 
  className = '', 
  color = 'primary',
  size = 'md',
  showValue = false,
  label = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    primary: 'from-primary to-secondary',
    accent: 'from-accent to-yellow-500',
    success: 'from-success to-emerald-600',
    warning: 'from-warning to-yellow-500',
    error: 'from-error to-red-600'
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`bg-gradient-to-r ${colors[color]} ${sizes[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;