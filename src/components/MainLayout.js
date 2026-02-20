import React, {useState} from 'react';
import Sidebar from './Sidebar2';

function MainLayout({ children }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleNav = () => {
    setIsClosed(!isClosed);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    }
  };
  return (
    <div className="main-layout">
      <Sidebar /> 
      <div className={`main-content ${isClosed ? 'expanded' : ''}`} id="main">{children}</div>
    </div>
  );
}

export default MainLayout;
