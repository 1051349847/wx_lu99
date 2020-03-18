import {Http} from "../utils/http";

export class Box {
    static async getBoxList() {
        return await Http.request({
            url: 'box/box_list?page=1'
        });
    }

    static async saveImgs() {
        return await Http.request({
            url: 'box/save',
            method:'post',
            data:{

                imgs:wx.getStorageSync('selectImg')
            }
        });
    }

    static async deleteImgsBySelf(group_id) {
        return await Http.request({
            url: 'image/delete',
            method:'post',
            data:{
                group_id:group_id,
                imgs:wx.getStorageSync('selectImg')
            }
        });
    }
}