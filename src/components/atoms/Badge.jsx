import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  icon = null 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    accent: "bg-accent/10 text-accent border border-accent/20",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    error: "bg-error/10 text-error border border-error/20",
    active: "bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg",
    paused: "bg-gradient-to-r from-warning to-yellow-500 text-white shadow-lg",
    draft: "bg-gray-200 text-gray-700",
    completed: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <motion.span
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <span className="mr-1.5">{icon}</span>
      )}
      {children}
    </motion.span>
  );
};

export default Badge;