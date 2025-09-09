import React from 'react';

const DecorativeElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top center asterisk */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" stroke="white" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Mid-left gear */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.5 4.5L16 6L13.5 7.5L12 10L10.5 7.5L8 6L10.5 4.5L12 2Z" stroke="white" strokeWidth="1" fill="none"/>
          <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M12 9V15M9 12H15" stroke="white" strokeWidth="1"/>
        </svg>
      </div>

      {/* Mid-right floral pattern */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="2" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M10 2L10 6M10 14L10 18M2 10L6 10M14 10L18 10" stroke="white" strokeWidth="1"/>
          <path d="M4.5 4.5L7 7M13 13L15.5 15.5M15.5 4.5L13 7M7 13L4.5 15.5" stroke="white" strokeWidth="1"/>
        </svg>
      </div>

      {/* Bottom-left progress indicator */}
      <div className="absolute bottom-8 left-8">
        <div className="flex flex-col items-start space-y-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-40"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-20"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

export default DecorativeElements;
