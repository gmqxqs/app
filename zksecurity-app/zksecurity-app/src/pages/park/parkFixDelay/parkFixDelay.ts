// 停车场-- 固定车延期
import { Component } from '@angular/core';
import { Platform,NavController } from 'ionic-angular';
import { ParkDelayOperationPage } from "../parkDelayOperation/parkDelayOperation";
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from "../../../providers/utils";

@Component({
	selector: 'page-parkFixDelay',
	templateUrl: 'parkFixDelay.html'
})

export class ParkFixDelayPage {

  items: any;
  id:any;
  //车场模式
  parkingLotModel:any;
  isLast:boolean;


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public utils:Utils, public http: HttpService,private platform: Platform) {
    this.initializeItems();
  }

  getItems(ev: any) {
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
    this.query(null, true).then(resp => {}, err => {});
  }

  delFixDelay(item) {
    this.http.post('app/v1/FixCarCancel', {id: item.id}).then(res => {
      if (res['ret'] === 'OK') {
        this.removeItem(item);
      } else {
        this.utils.message.error(res['message'] || 'COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
      }
    }, err => {
      this.utils.message.error('COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
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
        this.delFixDelay(item);
    });
  }

  refresh(){
    this.query(null,true).then(res => {}, err => {});
  }

  delay(item){
    this.id = item.id;
    this.navCtrl.push(ParkDelayOperationPage,this);
  }

  /**
   * 查询车辆
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if(!params) {
      params = pager({});
    }
    this.isLast = false;
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkCarDelay', params, hideLoad).then(res => {
        console.log(res);
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
        } else {
          // this.utils.message.error(res['message'] || res['ret']);
        }
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
    this.isLast = false;
    this.utils.beforeRefresh('page-parkFixDelay');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkFixDelay');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkFixDelay');
    });
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
