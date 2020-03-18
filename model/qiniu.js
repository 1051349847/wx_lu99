import {Http} from "../utils/http";

export class Qiniu {
    static async get_token() {
        return await Http.request({
            url: '/upload/get_token'
        })
    }

}