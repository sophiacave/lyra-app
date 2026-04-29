'use client';
import { useRef, useState, useCallback } from 'react';

const ELEMENT_CLASSES = {
  card: 'liquid-card',
  panel: 'liquid-panel',
  button: 'liquid-btn',
  input: 'liquid-input',
  modal: 'liquid-modal',
  badge: 'liquid-badge',
  tabs: 'liquid-tabs',
};

export function LiquidFilters() {
  return (
    <svg
      className="liquid-filters-svg"
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Subtle variant */}
        <filter id="liquid-subtle" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="1" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="6" xChannelSelector="R" yChannelSelector="G" result="disp" />
          <feGaussianBlur in="disp" stdDeviation="1" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.3" specularExponent="20" result="spec">
            <fePointLight x="200" y="100" z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.15" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Standard variant */}
        <filter id="liquid-standard" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="10" xChannelSelector="R" yChannelSelector="G" result="disp" />
          <feGaussianBlur in="disp" stdDeviation="1.5" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="3" specularConstant="0.5" specularExponent="25" result="spec">
            <fePointLight x="250" y="80" z="350" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.2" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Intense variant */}
        <filter id="liquid-intense" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="3" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="16" xChannelSelector="R" yChannelSelector="G" result="disp" />
          <feGaussianBlur in="disp" stdDeviation="2" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="4" specularConstant="0.7" specularExponent="30" result="spec">
            <fePointLight x="300" y="60" z="400" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.25" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Hero variant — wide, dramatic */}
        <filter id="liquid-hero" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="20" xChannelSelector="R" yChannelSelector="G" result="disp" />
          <feGaussianBlur in="disp" stdDeviation="2.5" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.8" specularExponent="35" result="spec">
            <fePointLight x="400" y="50" z="500" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

export default function LiquidGlass({
  children,
  variant = 'standard',
  element = 'card',
  className = '',
  as: Tag = 'div',
  interactive = true,
  glow = true,
  ...props
}) {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || !interactive) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 50, y: 50 });
  }, []);

  const elementClass = ELEMENT_CLASSES[element] || 'liquid-card';
  const variantClass = `liquid-${variant}`;

  return (
    <Tag
      ref={ref}
      className={`${elementClass} ${variantClass} ${className}`}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      style={{
        '--liquid-mouse-x': `${mousePos.x}%`,
        '--liquid-mouse-y': `${mousePos.y}%`,
        ...props.style,
      }}
      {...Object.fromEntries(
        Object.entries(props).filter(([k]) => k !== 'style')
      )}
    >
      {glow && <span className="liquid-specular" aria-hidden="true" />}
      <span className="liquid-edge" aria-hidden="true" />
      {children}
    </Tag>
  );
}

// Convenience exports for specific element types
export function LiquidCard(props) {
  return <LiquidGlass element="card" {...props} />;
}

export function LiquidPanel(props) {
  return <LiquidGlass element="panel" interactive={false} {...props} />;
}

export function LiquidButton({ children, ...props }) {
  return (
    <LiquidGlass element="button" as="button" variant="subtle" {...props}>
      {children}
    </LiquidGlass>
  );
}

export function LiquidBadge({ children, color = 'purple', className = '', ...props }) {
  return (
    <LiquidGlass element="badge" as="span" variant="subtle" interactive={false} glow={false} className={`liquid-badge-${color} ${className}`} {...props}>
      {children}
    </LiquidGlass>
  );
}
