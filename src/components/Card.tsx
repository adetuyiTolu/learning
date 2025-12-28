import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  role?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  role = 'region',
  style,
  ...props
}) => {
  return (
    <div
      role={role}
      className={className}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        ...style,
      }}
      {...props}
    >
      {title && (
        <h3
          style={{
            marginTop: 0,
            marginBottom: 'var(--spacing-sm)',
            fontSize: '1.25rem',
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
