// __mocks__/react-native-image-crop-picker.js
const mockImage = {
  path: 'mock-image-path.jpg',
  mime: 'image/jpeg',
  data: 'base64encodedimagedata', // If you includeBase64
  width: 100,
  height: 100,
  size: 1024,
  // Add other properties that your app might use from the response
};

const ImagePicker = {
  openPicker: jest.fn(() => Promise.resolve([mockImage])), // For single image or multiple, customize as needed
  openCamera: jest.fn(() => Promise.resolve(mockImage)),
  openCropper: jest.fn(() => Promise.resolve(mockImage)),
  clean: jest.fn(() => Promise.resolve()),
  cleanSingle: jest.fn(() => Promise.resolve()),
  // Add any other methods your app uses from the library
};

export default ImagePicker;
