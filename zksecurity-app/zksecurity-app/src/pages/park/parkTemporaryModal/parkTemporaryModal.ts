/**
 * Created by DELL on 2017/8/10.
 */
// 停车场-- 弹出三级Modal
import { Component } from '@angular/core';
import { Platform,NavParams, NavController,ViewController, ModalController } from 'ionic-angular';
import { ParkTemporaryModalTreePage } from "../parkTemporaryTreeModal/parkTemporaryTreeModal";

@Component({
  selector: 'page-parkTemporaryModal',
  templateUrl: 'parkTemporaryModal.html'
})

//已弃用
export class ParkTemporaryModalPage {
  
  items:Array<any>;
  data= {
    isFirst: false,
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor( public navCtrl: NavController,public viewCtrl: ViewController, params: NavParams,public modalCtrl: ModalController,private platform: Platform) {
    this.initializeItems();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  initializeItems() {
    this.items = [{
      id: 1,
      text: '软件园三期',
      children: [{
        id: 2,
        text: 'A区',
        children: [{
          id: 4,
          text: '北门'
        },{
          id:5,
          text: '南门'
        }]
      }, {
        id: 3,
        text: 'B区',
        children: [{
          id: 6,
          text: '北门'
        },{
          id:7,
          text: '南门'
        }]
      }]
    }]
  }

  show(){
    this.openModal(ParkTemporaryModalTreePage)
  }

  openModal(pageName) {
    this.modalCtrl.create(pageName, null, { cssClass: 'inset-modal1' })
      .present();
  }
}
