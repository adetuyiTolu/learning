'use client'; // Needed if we import Next Link, though Link is allowed in server components, we might use onClick

import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonAsButton
  extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonAsLink
  extends BaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

// Helper for styles to avoid duplication
const getButtonStyles = (variant: Variant, size: Size, fullWidth: boolean) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    border: '2px solid transparent',
    width: fullWidth ? '100%' : 'auto',
    textDecoration: 'none', // For links
    fontFamily: 'inherit',
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: 'transparent',
      border: '2px solid var(--color-primary)',
      color: 'var(--color-primary)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
    },
  };

  return {
    ...base,
    ...sizes[size],
    ...variants[variant],
  };
};

const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    children,
  } = props;
  const styles = getButtonStyles(variant, size, fullWidth);

  if (props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={className} style={styles} {...rest}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={className} style={styles} {...rest}>
      {children}
    </button>
  );
};

export default Button;
