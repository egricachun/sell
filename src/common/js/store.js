// 存 商家id,字段key,值value
export function saveToLocal(id, key, value) {
  // localStorage中有没有__seller__。命名习惯，双下划綫，表示私有
  let seller = localStorage.__seller__;
  if (!seller) { // 第一次存储,没有seller
    seller = {}; // 把seller设为空对象
    seller[id] = {}; // 把seller[id]设为空对象
  } else { // 不是第一次存储
    seller = JSON.parse(seller); // 将一个JSON字符串转换为对象。
    if (!seller[id]) { // 没有id商家
      seller[id] = {};
    }
  }
  seller[id][key] = value; // 保存值
  localStorage.__seller__ = JSON.stringify(seller); // 用于将JavaScript值转换为JSON字符串。
};
// 取 商家id,默认值def
export function loadFromLocal(id, key, def) {
  let seller = localStorage.__seller__;
  if (!seller) { // 读取事没有seller，返回默认值
    return def;
  }
  seller = JSON.parse(seller)[id]; // 将一个JSON字符串转换为对象。
  if (!seller) { // 没有这个id
    return def;
  }
  let ret = seller[key];
  return ret || def; // 有值返回值，没值返回默认值
}
