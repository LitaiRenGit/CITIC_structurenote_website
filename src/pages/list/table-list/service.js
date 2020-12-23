import request from 'umi-request';

export async function queryRule(params) {
  const temp = request('/api/rule', {
    params,
  });
  // console.log(temp);
  // var __temp;
  // temp.then((data) => {
  //   __temp = data;
  // });
  return temp;
}
export async function removeRule(params) {
  const temp = request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
  // var __temp;
  // temp.then((data) => {
  //   __temp = data;
  // });
  return temp;
}
export async function addRule(params) {
  const temp = request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
  let __temp;
  temp.then((data) => {
    __temp = data;
  });
  return temp;
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
