// 停车场-- 车牌授权列表
import { Component } from '@angular/core';
import { Platform,NavController, PopoverController } from 'ionic-angular';
import { PopoverPage } from "./popoverPage";
import { ParkCardNumDetailPage } from "../parkCardNumDetail/parkCardNumDetail";
import { ParkCardNumTemporaryDetailPage } from "../parkCardNumTemporaryDetail/parkCardNumTemporaryDetail";
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from '../../../providers/utils';

@Component({
	selector: 'page-parkCardNum',
	templateUrl: 'parkCardNum.html',
})

export class ParkCardNumPage {
  items: any;
  area:any;
  id:any;

  isLast:boolean;

  //车场模式
  parkingLotModel:any;
  customCurrency:any = "$";


goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
	constructor(public navCtrl: NavController, public utils:Utils, public popoverCtrl: PopoverController, public http: HttpService,private platform: Platform) {
    this.initializeItems();
	}

  initializeItems() {
    //获取车场模型
    this.http.post('app/v1/getParkingLotModel', {}, true).then((resp: { data?: any }) => {
      if (resp.data) {
        this.parkingLotModel = resp.data.parkingLotModel;
        console.log(this.parkingLotModel);
      }
    }, resp => {});
    this.http.post('app/v1/getParkParams', {}, true).then((resp: any) => {
      if (resp) {
        this.customCurrency = resp.data.customCurrency;
      }
    }, resp => { });
    this.query(null,true).then(res => {}, err => {});
  }

  delCardNum(item) {
    this.http.post('app/v1/parkAuthorizeLogout', {id: item.id}).then(res => {
      if (res['ret'] === 'OK') {
        this.removeItem(item);
        this.utils.message.success('COMMON_OP_SUCCESS');
      } else {
        this.utils.message.error(res['message']|| res['data'])
      }
    }, err => {
      this.utils.message.error('COMMON_OP_FAILED');
    });
  }

  removeItem(item){
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i] == item){
        this.items.splice(i, 1);
      }
    }
  }

  showAlert(item) {
    this.http.delConfirm('COMMON_DEL_MSG1').then(() => {
        this.delCardNum(item);
    })
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage,this);
    popover.present({
      ev: myEvent
    });
  }

  showDetail(item) {
    this.id=item.id;
    this.navCtrl.push(ParkCardNumDetailPage,this);
  }

  showTemporaryDetail(item) {
    this.id=item.id;
    this.navCtrl.push(ParkCardNumTemporaryDetailPage,this);
  }

  refresh(){
    this.query(null,true).then(res => {}, err => {});
  }

  /**
   * 查询车牌授权
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if(!params) {
      params = pager({});
    } else {
      params = pager(params)
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkAuthorize', params, hideLoad).then(res => {
        if(res['ret'] === 'OK') {
          if(!resolve(res) && res['data']) {
            if(append) {
              this.items = this.items.concat(res['data']['rows']);
            } else {
              this.items = res['data']['rows'];
            }
            if(res['data']['rows'].length < params.pageSize) {
              this.isLast = true;
            }
          }
        } else {}
      }, err => {
        reject(err);
      })
    });
  }

  /**
   * 下拉刷新数据
   * @param  {any} event
   * @return {void}
   */
  doRefresh(event) {
    this.utils.beforeRefresh('page-parkCardNum');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkCardNum');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkCardNum');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    this.isLast = false;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.query(pager({}, this.items.length),true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }
}

