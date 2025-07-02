import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  icon = null,
  loading = false
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 focus:ring-primary/20",
    secondary: "bg-white text-primary border-2 border-primary/20 hover:bg-primary/5 hover:border-primary focus:ring-primary/20",
    accent: "bg-gradient-to-r from-accent to-yellow-500 text-white hover:shadow-lg hover:scale-105 focus:ring-accent/20",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:shadow-lg hover:scale-105 focus:ring-success/20",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray/20",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error/20"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none";
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? disabledClasses : ''}
        ${className}
      `}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
};

export default Button;