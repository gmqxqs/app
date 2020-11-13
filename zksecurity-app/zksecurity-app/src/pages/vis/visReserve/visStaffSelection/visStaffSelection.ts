// 访客模块--预约-人员选择
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../providers/http-service";
import { pager } from "../../../../providers/constants";
import { Utils } from "../../../../providers/utils";

@Component({
  selector: 'page-visStaffSelection',
  templateUrl: 'visStaffSelection.html'
})

export class VisStaffSelectionPage {

  // 需要返回的数据
  rBean: any;
  // item 数据源
  items: any;
  // 返回
  callback: any;

  val: any;

  params:any;


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
      }
  }
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public utils:Utils,
              public http: HttpService,private platform: Platform) {
    this.initData();
  }

  private initData() {
    this.callback = this.navParams.get("vSSBack");
    this.query(null, true);
  }

  /**
   * 查询人员
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if (!params) {
      params = pager({});
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getPersonByPinOrName',
        params, hideLoad
      ).then(res => {
        if (res['ret'] === 'OK') {
          if(!resolve(res) && res['data']) {
            if(append) {
              this.items = this.items.concat(res['data']['rows']);
            } else {
              this.items = res['data']['rows'];
            }
          }
        } else {
          console.log(res['message']);
        }
      }, err => {
        reject(err)
      });
    });
  }

  /**
   * 选中时设置数据
   * @param item
   */
  selData(item: any) {
    this.rBean = item;
  }

  /**
   * 下拉刷新数据
   * @param  {any} event
   * @return {void}
   */
  doRefresh(event) {
    this.utils.beforeRefresh('page-visStaffSelection');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-visStaffSelection');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-visStaffSelection');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.query(pager({}, this.items.length), true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({filter: this.val}), true).then(res => {}, err => {});
  }

  finish() {
    this.callback(this.rBean).then((result) => {
      this.navCtrl.pop();
    }, (err) => {
      console.error(err);
    })
  }

}
