// 访客-- 预约管理
import { Component, ViewChild } from '@angular/core';
import { Platform,AlertController, NavController, Content } from 'ionic-angular';
import { SelectPage } from "./select/select";
import { HttpService } from "../../../providers/http-service";
import { MgrReservePage } from "./mgrReserve/mgrReserve";
import { pager } from "../../../providers/constants";
import { MgrNoReservePage } from "./mgrNoReserve/mgrNoReserve";
import { Utils } from '../../../providers/utils';

@Component({
  selector: 'page-visReserveMgr',
  templateUrl: 'visReserveMgr.html'
})

export class VisReserveMgrPage {
  items: any;
  filters:any='';
  startTime:any='';
  endTime:any='';
  isLast:boolean;

  @ViewChild(Content) myContent:Content;

  resetContent() {
    this.myContent.scrollToTop(100);
  }

  select() {
    this.navCtrl.push(SelectPage, this);
  }

  edit(item) {
    if (item.isVisited == 1) {
      this.navCtrl.push(MgrReservePage, {
        item: item, items: this
      });
    } else {
      this.navCtrl.push(MgrNoReservePage, item);
    }
  }


  showAlert(item) {
    this.http.delConfirm('VIS_RESERVE_MSG1').then(() => {
        this.delFixDelay(item);
    });
  }

  delFixDelay(item) {
    this.http.post('app/v1/delReservationByIds', {id: item.id}).then(res => {
      if (res['ret'] === 'OK') {
        this.utils.message.success(res['message'] || 'COMMON_DEL_SUCCESS', 2000);
        this.removeItem(item);
      } else {
        this.utils.message.error(res['message'] || res['ret'] || 'COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
      }
    }, err => {
      this.utils.message.error('COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
    });
  }

  removeItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] == item) {
        this.items.splice(i, 1);
      }
    }
  }

  /**
   * 下拉刷新数据
   * @param  {any} event
   * @return {void}
   */
  doRefresh(event) {
    this.filters = '';
    this.startTime='';
    this.endTime='';
    this.utils.beforeRefresh('page-visReserveMgr');
    this.query(null, true).then(res=>{
      setTimeout(() => {
        event.complete();
        this.utils.afterRefresh('page-visReserveMgr');
      }, 2000);

    }, err => {
      setTimeout(() => {
        event.complete();
        this.utils.afterRefresh('page-visReserveMgr');
      }, 2000);
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
        this.query(pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime}, this.items.length),true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }

  /**
   * 预约组管理列表
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if(!params) {
      params = pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime});
    } else {
      params = Object.assign(pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime}), params);
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getVisReservationByFilters', params, hideLoad).then(res => {
        if (res['ret'] === 'OK') {
          if (!resolve(res) && res['data']) {
            if (append) {
              this.items = this.items.concat(res['data']);
            } else {
              this.items = res['data'];
            }
            if(res['data'].length < params.pageSize) {
                this.isLast = true;
            }
          }
        } else {
          console.log(res['data']);
          this.utils.message.error(res['message'] || res['ret']);
        }
      }, err => {
        console.log("getVisReservationByFilters---err");
      });
    });
  }

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  
  constructor(public navCtrl: NavController, public http: HttpService, public alertCtrl: AlertController,public utils: Utils,private platform: Platform) {
    this.query(null, true).then(resp => {}, err => {});
  }

  refreshSelect(filters) {
    this.query({filters: filters}, true).then(resp => {
      this.resetContent();
    }, err => {});
  }

  refreshSelectByTime(filters, startTime, endTime) {
    this.query({filters: filters, startTime: startTime, endTime: endTime}, true).then(resp => {
      this.resetContent();
    }, err => {});
  }

  refreshReserve() {
    this.query(null, true).then(resp => {
      this.resetContent();
    }, err => {});
  }
}
