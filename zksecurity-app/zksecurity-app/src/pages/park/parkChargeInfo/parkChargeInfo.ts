// 停车场-- 收费详情
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-parkChargeInfo',
	templateUrl: 'parkChargeInfo.html'
})

export class ParkChargeInfoPage {
	
  car: any;

  getPaymentMethod(m:number) {
    switch (m) {
      case 1:
        return 'PARK_PAYMETHOD_MONEY';
      case 2:
        return 'PARK_PAYMETHOD_CARD';
      case 3:
        return 'COMMON_OTHER';
    }
    return m;
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

	constructor(public navCtrl: NavController, public navParams: NavParams,private platform: Platform) {
    this.car = this.navParams.data;
  }

}
