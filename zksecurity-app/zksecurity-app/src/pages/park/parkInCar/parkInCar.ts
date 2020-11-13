// 停车场-- 场内车辆
import { Component, ViewChild } from '@angular/core';
import { Platform,ModalController, NavController, Content } from 'ionic-angular';
import { ParkInCarDetailPage } from '../parkInCarDetail/parkInCarDetail';
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from '../../../providers/utils';
import { ParkTimeSeletionsPage } from "../parkTimeSeletionsModal/parkTimeSeletionsModal";

@Component({
	selector: 'page-parkInCar',
	templateUrl: 'parkInCar.html'
})

export class ParkInCarPage {
  name:String='ParkInCarPage';
	items: any;
  val:any;
  params:any;
  startTime:any='';
  endTime:any='';
  serverUrl: string = '';
  isLast:boolean;

  tempItems:Array<Array<any>> = [];

  @ViewChild(Content) myContent:Content;
  
  resetContent() {
    this.myContent.scrollToTop(100);
  }

  showDetail(item){
    this.http.post('app/v1/getParkRecordinById',{id:item.id}).then((resp:{data?:any})=>{
      if(resp.data) {
        this.navCtrl.push(ParkInCarDetailPage,resp.data);
      }
    }, resp => {});
  }

  putTempItems(_items:Array<any>, reset?:boolean) {
    if(reset) {
      this.tempItems = [];
    }
    if(_items) {
      _items.forEach(item => {
        if(this.tempItems.length === 0 || this.tempItems[this.tempItems.length-1].length === 2) {
          this.tempItems.push([]);
        }
        this.tempItems[this.tempItems.length-1].push(item);
      });
    }
  }

  removeSpace(s) {
    if(s) {
      s = s.replace(/[\r\n]/g,"");
    }
    return s;
  }

  initializeItems(){
    this.query(null).then(rep => {}, err=>{});
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

	constructor(public navCtrl: NavController, public http: HttpService, public utils:Utils, public modalCtrl: ModalController,private platform: Platform) {
		this.serverUrl = this.http.url;
    this.initializeItems();
	}
  
  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({carNumber:this.val, pageSize:10}),true);
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
      params = pager({carNumber:'',startTime:'',endTime:'', pageSize:10});
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkRecordin', params, hideLoad).then(res => {
        if(res['ret'] === 'OK') {
          if(!resolve(res) && res['data']) {
            if(append) {
              this.items = this.items.concat(res['data']['rows']);
              this.putTempItems(res['data']['rows']);
            } else {
              this.items = res['data']['rows'];
              this.putTempItems(res['data']['rows'], true);
            }
            if(res['data']['rows'].length < params.pageSize) {
                this.isLast = true;
            }
          }
        } else {}
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
    this.utils.beforeRefresh('page-parkInCar');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkInCar');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkInCar');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    this.isLast = false;
    if(this.val){
      this.params = pager({carNumber:this.val, pageSize:10}, this.items.length);
    }else if(this.startTime&&this.endTime){
      this.params = pager({carNumber:'',pageSize:10, startTime:this.startTime,endTime:this.endTime}, this.items.length);
    }else{
      this.params = pager({pageSize:10}, this.items.length);
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

  timeSeletions(){
    this.openModal(ParkTimeSeletionsPage);
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, this, { cssClass: 'inset-modal1',enableBackdropDismiss:true})
      .present();
  }

}
