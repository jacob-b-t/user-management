import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const deleteUser = onRequest(async (request, response) => {
  console.log('req', request)
  try {
    if (request?.method !== 'DELETE') {
      response.status(400).send({ error: 'Only delete method allowed' });
    } else if (!request.path || request.path === '/') {
      response
        .status(400)
        .send({ error: 'Please provide userId as path parameter' });
    } else {
      logger.info(request.path);
      const res = await getFirestore()
        .collection('users')
        .doc(request.path)
        .delete();
      logger.info(res);
      response.send('User has been deleted from the database');
    }
  } catch (error) {
    logger.error(error);
    response.status(500).send({ error: 'Error in function' });
  }
});
