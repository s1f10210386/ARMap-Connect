import { nearbyRecords } from '$/repository/postRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    const result = await nearbyRecords(query.latitude, query.longitude);
    return { status: 200, body: result };
  },
}));
