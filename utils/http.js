import {config} from "../config/config";
import {promisic} from "./utils";

export class Http {
  static async request({url, data, method = 'GET'}) {
    const res = await promisic(wx.request)({
      url: `${config.apiBaseUrl}${url}`,
      data: data,
      method:method,
      header:{
        token:wx.getStorageSync('token')
      },
    })
    return res.data
  }

  /*获得元素上的绑定的值*/
  static getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };
}