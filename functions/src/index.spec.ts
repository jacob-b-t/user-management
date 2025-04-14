import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteUser } from './index'; // Adjust path
import * as logger from 'firebase-functions/logger';
import { getFirestore } from 'firebase-admin/firestore';

vi.mock('firebase-functions/logger', () => ({
  info: vi.fn(),
  error: vi.fn(),
}));

const deleteMock = vi.fn().mockResolvedValue('deleted!');
const docMock = vi.fn(() => ({ delete: deleteMock }));
const collectionMock = vi.fn(() => ({ doc: docMock }));

vi.mock('firebase-admin/firestore', async () => {
  const actual = await vi.importActual<
    typeof import('firebase-admin/firestore')
  >('firebase-admin/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(() => ({
      collection: collectionMock,
    })),
  };
});

// Utility: Create a mock response object
const createMockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe('deleteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for non-DELETE methods', async () => {
    const req: any = { method: 'GET', path: '/123' };
    const res = createMockResponse();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: 'Only delete method allowed',
    });
  });

  it('should return 400 if no path param is provided', async () => {
    const req: any = { method: 'DELETE', path: '/' };
    const res = createMockResponse();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: 'Please provide userId as path parameter',
    });
  });

  it('should delete user and return success message', async () => {
    const req: any = { method: 'DELETE', path: '/123' };
    const res = createMockResponse();

    await deleteUser(req, res);

    expect(getFirestore).toHaveBeenCalled();
    expect(collectionMock).toHaveBeenCalledWith('users');
    expect(docMock).toHaveBeenCalledWith('/123');
    expect(deleteMock).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(
      'User has been deleted from the database'
    );
  });

  it('should handle errors gracefully', async () => {
    deleteMock.mockRejectedValueOnce(new Error('fail'));
    const req: any = { method: 'DELETE', path: '/123' };
    const res = createMockResponse();

    await deleteUser(req, res);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Error in function' });
  });
});
