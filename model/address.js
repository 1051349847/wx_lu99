import {Http} from "../utils/http";

export class Address {
    static async getAddress() {

        let res = await Http.request({
            url: 'address'
        });
        if (res)res.totalDetail = this.setAddressInfo(res);
        return res;
    }
    //提交地址
    static async submitAddress(data) {

        data = this._setUpAddress(data);
        return await Http.request({
            method:'post',
            url: 'address',
            data:data
        });
    }


    /*是否为直辖市*/
    static isCenterCity(name) {
        var centerCitys=['北京市','天津市','上海市','重庆市'],
            flag=centerCitys.indexOf(name) >= 0;
        return flag;
    }

    /*
    *根据省市县信息组装地址信息
    * provinceName , province 前者为 微信选择控件返回结果，后者为查询地址时，自己服务器后台返回结果
    */
    static setAddressInfo(res){
        var province =res.provinceName || res.province,
            city =res.cityName || res.city,
            country =res.countyName || res.country,
            detail =res.detailInfo || res.detail;
        var totalDetail=city+country+detail;

        console.log(res);

        //直辖市，取出省部分
        if(!this.isCenterCity(province)) {
            totalDetail=province+totalDetail;
        };
        return totalDetail;
    }

    /*保存地址*/
    static _setUpAddress(res){
        var formData={
            name:res.userName,
            province:res.provinceName,
            city:res.cityName,
            country:res.countyName,
            mobile:res.telNumber,
            detail:res.detailInfo
        };
        return formData;
    }
}