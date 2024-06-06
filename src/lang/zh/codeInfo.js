// 公共
const codeInfoList = [
  {
    code: 0,
    desc: '系统内部错误',
  },
  {
    code: 403,
    desc: '无效的登录token',
  },
  {
    code: 1000,
    desc: '错误的空间namespace',
  },
  {
    code: 1001,
    desc: '您还没有参与该空间',
  },
  {
    code: 1002,
    desc: '您不是空间管理者',
  },
  {
    code: 1003,
    desc: '空间不存在',
  },
  {
    code: 1004,
    desc: '不能移除空间创建者',
  },
  {
    code: 1005,
    desc: '空间创建者的权限不能修改',
  },
  {
    code: 1006,
    desc: '空间子域名已经存在了',
  },
  {
    code: 1100,
    desc: '不存在request请求',
  },
  {
    code: 1101,
    desc: 'id错误',
  },
  {
    code: 1102,
    desc: '数据库不存在的数据',
  },
  {
    code: 1103,
    desc: '请求的keyword错误',
  },
  {
    code: 1104,
    desc: '错误的WorkUuid',
  },
  {
    code: 1105,
    desc: '错误的请求数据',
  },
  {
    code: 2000,
    desc: '无效验证码',
  },
  {
    code: 2001,
    desc: '空验证码',
  },
  {
    code: 2002,
    desc: '无效验证码类型',
  },
  {
    code: 2010,
    desc: '无效邮箱',
  },
  {
    code: 2020,
    desc: '无效用户名',
  },
  {
    code: 2021,
    desc: '用户已经存在',
  },
  {
    code: 2022,
    desc: '用户不存在',
  },
  {
    code: 2023,
    desc: '用户名最多14个字符',
  },
  {
    code: 2030,
    desc: '空密码',
  },
  {
    code: 2040,
    desc: '无效钱包地址',
  },
  {
    code: 2041,
    desc: '钱包地址已经存在',
  },
  {
    code: 2042,
    desc: '无效的金库钱包地址',
  },
  {
    code: 2043,
    desc: '空间创建者的钱包地址有误',
  },
  {
    code: 2044,
    desc: '无效签名数据',
  },
  {
    code: 2045,
    desc: '无效的签名消息',
  },
  {
    code: 2046,
    desc: '无效的登录授权类型',
  },
  {
    code: 2047,
    desc: '签名消息验证失败',
  },
  {
    code: 2048,
    desc: '无效的ArConnect的公钥',
  },
  {
    code: 2051,
    desc: '帐号不能为空',
  },
  {
    code: 2052,
    desc: '密码不能为空',
  },
  {
    code: 2053,
    desc: '图片不存在',
  },
  {
    code: 2054,
    desc: '空的旧密码',
  },
  {
    code: 2055,
    desc: '空的新密码',
  },
  {
    code: 2056,
    desc: '错误的老密码',
  },
  {
    code: 2057,
    desc: '错误的密码',
  },
  {
    code: 2058,
    desc: '图片文件太大了',
  },
  {
    code: 2059,
    desc: '图片分辨率太大了',
  },
  {
    code: 2060,
    desc: '无效namespace',
  },
  {
    code: 2100,
    desc: 'name字段为空',
  },
  {
    code: 2101,
    desc: 'content字段为空',
  },
  {
    code: 2102,
    desc: 'content的数据太长了',
  },
  {
    code: 2103,
    desc: 'work的类型不对 10：文字，20：图片，30：音频，40：视频，50：混合',
  },
  {
    code: 2104,
    desc: '你没有访问的权限',
  },
  {
    code: 2105,
    desc: '对应的空间不存在',
  },
  {
    code: 2110,
    desc: 'link字段为空',
  },
  {
    code: 2111,
    desc: 'iconUrl字段为空',
  },
  {
    code: 2112,
    desc: 'link字段太长了',
  },
  {
    code: 2113,
    desc: 'subTitle字段太长了',
  },
  {
    code: 2120,
    desc: 'tag字段为空',
  },
  {
    code: 2121,
    desc: 'tagColor字段为空',
  },
  {
    code: 2122,
    desc: 'tag的名称已经存在了',
  },
  {
    code: 2130,
    desc: '数据库不存在的评论',
  },
  {
    code: 2131,
    desc: '打赏的金额有误',
  },
  {
    code: 2132,
    desc: '至少需要title和content存在之一',
  },
  {
    code: 2133,
    desc: 'title字段为空',
  },
  {
    code: 2134,
    desc: '这是一个web3空间，你需要在发布作品前，设置好你的钱包地址',
  },
  {
    code: 2135,
    desc: 'tagSet字段为空',
  },
  {
    code: 2136,
    desc: '错误上游分配比例',
  },
  {
    code: 2137,
    desc: '上游是必需的',
  },
  {
    code: 2138,
    desc: 'usage的数据太长了',
  },
  {
    code: 2139,
    desc: '空间创建者不能执行取消关注空间的操作',
  },
  {
    code: 2140,
    desc: '分润比例必须大于零小于等于1',
  },
  {
    code: 2141,
    desc: '该空间不存在这个作品',
  },
  {
    code: 2142,
    desc: '打赏金额必须大于1',
  },
  {
    code: 2143,
    desc: '不能打赏给自己',
  },
  {
    code: 2144,
    desc: '余额不足',
  },
  {
    code: 2145,
    desc: '冻结额度失败',
  },
  {
    code: 2200,
    desc: '无可用的地块',
  },
  {
    code: 2201,
    desc: '你不是地块的拥有者，不能编辑地块信息',
  },
  {
    code: 2202,
    desc: '地块已经被销售，不能再被购买',
  },
  {
    code: 2203,
    desc: '你的水滴余额不足，请充值',
  },
  {
    code: 2204,
    desc: '购买失败，请重试',
  },
  {
    code: 2205,
    desc: '错误的地块编号',
  },
  {
    code: 2206,
    desc: '无效地块',
  },
  {
    code: 2207,
    desc: '数据太长了',
  },
];

// Convert the above array into subject 404:'Address request error'
let codeInfo = {};
codeInfoList.forEach((item) => {
  codeInfo[item.code + '_code'] = item.desc;
});
export default codeInfo;
