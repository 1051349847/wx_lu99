import {Http} from "../utils/http";
import {Paging} from "../utils/paging";

export class Order {



    static async doOrder(param) {

        return await Http.request({
            url: 'order',
            method:'post',
            data:{products:param},
        })
        //that.execSetStorageSync(true);

    }

    static async receipt(id) {

        return await Http.request({
            url: 'order/receipt',
            method:'post',
            data:{id:id},
        })


    }

    static async getMyOrder() {
        return await Http.request({
            url: 'order/by_index?index=0'
        })
    }

    /*
    * 拉起微信支付
    * params:
    * norderNumber - {int} 订单id
    * return：
    * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付  成  功；
    * */
    static async execPay(orderNumber) {

        return await Http.request({
            url: 'pay/pre_order',
            method: 'POST',
            data: {id: orderNumber},
        })


    }

    static async getAssOrder(id) {
        return await Http.request({
            url: 'order/have_ass?ass_id='+id,
        })
    }
}