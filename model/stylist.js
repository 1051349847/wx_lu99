import {Http} from "../utils/http";

export class Stylist {
    static async getAll(){
        return await Http.request({
            url: 'stylelist/get_all',
        });
    }
}