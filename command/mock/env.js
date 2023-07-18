module.exports = {
  mockPath: {
    action: './mock/action',
    restful: './mock/restful',
  },
  requestLimit: '50mb',
  notFoundResponse: {
    RetCode: 400,
    Message: 'NotFound',
    Data: null,
  },
  cors: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    'Content-Type': 'application/json;charset=utf-8',
  },
};
