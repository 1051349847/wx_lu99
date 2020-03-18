
import {Paging} from "../utils/paging";
import {Http} from "../utils/http";

export class Homes {
    static async getImgListIndex(classId) {
        return new Paging({
            url: 'index/img_list?id='+classId,
        })

    }

    static async getSearchLabel(classId) {
        return await Http.request({
            url: 'management/get_label?page=1',
        })

    }

    static async validToken() {
        return await Http.request({
            url: 'token/verify',
            method: 'POST',
            data: {
                token: wx.getStorageSync('token')
            }
        })

    }




}