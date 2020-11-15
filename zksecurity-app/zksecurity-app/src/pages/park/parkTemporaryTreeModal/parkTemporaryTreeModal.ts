/**
 * Created by DELL on 2017/8/10.
 */
// 停车场-- 弹出三级ModalTree
import { Component } from '@angular/core';
import { /**Platform,**/NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-parkTemporaryTreeModal',
  templateUrl: 'parkTemporaryTreeModal.html'
})
export class ParkTemporaryModalTreePage {
  items:Array<any>;


 /** goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }**/

  constructor( public viewCtrl: ViewController, params: NavParams/**,private platform: Platform**/) {
    this.initializeItems();
  }

  checkedClick(args:Array<any>) {
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
}
