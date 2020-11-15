
import { Component } from '@angular/core';
import { Platform,ViewController, NavController, ModalController, NavParams } from 'ionic-angular';
import { ParkCardNumAddPage } from "../parkCardNumAdd/parkCardNumAdd";
import { ParkTemporaryAddPage } from "../parkTemporaryAdd/parkTemporaryAdd";
import { HttpService } from "../../../providers/http-service";
import { Utils } from "../../../providers/utils";

@Component({
  templateUrl: 'popoverPage.html',
  selector: 'page-popoverPage',
})

export class PopoverPage {


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController,public viewCtrl: ViewController,public modalCtrl: ModalController,public http: HttpService, 
    public navParams: NavParams, public utils: Utils,private platform: Platform) {
  }

  addFixClose() {
    this.viewCtrl.dismiss();
    this.http.post('app/v1/isModelExist', {}).then(res => {
      if (res['ret'] === 'OK') {
        this.navCtrl.push(ParkCardNumAddPage, this.navParams.data);
      }else if(res['ret'] === '400'){
        this.utils.message.error(res['message']);
      }
    }, err => {});
  }

  addTemporayClose() {
    this.viewCtrl.dismiss();
    this.http.post('app/v1/isModelExist', {}).then(res => {
      if (res['ret'] === 'OK') {
        this.http.post('app/v1/isTempCarExist', {}).then(res => {
          if (res['ret'] === 'OK') {
            this.navCtrl.push(ParkTemporaryAddPage, this.navParams.data);
          }else{
            this.utils.message.error(res['message']);
          }
        }, err => {});
      }else if(res['ret'] === '400'){
        this.utils.message.error(res['message']);
      }
    }, err => {});

  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, null, { cssClass: 'inset-modal' }).present();
  }
}
