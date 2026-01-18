/**
 * useKeyboardUser Hook
 * 
 * Detects keyboard vs mouse navigation to apply enhanced focus styles
 * only for keyboard users. Sets a global class 'keyboard-user' on body
 * when Tab is pressed, removes it on mouse click.
 */

import { useEffect } from 'react';

export const useKeyboardUser = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-user');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
};

export default useKeyboardUser;
