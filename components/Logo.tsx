import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 200 120" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Igreja Batista Crescer Logo"
  >
    {/* Abstract representation of the provided logo overlapping circles */}
    <circle cx="50" cy="60" r="40" fill="#FDEBD0" opacity="0.9" />
    <circle cx="90" cy="60" r="45" fill="#F4AB44" opacity="0.9" />
    <circle cx="140" cy="60" r="50" fill="#D95418" opacity="0.9" />
  </svg>
);
