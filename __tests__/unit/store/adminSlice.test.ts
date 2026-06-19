import { TFunction } from 'i18next';

import adminReducer, { resetUsers, setAdminLoader } from '@store/adminSlice';
import {
  deleteMessage,
  fetchUnreadCount,
  markMessageRead,
} from '@store/thunks/adminThunks';
import { AdminState, InboxMessage } from '@store/types';

const t = ((key: string) => key) as unknown as TFunction;

const makeMessage = (id: string, isRead: boolean): InboxMessage => ({
  _id: id,
  sender: null,
  title: 'Test title',
  body: 'Test body',
  type: 'in_app',
  isRead,
  isSystemMessage: true,
  createdAt: new Date().toISOString(),
});

const initialState: AdminState = {
  users: [],
  messages: [],
  unreadCount: 0,
  loader: false,
  usersPage: 1,
  usersHasMore: true,
};

describe('adminSlice reducers', () => {
  it('returns initial state', () => {
    expect(adminReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setAdminLoader sets loader to true', () => {
    const state = adminReducer(initialState, setAdminLoader(true));
    expect(state.loader).toBe(true);
  });

  it('setAdminLoader sets loader to false', () => {
    const state = adminReducer(
      { ...initialState, loader: true },
      setAdminLoader(false),
    );
    expect(state.loader).toBe(false);
  });

  it('resetUsers clears users list and resets pagination', () => {
    const state = adminReducer(
      {
        ...initialState,
        users: [{ _id: '1' } as any],
        usersPage: 3,
        usersHasMore: false,
      },
      resetUsers(),
    );
    expect(state.users).toEqual([]);
    expect(state.usersPage).toBe(1);
    expect(state.usersHasMore).toBe(true);
  });
});

describe('adminSlice — fetchUnreadCount.fulfilled', () => {
  it('sets unreadCount from payload', () => {
    const state = adminReducer(
      { ...initialState, unreadCount: 0 },
      fetchUnreadCount.fulfilled({ count: 7 }, '', { t }),
    );
    expect(state.unreadCount).toBe(7);
  });
});

describe('adminSlice — markMessageRead.fulfilled', () => {
  it('marks the target message as read', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', false)],
        unreadCount: 3,
      },
      markMessageRead.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.messages[0].isRead).toBe(true);
  });

  it('decrements unreadCount when message was unread', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', false)],
        unreadCount: 3,
      },
      markMessageRead.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.unreadCount).toBe(2);
  });

  it('does not decrement unreadCount when message was already read', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', true)],
        unreadCount: 3,
      },
      markMessageRead.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.unreadCount).toBe(3);
  });

  it('does nothing when message id is not found', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', false)],
        unreadCount: 2,
      },
      markMessageRead.fulfilled({ messageId: 'not-exist' }, '', {
        t,
        messageId: 'not-exist',
      }),
    );
    expect(state.messages[0].isRead).toBe(false);
    expect(state.unreadCount).toBe(2);
  });
});

describe('adminSlice — deleteMessage.fulfilled', () => {
  it('removes the target message from the list', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', true), makeMessage('msg2', true)],
      },
      deleteMessage.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]._id).toBe('msg2');
  });

  it('decrements unreadCount when deleted message was unread', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', false)],
        unreadCount: 3,
      },
      deleteMessage.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.unreadCount).toBe(2);
  });

  it('does not decrement unreadCount when deleted message was already read', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', true)],
        unreadCount: 3,
      },
      deleteMessage.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.unreadCount).toBe(3);
  });

  it('does not decrement unreadCount below zero', () => {
    const state = adminReducer(
      {
        ...initialState,
        messages: [makeMessage('msg1', false)],
        unreadCount: 0,
      },
      deleteMessage.fulfilled({ messageId: 'msg1' }, '', {
        t,
        messageId: 'msg1',
      }),
    );
    expect(state.unreadCount).toBe(0);
  });
});
