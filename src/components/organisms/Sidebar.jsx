import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/', name: 'Dashboard', icon: 'BarChart3' },
    { path: '/campaigns', name: 'Campaigns', icon: 'Target' },
    { path: '/calendar', name: 'Calendar', icon: 'Calendar' },
    { path: '/analytics', name: 'Analytics', icon: 'TrendingUp' }
  ];
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:shadow-card
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                <ApperIcon name="Target" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CampaignHub</h1>
                <p className="text-xs text-gray-500">Marketing Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) => `
                    sidebar-item
                    ${isActive ? 'active' : ''}
                  `}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="Zap" size={20} className="text-primary" />
                <span className="font-medium text-gray-900">Pro Features</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Unlock advanced analytics and automation
              </p>
              <button className="w-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;