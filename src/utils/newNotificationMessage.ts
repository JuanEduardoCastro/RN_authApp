import { Dispatch } from '@reduxjs/toolkit';
import { setMessageType, setNotificationMessage } from 'src/store/authSlice';
import { INotificationMessage } from 'src/store/types';

export const newNotificationMessage = (
  dispatch: Dispatch,
  { messageType, notificationMessage }: INotificationMessage,
) => {
  if (!messageType) {
    dispatch(setMessageType(null));
    dispatch(setNotificationMessage(null));
  } else if (messageType) {
    dispatch(setMessageType(messageType));
    dispatch(setNotificationMessage(notificationMessage));
  }
};
