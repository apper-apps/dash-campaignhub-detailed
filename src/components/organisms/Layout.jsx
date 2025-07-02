import { useState } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  
  const handleSearch = (searchTerm) => {
    // Handle global search functionality
    console.log('Global search:', searchTerm);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={handleMenuToggle} onSearch={handleSearch} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;