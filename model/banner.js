import {Http} from "../utils/http";

export class Banner {

    static async getBannerIndex() {
        return await Http.request({
            url: 'banner/1'
        });
    }


  /*获得元素上的绑定的值*/
  static getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };
}