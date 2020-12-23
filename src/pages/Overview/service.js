import request from '@/utils/request';

export async function chartPriceRule(params) {
  // console.log(params);
  const temp = request('/api/chart/rule', {
    method: "POST",
    data: { ...params, method: "price" },
  });
  return temp;
}
export async function chartStatisticsRule_1(params) {
  // console.log(params);
  return request('/api/chart/rule', {
    method: "POST",
    data: { ...params, method: "statistics_1" },
  });
}
export async function chartStatisticsRule_2(params) {
  // console.log(params);
  return request('/api/chart/rule', {
    method: "POST",
    data: { ...params, method: "statistics_2" },
  });
}
export async function chartStatisticsRule_3(params) {
  // console.log(params);
  return request('/api/chart/rule', {
    method: "POST",
    data: { ...params, method: "statistics_3" },
  });
}
