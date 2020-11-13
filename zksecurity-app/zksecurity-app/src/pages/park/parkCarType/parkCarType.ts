/**
 * Created by DELL on 2017/8/7.
 */
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";

class Bean {
  carTypeCode;
  carTypeName;
  check: boolean;
}
@Component({
  selector: 'page-parkCarType',
  templateUrl: 'parkCarType.html'
})

export class ParkCarTypePage {
  items: Array<Bean>;
  typeCallback: any;
  car = {
    carKey: '',
    carValue: '',
  };
  typeId;

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService,private platform: Platform) {
    this.typeCallback = navParams.get("typeCallback");
    this.initializeItems();
    if (navParams.get("typeId")) {
      this.typeId = navParams.get("typeId").split(',');
    }
  }

  finish() {
    let carTypeCode: string = '';
    let carTypeName: string = '';
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].check == true) {
        carTypeCode += this.items[i].carTypeCode + ",";
        carTypeName += this.items[i].carTypeName + ",";
      } else {
      }
    }
    carTypeCode = carTypeCode.substring(0, carTypeCode.length - 1);
    carTypeName = carTypeName.substring(0, carTypeName.length - 1);
    this.car.carKey = carTypeCode;
    this.car.carValue = carTypeName;
    this.typeCallback(this.car).then((result) => {
      this.navCtrl.pop();
    }, (err) => {})
  }

  initializeItems() {
    this.http.post('app/v1/getParkCarType', {}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data;
        if (this.items) {
          for (let bean of this.items) {
            if (this.typeId) {
              for (let an of this.typeId) {
                if (bean.carTypeCode == an) {
                  bean.check = true;
                  break;
                } else {
                  bean.check = false;
                }
              }
            } else {
              bean.check = false;
            }
          }
        }
      }
    }, resp => {});
  }
}
