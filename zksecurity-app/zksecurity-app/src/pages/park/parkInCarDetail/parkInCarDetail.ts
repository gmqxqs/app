// 停车场-- 车辆详情
import { Component } from '@angular/core';
import { /**Platform,**/NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";

@Component({
	selector: 'page-parkInCarDetail',
	templateUrl: 'parkInCarDetail.html'
})

export class ParkInCarDetailPage {
	car:any;
  serverUrl: string = '';


  // goBack(){
  //   if(this.platform.is('ios')) {
  //       this.navCtrl.pop();
  //   }
  // }
  
	constructor(public navCtrl: NavController, public http: HttpService, public navParams: NavParams,/**private platform: Platform**/) {
    this.serverUrl = this.http.url;
		this.car = this.navParams.data;
    switch (this.car.channelState) {
      case 1:
        this.car.channelState = 'PARK_AREA_IN'; //大车场区域入口
        break;
      case 2:
        this.car.channelState = 'PARK_AREA_OUT'; //大车场区域出口
        break;
      case 3:
        this.car.channelState = 'PARK_AREA_SIN'; //小车场区域入口
        break;
      case 4:
        this.car.channelState = 'PARK_AREA_SOUT'; //小车场区域出口
        break;
      case 5:
        this.car.channelState = 'PARK_CHARGE_CENTER'; //中央缴费定点
        break;
      case 6:
        this.car.channelState = 'PARK_CHARGE_CENTEROUT'; //中央缴费出口
        break;
    }
    switch (this.car.eventType) {
      case 1:
        this.car.eventType='PARK_EVENT_NORMAL'; //一般记录
        break;
      case 2:
        this.car.eventType='PARK_EVENT_FIXTO'; //固定车转临时车
        break;
      case 3:
        this.car.eventType='PARK_EVENT_LOSTCARD'; //遗失卡出场
        break;
      case 4:
        this.car.eventType='PARK_EVENT_TIMEOUT'; //超时收费
        break;
      case 5:
        this.car.eventType='PARK_EVENT_OPENREC'; //人工开闸记录
        break;
      case 6:
        this.car.eventType='PARK_EVENT_CANCEL'; //取消开闸
        break;
      case 7:
        this.car.eventType='PARK_EVENT_FIXCH'; //固定车收费
        break;
      case 8:
        this.car.eventType='PARK_EVENT_VISCAR'; //访客贵宾车
        break;
      case 9:
        this.car.eventType='PARK_EVENT_CARDNUM'; //车牌校正
        break;
    }
	}
  goBack() {
    this.navCtrl.pop();
  }
  removeSpace(s) {
    if(s) {
      s = s.replace(/[\r\n]/g,"");
    }
    return s;
  }

}
