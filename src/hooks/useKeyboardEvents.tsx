import { useKeyboardState } from 'react-native-keyboard-controller';

const useKeyboardEvents = () => {
  const { isVisible: isKeyboardOpen } = useKeyboardState();

  return { isKeyboardOpen };
};

export default useKeyboardEvents;
