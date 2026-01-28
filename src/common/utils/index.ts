// 一维数据生成树
export function buildTree(list: any[], parentId = '0') {
  return list
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(list, item.id),
    }));
}
