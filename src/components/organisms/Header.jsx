import { useState } from 'react';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onMenuToggle, onSearch }) => {
  const [notifications] = useState([
    { id: 1, message: "Campaign 'Summer Sale' performance is above target", type: 'success' },
    { id: 2, message: "Budget alert: 'Brand Awareness' campaign at 85% spend", type: 'warning' }
  ]);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            icon={<ApperIcon name="Menu" size={20} />}
            className="lg:hidden"
          />
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold text-gray-900">
              Campaign Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage and optimize your marketing campaigns
            </p>
          </div>
        </div>
        
        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar onSearch={onSearch} />
        </div>
        
        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon={<ApperIcon name="Bell" size={20} />}
              className="relative"
            />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          <Button
            variant="primary"
            size="sm"
            icon={<ApperIcon name="Plus" size={16} />}
            className="hidden sm:flex"
          >
            New Campaign
          </Button>
          
          {/* Profile */}
          <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Marketing Manager</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  );
};

export default Header;