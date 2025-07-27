import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MusicPlayer from './MusicPlayer';
import FloatingActionButtons from './FloatingActionButtons';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showMusicPlayer?: boolean;
  showFloatingActions?: boolean;
  onAddClick?: () => void;
  onEmergencyClick?: () => void;
  onDebugClick?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showMusicPlayer = true,
  showFloatingActions = true,
  onAddClick,
  onEmergencyClick,
  onDebugClick
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Layout Frame */}
      <div className="frame-container">
        {/* Header Frame */}
        {showHeader && (
          <div className="frame-header">
            <Header />
          </div>
        )}
        
        {/* Main Content Frame */}
        <main className="frame-main">
          {/* Content Container with proper spacing and centering */}
          <div className="frame-content">
            {/* Content Frame with improved centering */}
            <div className="frame-content-inner flex flex-col items-center justify-center min-h-full">
                          <div className="w-full max-w-4xl mx-auto px-4 @sm:px-6 @lg:px-8 py-4 @sm:py-6 @lg:py-8">
              {children}
            </div>
            </div>
          </div>
        </main>
        
        {/* Footer Frame */}
        {showFooter && (
          <div className="frame-footer">
            <Footer />
          </div>
        )}
      </div>
      
      {/* Floating Elements Frame */}
      {showMusicPlayer && <MusicPlayer />}
      {showFloatingActions && (
        <FloatingActionButtons 
          onAddClick={onAddClick}
          onEmergencyClick={onEmergencyClick}
          onDebugClick={onDebugClick}
        />
      )}
    </div>
  );
};

export default MainLayout;