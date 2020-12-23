import request from '@/utils/request';

export async function queryRule(params) {
  // console.log(params);
  const temp = request('/api/monitor/rule', {
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
  const temp = request('/api/monitor/remove', {
    method: "POST",
    data: { ...params, method: "delete" },
  });
  // var __temp;
  // temp.then((data) => {
  //   __temp = data;
  //   return data;
  // });
  return temp;
}
export async function addRule(params) {
  return request('/api/monitor/add', {
    method: 'POST',
    data: params,
  });
}
export async function calcRule(params) {
  return request('/api/monitor/calculate', {
    method: 'POST',
    data: { ...params, method: 'calculate' },
  });
}
export async function multicalcRule(params) {
  return request('/api/monitor/calculate', {
    method: 'POST',
    data: { ...params, method: 'multicalculate' },
  });
}
export async function updatePrice(params) {
  return request('/api/monitor/update', {
    method: 'POST',
    data: params,
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
