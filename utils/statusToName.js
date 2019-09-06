export const statusToName = (id) => {
  const mapping = {
    'id_0': 'normal', //正在审核
    'id_1': 'banking', //放款中
    'id_2': 'success', //待还款，未逾期
    'id_3': 'over', //待还款，已逾期
    'id_4': 'finished', //已完结
    'id_5': 'processing', //还款处理中
    'id_6': '',
    'id_11': 'refused', //拒绝
  };
  return mapping[`id_${id}`];
};

