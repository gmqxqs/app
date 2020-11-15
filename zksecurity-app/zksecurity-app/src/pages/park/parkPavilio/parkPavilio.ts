// 停车场-- 岗亭
import { Component } from '@angular/core';
import { Platform,NavController } from 'ionic-angular';
import { ParkPavilioDetailPage } from "../parkPavilioDetail/parkPavilioDetail";
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from "../../../providers/utils";

@Component({
	selector: 'page-parkPavilio',
	templateUrl: 'parkPavilio.html'
})

export class ParkPavilioPage {

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
    this.query(null, true).then(res => {}, err => {});
  }

  removeItem(item){
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i] == item){
        this.items.splice(i, 1);
      }
    }
  }

  delPavilio(item){
    this.http.post('app/v1/delParkPavilio',{id:item.id}).then(res=> {
      if (res['ret'] === 'OK') {
        this.removeItem(item);
      }else{
        this.utils.message.error(res['message'] || 'COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
      }
    }, err => {
      this.utils.message.error('COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
    });
  }

  showAlert(item) {
    this.http.delConfirm('PARK_PAVILIO_DELMSG').then(() => {
        this.delPavilio(item);
    });
  }

  showDetail(item) {
    this.id=item.id;
    this.navCtrl.push(ParkPavilioDetailPage,this);
  }

  refresh(){
    this.query(null,true);
  }

  add(){
    this.id='';
    this.navCtrl.push(ParkPavilioDetailPage,this);
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
    }else {
      params = pager(params);
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkPavilio', params, hideLoad).then(res => {
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
    this.utils.beforeRefresh('page-parkPavilio');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkPavilio');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkPavilio');
    });
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
}
