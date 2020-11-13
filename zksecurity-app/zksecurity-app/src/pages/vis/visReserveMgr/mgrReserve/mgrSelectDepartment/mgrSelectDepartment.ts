// 预约管理--编辑预约-- 部门选择
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../../providers/http-service";

@Component({
  selector: 'page-mgrSelectDepartment',
  templateUrl: 'mgrSelectDepartment.html'
})

export class MgrSelectDepartmentPage {

  // 部分数据源
  items: Array<any>;


  selectItem: any;
  deptParam = {
    id: 0,
    text: ''
  }

  checkedClick(args: Array<any>) {
    this.deptParam.id = args[1].getSelectedItem().id;
    this.deptParam.text = args[1].getSelectedItem().text;
  }

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService,private platform: Platform) {
    this.selectItem = navParams.get("sdBack");
    this.getDeptByVisitEmpPin();
  }

  /**
   * 获取部门数据信息
   */
  getDeptByVisitEmpPin() {
    this.http.post('app/v1/getDeptByVisitEmpPin', {}).then(res => {
      if (res['ret'] === 'OK') {
        this.items = res['data'];
      } else {
        console.log(res['message']);
      }
    }, err => {
      console.log("getDeptByVisitEmpPin---err");
    });
  }

  finish() {
    this.selectItem(this.deptParam).then((result) => {
      this.navCtrl.pop();
    }, (err) => {
      console.error(err);
    })
  }

}
