// 权限组管理 - 搜索页面
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../providers/http-service";

@Component({
  selector: 'page-selectLevel',
  templateUrl: 'selectLevel.html'
})

export class SelectLevelPage {

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public http: HttpService,private platform: Platform) {
    this.getCriteriaByType();
    this.criteriaCore = this.navParams.data.criteriaCore;
  }

  items: any;
  levelName: any;
  criteriaCore:string='';

  // 搜索指定内容
  getCriteriaByType() {
    // visReservation(预约管理)
    // visLevel(权限管理)
    // visTransaction(历史记录)
    let typeV = 'visLevel';
    this.http.post('app/v1/getCriteriaByType', {
      type: typeV,
    }).then(res => {
      if (res['ret'] === 'OK') {
        this.items = res['data'];
      } else {
      }
    }, err => {});
  }

  onInput(event) {
    if(event.keyCode === 13) {
      this.search();
    }
  }

  search() {
    this.navParams.data.refreshSearch(this.levelName);
    this.navCtrl.pop();
  }

  select(item) {
    this.navParams.data.criteriaCore = item.criteriaCore;
    this.navParams.data.refreshSelect(item.criteriaCore);
    this.navCtrl.pop();
  }

  cancle() {
    this.navCtrl.pop();
  }
}
