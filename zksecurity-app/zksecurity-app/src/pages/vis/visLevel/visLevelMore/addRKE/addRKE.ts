// 权限组管理--添加门禁权限组
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../../providers/http-service";
import { Utils } from "../../../../../providers/utils";
import { pager } from "../../../../../providers/constants";

@Component({
  selector: 'page-addRKE',
  templateUrl: 'addRKE.html'
})

export class AddRKE {

  items: any;
  params: any;
  val: any;

  swipeGoBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpService,
              public utils: Utils,private platform: Platform) {
    this.query();
  }

  // private getRKE() {
  //   this.http.post('app/v1/loadAccLevel', {}).then(res => {
  //     if (res['ret'] === 'OK') {
  //       this.visAuthItem = res['data'];
  //     }
  //   }, err => {});
  // }

  check(item) {
    if (item.selected) {
      item.selected = false;
    } else {
      item.selected = true;
    }
  }

  save(items) {
    let accLevelId: string = '';
    let accLevelName: string = '';
    for (let item of items) {
      if (item.selected) {
        accLevelId += item.accLevelId + ",";
        accLevelName += item.accLevelName + ",";
      }
    }
    accLevelId = accLevelId.substring(0, accLevelId.length - 1);
    accLevelName = accLevelName.substring(0, accLevelName.length - 1);
    this.postAddRKE(accLevelId, accLevelName);
  }

  postAddRKE(accLevelId, accLevelName) {
    // levelIds: 权限组id,可传入多个，之间用逗号隔开。
    // levelNames: 权限组名称,可传入多个，之间用逗号隔开；一个权限组id对应一个权限组名称。
    this.http.post('app/v1/addAccLevel', {levelIds: accLevelId, levelNames: accLevelName}).then(res => {
      if (res['ret'] === 'OK') {
        this.navParams.data.refreshLevel();
        this.navCtrl.pop();
      }
    }, err => {});
  }

  goBack() {
    this.navCtrl.pop();
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({levelName: this.val}), true).then(res => {
    }, err => {});
  }

  /**
   * 查询门禁
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if (!params) {
      params = pager({levelName: ''});
    } else {
      params = pager(params);
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/loadAccLevel', params, hideLoad).then(res => {
        if (res['ret'] === 'OK') {
          if (!resolve(res) && res['data']) {
            if (append) {
              this.items = this.items.concat(res['data']);
            } else {
              this.items = res['data'];
            }
          }
        } else {
          reject(res);
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
    this.val = '';
    this.utils.beforeRefresh('page-addRKE');
    this.query(null, true).then(res => {
        event.complete();
        this.utils.afterRefresh('page-addRKE');
    }, err => {
        event.complete();
        this.utils.afterRefresh('page-addRKE');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    if (this.val) {
      this.params = pager({name: this.val}, this.items.length);
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
