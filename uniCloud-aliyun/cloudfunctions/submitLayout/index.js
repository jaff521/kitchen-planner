'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { layout_data } = event;
  if (!layout_data || !Array.isArray(layout_data)) {
    return { code: 400, message: 'Invalid layout logic data' };
  }

  // user_id is automatically grabbed by unicloud auth
  const res = await db.collection('floorPlans').add({
    user_id: context.UID || 'anonymous_user',
    layout_data: layout_data,
    status: 'pending',
    reject_reason: '',
    created_at: Date.now()
  });

  return {
    code: 200,
    message: 'Submitted successfully',
    data: res
  };
};
