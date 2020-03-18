import {Http} from "../utils/http";

export class Image {
    static async getListById(id) {
        return await Http.request({
            url: 'index/group_list?id='+id
        });
    }
}