import React from 'react';

export function Toast({ type, message }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
}
