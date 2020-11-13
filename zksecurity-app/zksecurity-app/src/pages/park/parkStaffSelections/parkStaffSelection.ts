/**
 * Created by DELL on 2017/8/1.
 */
// 停车场-- 人员选择
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from "../../../providers/utils";

@Component({
  selector: 'page-parkStaffSelection',
  templateUrl: 'parkStaffSelection.html'
})

export class ParkStaffSelectionPage {

  val:any;
  myParam: string = '';
  items: any;
  item:any;
  contactsCallback: any;
  params:any;

  getItems(ev: any) {
    this.initializeItems();
  }


  // goBack(){
  //   if(this.platform.is('ios')) {
  //       this.navCtrl.pop();
  //   }
  // }

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: HttpService,  public utils: Utils/**,private platform: Platform**/) {
    this.contactsCallback = navParams.get("contactsCallback");
    this.initializeItems();
  }

  initializeItems(){
    this.query({name:''}, true).then(res => {}, err => {});
  }

  finish(){
    for(let i=0;i<this.items.length;i++){
      if(this.items[i].personPin==this.myParam){
        this.item=this.items[i];
      }
    }
    this.http.post('app/v1/getCarNumberByPersonPin', {personPin:this.item.personPin}).then((resp: { data?: any }) => {
      if (resp['ret'] === 'OK') {
        this.contactsCallback(this.item).then((result)=> {
          this.navCtrl.pop();
        },(err)=>{})
      }else{
        this.utils.message.error(resp['message']);
      }
    }, resp => {});
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({name:this.val}),true).then(res => {}, err => {});
  }

  /**
   * 查询人员
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
      this.http.post('app/v1/getParkPerson', params, hideLoad).then(res => {
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
    this.utils.beforeRefresh('page-parkStaffSelection');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkStaffSelection');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkStaffSelection');
    });
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    if(this.val){
      this.params = pager({name:this.val}, this.items.length);
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
