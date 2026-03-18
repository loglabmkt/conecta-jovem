import React from 'react';

/**
 * StackingSection – wrapper para o efeito de card empilhado (sticky stack).
 * 
 * Props:
 *  - zIndex      : z-index do card
 *  - children    : conteúdo da seção
 *  - className   : classes extras (opcional)
 *  - isFirst     : true para a seção hero (sem border-radius / sombra superior)
 */
export default function StackingSection({ zIndex = 1, children, className = '', isFirst = false }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex,
        minHeight: '100vh',
        borderRadius: isFirst ? 0 : '20px 20px 0 0',
        boxShadow: isFirst ? 'none' : '0 -8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
}