/**
 * Created by DELL on 2017/8/1.
 */
// 停车场-- 进出口区域
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from "../../../providers/utils";

class Bean {
  parkEntranceAreaId;
  parkEntranceAreaName;
  check: boolean;
}

@Component({
  selector: 'page-parkEntranceArea',
  templateUrl: 'parkEntranceArea.html'
})

export class ParkEntranceAreaPage {

  myParam: string = '';
  items: Array<Bean>;
  item: any;
  contactsCallback: any;

  areaName: Array<String>;

  car = {
    carKey: '',
    carValue: '',
  };
  val: any;
  params: any;
  parkSpaceId:any;


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }


  constructor(public navCtrl: NavController, public utils:Utils, public navParams: NavParams, public http: HttpService,private platform: Platform) {

    this.contactsCallback = navParams.get("contactsCallback");
    if (navParams.get("entranceAreaName")) {
      this.areaName = navParams.get("entranceAreaName").split(',');
    }
    if (navParams.get("parkSpaceId")) {
      this.parkSpaceId = navParams.get("parkSpaceId");
    }
    this.initializeItems();
  }

  initializeItems() {
    this.http.post('app/v1/getParkEntranceArea', {
      parkEntranceAreaName: '',
      parkSpaceId:this.parkSpaceId,
      pageNo: 1,
      pageSize: 10
    }).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data.rows;
        if (this.items) {
          for (let bean of this.items) {
            if (this.areaName) {
              for (let an of this.areaName) {
                if (bean.parkEntranceAreaName == an) {
                  bean.check = true;
                  break;
                } else {
                  bean.check = false;
                }
              }
            } else {
              bean.check = false;
            }
          }
        }
      }
    }, resp => {});
  }

  checks(item) {
    if (item.check) {
      item.check = false;
    } else {
      item.check = true;
    }
  }

  save(items) {
    let parkEntranceAreaId: string = '';
    let parkEntranceAreaName: string = '';
    for (let item of items) {
      if (item.check) {
        parkEntranceAreaId += item.parkEntranceAreaId + ",";
        parkEntranceAreaName += item.parkEntranceAreaName + ",";
      }
    }
    parkEntranceAreaId = parkEntranceAreaId.substring(0, parkEntranceAreaId.length - 1);
    parkEntranceAreaName = parkEntranceAreaName.substring(0, parkEntranceAreaName.length - 1);
    this.car.carKey = parkEntranceAreaId;
    this.car.carValue = parkEntranceAreaName;
    this.contactsCallback(this.car).then((result) => {
      this.navCtrl.pop();
    }, (err) => {})
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({parkEntranceAreaName: this.val}), true).then(resp => {}, err => {});
  }

  /**
   * 查询进出口区域
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if (!params) {
      params = pager({});
    }
    params.parkSpaceId = this.parkSpaceId;
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkEntranceArea', params, hideLoad).then(res => {
        if (res['ret'] === 'OK') {
          if (!resolve(res) && res['data']) {
            if (append) {
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
    this.utils.beforeRefresh('page-parkEntranceArea');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkEntranceArea');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkEntranceArea');
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
}
