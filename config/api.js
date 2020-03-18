
var WxApiRoot = 'https://lu99.api.029tulingling.com/api/v1/';
module.exports = {
  User_token:WxApiRoot+'index/space_list',//获取首页数据
  Get_uid: WxApiRoot + 'user/get_uid',//获取用户id
  Space_invited: WxApiRoot + 'space/invited',//邀请用户进入空间
  Notify_read: WxApiRoot + 'notify/read',//消息已读状态
  Notify_detail: WxApiRoot + 'notify/detail',//获取消息详情
  User_notify: WxApiRoot + 'user/notify',//获取用户消息
  Stylelist_get_all: WxApiRoot + 'stylelist/get_all',//用户消息
  Box_box_list: WxApiRoot + 'box/box_list',//照片盒列表
  Space_create: WxApiRoot + 'space/create',//创建空间
  Order_detail: WxApiRoot + 'order/detail',//订单详情
  Pay_pre_order: WxApiRoot + 'pay/pre_order',//支付参数
  Notify_unread: WxApiRoot + 'notify/unread',//用户未读消息
  Order: WxApiRoot + 'order',//
  Notify_del: WxApiRoot + 'notify/del',//删除消息
  Index_search: WxApiRoot + 'index/search',//首页搜索
  Box_search: WxApiRoot + 'box/search',//照片盒搜索
  Stylelist_get_all: WxApiRoot + 'stylelist/get_all',//设计师
  Order_search: WxApiRoot + 'order/search',//订单查询
  Box_save: WxApiRoot + 'box/save',//保存照片盒
  Order_save: WxApiRoot + 'order/save',//保存订单

}