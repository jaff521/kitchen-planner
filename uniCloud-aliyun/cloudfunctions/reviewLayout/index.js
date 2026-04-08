'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  const { action, id, status, statusFilter, reject_reason } = event;

  if (action === 'list') {
    let query = {};
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }
    const res = await db.collection('floorPlans').where(query).orderBy('created_at', 'desc').get();
    return { code: 200, data: res.data };
  }

  if (action === 'update') {
    if (!id || !status) return { code: 400, message: 'Missing params' };
    
    await db.collection('floorPlans').doc(id).update({
      status,
      reject_reason: reject_reason || ''
    });
    
    return { code: 200, message: 'Updated logically' };
  }

  return { code: 400, message: 'Invalid action' };
};
