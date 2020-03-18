import {Http} from "../utils/http";

export class Category {
    static async getThemeIndex() {
        return await Http.request({
            url: 'theme/index',
        });
    }
}