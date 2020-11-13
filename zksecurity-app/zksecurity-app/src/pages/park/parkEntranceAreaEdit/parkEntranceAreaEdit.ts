/**
 * Created by DELL on 2017/8/1.
 */
// 停车场-- 人员选择
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from "../../../providers/utils";

@Component({
  selector: 'page-parkEntranceAreaEdit',
  templateUrl: 'parkEntranceAreaEdit.html'
})

export class ParkEntranceAreaEditPage {
  
  myParam: string = '';
  items: any;
  item: any;
  contactsCallback: any;
  parkEntranceAreaId:any;
  parkParkingAreaType: any;
  car = {
    carKey: '',
    carValue: '',
  };
  val: any;
  params: any;

  getItems(ev: any) {
    this.initializeItems();
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public utils:Utils, public navParams: NavParams, public http: HttpService,private platform: Platform) {
    this.parkEntranceAreaId= navParams.get("parkEntranceAreaId");
    this.contactsCallback = navParams.get("contactsCallback");
    this.parkParkingAreaType = navParams.get("parkParkingAreaType");
    this.myParam = navParams.get("parkEntranceAreaName");
    this.initializeItems();
  }

  initializeItems() {
    this.http.post('app/v1/getParkEntranceArea', {parkParkingAreaType:this.parkParkingAreaType}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data.rows;
      }
    }, resp => {});
  }

  finish(){
    for(let i=0;i<this.items.length;i++){
      if(this.items[i].parkEntranceAreaName==this.myParam){
        this.item=this.items[i];
      }
    }
    this.contactsCallback(this.item).then((result)=> {
      this.navCtrl.pop();
    },(err)=>{})
  }

  /**
   * 查询进出口区域
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if(!params) {
      params = pager({parkParkingAreaType:this.parkParkingAreaType});
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkEntranceArea', params, hideLoad).then(res => {
        if(res['ret'] === 'OK') {
          if(!resolve(res) && res['data']) {
            if(append) {
              this.items = this.items.concat(res['data']['rows']);
            } else {
              this.items = res['data']['rows'];
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
    this.utils.beforeRefresh('page-parkEntranceAreaEdit');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkEntranceAreaEdit');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkEntranceAreaEdit');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    if (this.val) {
      this.params = pager({parkEntranceAreaName: this.val}, this.items.length);
    } else {
      this.params = pager({}, this.items.length);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        this.query(this.params, true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({parkEntranceAreaName: this.val}), true).then(resp => {}, err => {});
  }
}
