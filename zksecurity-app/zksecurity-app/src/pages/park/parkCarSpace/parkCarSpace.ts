// 停车场-- 车位号选择
import {Component} from '@angular/core';
import {Platform,NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../providers/http-service";
import {pager} from "../../../providers/constants";
import {Utils} from "../../../providers/utils";

@Component({
  selector: 'page-parkCarSpace',
  templateUrl: 'parkCarSpace.html'
})

export class ParkCarSpacePage {

  val: any;
  myParam: string = '';
  items: any;
  item: any;
  spaceCallback: any;
  params: any;
  id:any;

  getItems(ev: any) {
    this.initializeItems();
  }

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService, public utils: Utils,private platform: Platform) {
    this.spaceCallback = navParams.get("spaceCallback");
    this.id = navParams.get("id");
    if(!this.id){
      this.id="";
    }
    this.initializeItems();
  }

  initializeItems() {
    this.query({condition: '',id:this.id}, true).then(res => {
    }, err => {
    });
  }

  finish() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].parkSpaceId == this.myParam) {
        this.item = this.items[i];
      }
    }
    this.spaceCallback(this.item).then((result) => {
      this.navCtrl.pop();
    }, (err) => {
    })

  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({condition: this.val}), true).then(res => {
    }, err => {
    });
  }

  /**
   * 查询车位号
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if (!params) {
      params = pager({id:this.id});
    } else {
      params = pager(params);
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkParkingSpace', params, hideLoad).then(res => {
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
    this.utils.beforeRefresh('page-parkCarSpace');
    this.query(null, true).then(res => {
      event.complete();
      this.utils.afterRefresh('page-parkCarSpace');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkCarSpace');
    });
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    if (this.val) {
      this.params = pager({condition: this.val,id:this.id}, this.items.length);
    } else {
      this.params = pager({id:this.id}, this.items.length);
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
