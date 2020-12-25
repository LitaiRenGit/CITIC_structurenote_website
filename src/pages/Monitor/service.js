import request from '@/utils/request';

export async function queryRule(params) {
  return request('/api/monitor/rule', {
    params,
  });
}
export async function removeRule(params) {
  return request('/api/monitor/remove', {
    method: "POST",
    data: { ...params, method: "delete" },
  });
}
export async function addRule(params) {
  return request('/api/search/add', {
    method: 'POST',
    data: params,
  });
}
export async function calcRule(params) {
  return request('/api/search/calculate', {
    method: 'POST',
    data: { ...params, method: 'calculate' },
  });
}
export async function multicalcRule(params) {
  return request('/api/search/calculate', {
    method: 'POST',
    data: { ...params, method: 'multicalculate' },
  });
}
export async function updatePrice(params) {
  return request('/api/search/update', {
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
