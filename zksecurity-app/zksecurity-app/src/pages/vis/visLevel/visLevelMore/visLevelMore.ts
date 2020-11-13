//<!--权限组管理-----更多页面----->
import {Component} from '@angular/core'
import {Platform,ViewController, NavController,NavParams} from 'ionic-angular'
import {AddRKE} from "./addRKE/addRKE";
import {AddLadder} from "./addLadder/addLadder";
import {HttpService} from "../../../../providers/http-service";
import {Utils} from "../../../../providers/utils";

@Component({
  templateUrl: 'visLevelMore.html',
  selector: 'page-visLevelMore',
})

export class VisLevelMore {
  

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController,
              public http: HttpService,
              public navParams: NavParams,
              public utils: Utils
    , public viewCtrl: ViewController,private platform: Platform) {
  }

  addRKE() {

    this.viewCtrl.dismiss();
    this.navCtrl.push(AddRKE, this.navParams.data);
  }

  addLadder() {
    this.viewCtrl.dismiss();
    this.navCtrl.push(AddLadder, this.navParams.data);
  }

  // sync() {
  //   this.http.post('app/v1/synchronousLevel', {}, true).then(res => {
  //     if (res['ret'] === 'OK') {
  //       this.utils.message.success('PERS_SET_SUCCESS');
  //       this.navParams.data.query(null, true);
  //       this.viewCtrl.dismiss();
  //     } else {
  //       this.utils.message.error('COMMON_OP_FAILED');
  //     }
  //   }, err => {
  //     console.log("getAllCertType---err");
  //   });
  // }
}
