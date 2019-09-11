
// 订单状态
export enum OrderStatus {
  closed = 'closed', // 已结清
  overdue = 'overdue', // 已逾期
  waiting = 'waiting', // 待还款
}

// 分期状态
export enum StageStatus {
  closed = 'closed', // 已结清
  overdue = 'overdue', // 已逾期
  waiting = 'waiting', // 未过期
}