/**
 * useKeyboardEvents
 * Thin wrapper exposing whether the on-screen keyboard is currently
 * visible, for components that adjust layout on keyboard open/close.
 */
import { useKeyboardState } from 'react-native-keyboard-controller';

const useKeyboardEvents = () => {
  const { isVisible: isKeyboardOpen } = useKeyboardState();

  return { isKeyboardOpen };
};

export default useKeyboardEvents;
