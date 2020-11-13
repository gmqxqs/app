// 停车场-- 收费明细
import { Component, ViewChild } from '@angular/core';
import { Platform,ModalController, NavController, Content} from 'ionic-angular';
import { ParkChargeInfoPage } from '../parkChargeInfo/parkChargeInfo';
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { ParkTimeSeletionsPage } from "../parkTimeSeletionsModal/parkTimeSeletionsModal";
import { Utils } from '../../../providers/utils';


@Component({
	selector: 'page-parkChargeDetail',
	templateUrl: 'parkChargeDetail.html'
})

export class ParkChargeDetailPage {
	items: any;
  car:any;
  val:any;
  params:any;
  startTime:any='';
  endTime:any='';
  isLast:boolean;

  @ViewChild(Content) myContent:Content;

  resetContent() {
    this.myContent.scrollToTop(100);
  }

	showDetail(item) {
    this.http.post('app/v1/getParkChargeDetailById',{id:item.id}).then((resp:{data?:any})=>{
      if(resp.data) {
        this.navCtrl.push(ParkChargeInfoPage,resp.data);
      }
    }, err => {});
  }

  initializeItems() {
    this.query(null).then(resp => {}, err => {});
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

	constructor(public navCtrl: NavController , public utils:Utils, public http: HttpService,public modalCtrl: ModalController,private platform: Platform) {
		this.initializeItems();
	}

  /**
   * 查询收费
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if(!params) {
      params = pager({carNoOrOperator:'',startTime:'',endTime:''});
    } else {
      params = pager(params);
    }
    this.isLast = false;
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getParkChargeDetail', params, hideLoad).then(res => {
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
        } else {}
      }, err => {
        reject(err);
      })
    });
  }

  search(ev: any) {
    this.val = ev.target.value || '';
    this.query(pager({carNoOrOperator:this.val}),true).then(resp => {}, err => {});
  }

  /**
   * 下拉刷新数据
   * @param  {any} event
   * @return {void}
   */
  doRefresh(event) {
    this.isLast = false;
    this.utils.beforeRefresh('page-parkChargeDetail');
    this.query(null, true).then(res=>{
      event.complete();
      this.utils.afterRefresh('page-parkChargeDetail');
    }, err => {
      event.complete();
      this.utils.afterRefresh('page-parkChargeDetail');
    })
  }

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
  doInfinite(): Promise<any> {
    this.isLast = false;
    if(this.val){
      this.params = pager({carNoOrOperator:this.val}, this.items.length);
    }else if(this.startTime&&this.endTime){
      this.params = pager({carNoOrOperator:'',startTime:this.startTime,endTime:this.endTime}, this.items.length);
    }else{
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

  timeSeletions(){
    this.openModal(ParkTimeSeletionsPage)
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, this, { cssClass: 'inset-modal1' }).present();
  }
}
