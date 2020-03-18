import {Http} from "../utils/http";

export class Product {
    static async getProductDetail(id) {
        return await Http.request({
            url: '/product/detail?id=' + id
        });
    }

    static async getAllProducts() {
        return await Http.request({
            url: '/product/all'
        });
    }

    /*获得元素上的绑定的值*/
    static getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };
}