// 停车场-- 未匹配处理方式
import {Component} from '@angular/core';
import {Platform,NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../providers/http-service";
import {Utils} from "../../../providers/utils";

@Component({
  selector: 'page-parkCarSetTreatment',
  templateUrl: 'parkCarSetTreatment.html'
})

export class ParkCarSetTreatmentPage {
  myParam: any={};
  treatmentCallback: any;
  params: any;
  msg: any;
  car = {
    carKey: '',
    carValue: '',
  };
  freeGo: any;
  changeGo: any;
  change: any;
  items = [
    {text: 'PARK_FREE_GO', value: "free", check: this.freeGo},
    {text: 'PARK_CHANGE_GO', value: "charge", check: this.changeGo}
  ];

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
      }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService, public utils: Utils,private platform: Platform) {
    this.treatmentCallback = navParams.get("treatmentCallback");
    this.myParam = navParams.get("treatment");
    if (this.myParam.carKey) {
      this.car.carKey=this.myParam.carKey;
      this.car.carValue=this.myParam.carValue;
      switch (this.myParam.carKey) {
        case 'free':
          this.freeGo = "1";
          this.changeGo = "0";
          break;
        case 'charge':
          this.freeGo = "0";
          this.changeGo = "1";
          this.change=this.myParam.carValue;
          break;
      }
      this.initializeItems();
    }
    this.utils.translate.get(['PARK_CAR_SET_MSG5', 'PARK_CAR_SET_MSG6','PARK_CHANGE_FORMAT']).subscribe(vals => {
      this.msg = vals;
    })
  }


  initializeItems() {
    this.items = [
      {text: 'PARK_FREE_GO', value: "free", check: this.freeGo},
      {text: 'PARK_CHANGE_GO', value: "charge", check: this.changeGo}
    ];
  }

  getItems(item) {
    if (item.text === 'PARK_FREE_GO') {
      this.freeGo = "1";
      this.changeGo = "0";
      this.car.carKey = item.value;
    } else {
      this.freeGo = "0";
      this.changeGo = "1";
      this.car.carKey = item.value;
    }
    this.initializeItems();
  }

  save() {
    if (this.car.carKey == "free") {
      this.car.carValue = '0';
    } else {
      this.car.carValue = this.change;
    }
    if (this.checkData()) {
      this.treatmentCallback(this.car).then((result) => {
        this.navCtrl.pop();
      }, (err) => {
      })
    }
  }

  checkData(): boolean {
    // 信息验证
    if (this.car.carKey == "charge") {
      if (!this.car.carValue) {
        this.utils.message.error('PARK_CAR_SET_MSG5');
        return false;
      }
      var re = /^[0-9]*$/;
      if (!re.test(this.car.carValue)) {
        this.utils.message.error('PARK_CHANGE_FORMAT');
        this.car.carValue = "";
        return false;
      }
    }
    return true;
  }
}
