/*
* 获取url的参数部分，解析成一个对象
* @example ?id=12345&a=b
* @return Object {id:12345,a:b}
*/

export function urlParse() {
  let url = window.location.search; // 获得url参数字符串
  let obj = {};
  /*
  * [?&]匹配？或者& 只有一个
  * [^?&] 匹配除了问号和等号外的字符
  * ‘+’ 一个或多个
  * g 全局匹配
  */
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg); // 返回一个数组
  //  ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      // substring(start,stop) 用于提取字符串中介于两个指定下标之间的字符,stop可选，不选表示一直到结尾。
      // split(separator,howmany) 用于把一个字符串分割成字符串数组。
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val; // 形成对象形式
    });
    return obj;
  };
}
