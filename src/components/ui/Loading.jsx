import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';

const Loading = ({ type = 'cards', count = 3 }) => {
  const shimmerVariants = {
    animate: {
      x: ['0%', '100%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 1.5,
          ease: 'linear',
        },
      },
    },
  };

  const SkeletonCard = () => (
    <Card className="p-6 relative overflow-hidden">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
            <div className="flex space-x-2">
              <div className="h-4 bg-gray-200 rounded-full w-16"></div>
              <div className="h-4 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full"></div>
          
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
          
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      
      {/* Shimmer Effect */}
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ x: '-100%' }}
      />
    </Card>
  );

  const SkeletonMetric = () => (
    <Card className="p-6 relative overflow-hidden">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
      
      {/* Shimmer Effect */}
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ x: '-100%' }}
      />
    </Card>
  );

  const SkeletonChart = () => (
    <Card className="p-6 relative overflow-hidden">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
      
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ x: '-100%' }}
      />
    </Card>
  );

  if (type === 'metrics') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonMetric key={i} />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return <SkeletonChart />;
  }

  if (type === 'table') {
    return (
      <Card className="relative overflow-hidden">
        <div className="animate-pulse p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ x: '-100%' }}
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Loading;