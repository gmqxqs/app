import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";

@Component({
  selector: 'page-parkDefaultPlate',
  templateUrl: 'parkDefaultPlate.html'
})

export class ParkDefaultPlatePage {
  
  myParam: string = '';
  items: any;
  contactsCallback: any;

  getItems(ev: any) {
    this.initializeItems();
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService,private platform: Platform) {
    this.contactsCallback = navParams.get("plateCallback");
    this.myParam = navParams.get("myplate");
    this.initializeItems();
  }

  initializeItems(){
    this.http.post('app/v1/getParkCarLicensePlate', {}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data;
      }
    }, resp => {});
  }

  finish(){
    this.contactsCallback(this.myParam).then((result)=> {
      this.navCtrl.pop();
    },(err)=>{})
  }
}
