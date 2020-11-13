// 停车场-- 新增临时车授权
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { Utils } from "../../../providers/utils";
import { pager } from "../../../providers/constants";

@Component({
  selector: 'page-parkTemporaryAdd',
  templateUrl: 'parkTemporaryAdd.html'
})

export class ParkTemporaryAddPage {

  myParam: string = '';
  items: any;
  item: any;
  contactsCallback: any;
  val:any;
  params:any;

  getItems(ev: any) {
    this.initializeItems();
  }


  swipeGoBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService, public utils: Utils,private platform: Platform) {
    this.contactsCallback = navParams.get("contactsCallback");
    this.initializeItems();
  }

  initializeItems() {
    this.query({parkEntranceAreaName:''}, true).then(resp => {}, err => {});
  }

  check(item) {
    if (item.selected) {
      item.selected = false;
    } else {
      item.selected = true;
    }
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({parkEntranceAreaName :this.val}),true);
  }

  save(items) {
    let parkEntranceAreaId: string = '';
    for (let item of items) {
      if (item.selected) {
        parkEntranceAreaId += item.parkEntranceAreaId + ",";
      }
    }
    parkEntranceAreaId = parkEntranceAreaId.substring(0, parkEntranceAreaId.length - 1);
    this.http.post('app/v1/editTempCarLience',{entranceAreaId:parkEntranceAreaId}).then(resp=>{
      if (resp['ret'] === 'OK') {
        this.utils.message.success(resp['data'],500);
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
          this.navParams.data.refresh();
          this.navCtrl.pop();
        })
      } else{
        this.utils.message.error('COMMON_OP_FAILED');
      }
    }, resp=>{
      this.utils.message.error('COMMON_OP_FAILED');
    });
  }

  goBack() {
    this.navCtrl.pop();
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
      params = pager({});
    }
    console.log(params);
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkEntranceArea', params, hideLoad).then(res => {
        console.log(res);
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
    this.utils.beforeRefresh('page-parkTemporaryAdd');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkTemporaryAdd');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkTemporaryAdd');
    });
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    if(this.val){
      this.params = pager({parkEntranceAreaName:this.val}, this.items.length);
    }else {
      this.params = pager({}, this.items.length);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        this.query(this.params,true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }
}
