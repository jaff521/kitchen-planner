export async function mockCallFunction(args) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let db = JSON.parse(localStorage.getItem('mockFloorPlans') || '[]');
      
      if (args.name === 'submitLayout') {
        const newDoc = {
          _id: 'local_' + Date.now().toString(),
          user_id: 'anonymous_user',
          layout_data: args.data.layout_data,
          status: 'pending',
          reject_reason: '',
          created_at: Date.now()
        };
        db.push(newDoc);
        localStorage.setItem('mockFloorPlans', JSON.stringify(db));
        resolve({ result: { code: 200, message: 'Submitted via Mock', data: newDoc } });
      }
      
      if (args.name === 'reviewLayout') {
        if (args.data.action === 'list') {
          let resData = db;
          if (args.data.statusFilter && args.data.statusFilter !== 'all') {
            resData = db.filter(d => d.status === args.data.statusFilter);
          }
          resData = resData.sort((a,b)=>b.created_at - a.created_at);
          resolve({ result: { code: 200, data: resData } });
        } else if (args.data.action === 'update') {
          const index = db.findIndex(d => d._id === args.data.id);
          if(index !== -1) {
            db[index].status = args.data.status;
            db[index].reject_reason = args.data.reject_reason || '';
            localStorage.setItem('mockFloorPlans', JSON.stringify(db));
          }
          resolve({ result: { code: 200, message: 'Updated logically via Mock' } });
        } else {
          resolve({ result: { code: 400, message: 'Invalid action' } });
        }
      }
    }, 200);
  });
}
