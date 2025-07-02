import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  glass = false,
  onClick = null 
}) => {
  const baseClasses = "bg-surface rounded-xl shadow-card border border-gray-100";
  const hoverClasses = hover ? "card-hover" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" : "";
  const glassClasses = glass ? "glass-effect" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";
  
  return (
    <motion.div
      className={`
        ${baseClasses}
        ${hoverClasses}
        ${gradientClasses}
        ${glassClasses}
        ${clickableClasses}
        ${className}
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;