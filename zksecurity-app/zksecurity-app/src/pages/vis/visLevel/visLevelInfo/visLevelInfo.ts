// 权限组管理--权限组详情
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../providers/http-service";
import { pager } from "../../../../providers/constants";
import { Utils } from "../../../../providers/utils";

@Component({
  selector: 'page-visLevelInfo',
  templateUrl: 'visLevelInfo.html'
})

export class VisLevelInfoPage {

  items: any;
  id: any;
  title: any = 'VIS_PERMISSIONINFO';

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController,
              public http: HttpService,
              public utils:Utils,
              public navParams: NavParams,private platform: Platform) {
    this.id = this.navParams.data.visLevelId;
    this.title = this.navParams.data.visLevelModule=='ele' ? 'VIS_PERMISSIONINFO1':'VIS_PERMISSIONINFO';
    this.initData();
  }

  private initData() {
    this.query({levelId: this.id}, true).then(res => {}, err => {});
  }

  /**
   * 权限组详情列表
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
      this.http.post('app/v1/getLevelPersonByFilter', params, hideLoad
      ).then(res => {
        if (res['ret'] === 'OK') {
          if (!resolve(res) && res['data']) {
            if (append) {
              this.items = this.items.concat(res['data']);
            } else {
              this.items = res['data'];
            }
          }
        } else {
          // this.utils.message.error(res['message'] || res['ret']);
        }
      }, err => {});
    });
  }


  /**
   * 查询数据
   * @param  {Event} ev: any           [事件对象]
   * @return {void}
   */
  val: any;

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({filter: this.val, levelId: this.id}), true).then(rep => {}, err => {});
  }

  /**
   * 下拉刷新数据
   * @param  {any} event
   * @return {void}
   */
  doRefresh(event) {
    this.utils.beforeRefresh('page-visLevelInfo');
    this.query({levelId: this.id}, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-visLevelInfo');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-visLevelInfo');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.query(pager({levelId: this.id}, this.items.length), true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }

}
