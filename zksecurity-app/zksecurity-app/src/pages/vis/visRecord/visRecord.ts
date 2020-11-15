// 访客-- 访客历史记录
import { Component, ViewChild } from '@angular/core';
import { Platform,NavController, Content } from 'ionic-angular';
import { VisRecordDetailPage } from "./visRecordDetail/visRecordDetail";
import { SelectHistory } from "./selectHistory/selectHistory";
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from '../../../providers/utils';

@Component({
  selector: 'page-visRecord',
  templateUrl: 'visRecord.html'
})

export class VisRecordPage {

  items: any;
  filters:any='';
  startTime:any='';
  endTime:any='';
  isLast:boolean;
  lang:string = 'zh';
  @ViewChild(Content) myContent:Content;

  criteriaCore:string='';

  resetContent() {
    this.myContent.scrollToTop(100);
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
    this.utils.beforeRefresh('page-visRecord');
    this.query(null, true).then(res=>{
      setTimeout(() => {
        event.complete();
        this.utils.afterRefresh('page-visRecord');
      }, 2000);

    }, err => {
      setTimeout(() => {
        event.complete();
        this.utils.afterRefresh('page-visRecord');
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
   * 获取访客历史记录
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
      this.http.post('app/v1/getVisTransactionByFilters', params, hideLoad
      ).then(res => {
        if (res['ret'] === 'OK') {
          console.log(res);
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
          this.utils.message.error(res['message'] || res['ret']);
        }
      }, err => {
        //console.log("getVisReservationByIsVisited---err");
      });
    });
  }

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public utils:Utils, public http: HttpService,private platform: Platform) {
    this.query(null, true).then(res => {}, err => {});
    this.lang = this.utils.translate.currentLang;
  }

  refreshSelectByTime(filters, startTime, endTime) {
    this.query({filters: filters, startTime: startTime, endTime: endTime}, true).then(res => {
      this.resetContent();
    }, err => {});
  }

  refreshSelect(filters) {
    this.query({filters: filters}, true).then(res => {
      this.resetContent();
    }, err => {});
  }

  refreshReserve() {
    this.query(null, true).then(res => {
      this.resetContent();
    }, err => {});
  }
  select() {
    this.navCtrl.push(SelectHistory, this)
  }

  showDetail(item) {
    this.navCtrl.push(VisRecordDetailPage, item);
  }

}
