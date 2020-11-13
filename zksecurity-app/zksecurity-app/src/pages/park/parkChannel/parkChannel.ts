// 停车场-- 通道
import { Component } from '@angular/core';
import { Platform,NavController } from 'ionic-angular';
import { ParkChannelDetailPage } from "../parkChannelDetail/parkChannelDetail";
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from "../../../providers/utils";

@Component({
	selector: 'page-parkChannel',
	templateUrl: 'parkChannel.html'
})

export class ParkChannelPage {

  items: any;
  id:any;
  isLast:boolean;

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
	constructor(public navCtrl: NavController, public http: HttpService,  public utils: Utils,private platform: Platform) {
    this.initializeItems();
	}

  initializeItems() {
    this.query(null, true).then(resp => {}, err => {});
  }

  delChannel(item){
    this.http.post('app/v1/delParkChannel',{id:item.id}).then(res=> {
      if (res['ret'] === 'OK') {
        this.removeItem(item);
        this.utils.message.success('COMMON_DEL_SUCCESS');
      }else {
        this.utils.message.error(res['message']);
      }
    }, err => {});
  }

  manualChannelOpening(item){
    this.http.post('app/v1/ManualChannelOpening',{id:item.id}).then(res=> {
      if (res['ret'] === 'OK') {
      }else{
        this.utils.message.error(res['message']);
      }
    }, err => {});
  }

  removeItem(item){
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i] == item){
        this.items.splice(i, 1);
      }
    }
  }

  showAlert(item) {
    this.http.delConfirm('PARK_CHANNEL_DELMSG').then(() => {
        this.delChannel(item);
    });
  }

  // showGate_Alert(item) {
  //   this.http.delConfirm('PARK_CHANNEL_EXEMSG').then(() => {
  //        this.manualChannelOpening(item);
  //   });
  // }

  showDetail(item) {
    this.id=item.id;
    this.navCtrl.push(ParkChannelDetailPage, this);
  }

  add(){
    this.id='';
    this.navCtrl.push(ParkChannelDetailPage, this);
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
    } else {
      params = pager(params);
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkChannel', params, hideLoad).then(res => {
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
    this.utils.beforeRefresh('page-parkChannel');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkChannel');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkChannel');
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

  refresh(){
    this.query(null,true).then(res => {}, err => {});
  }

}
