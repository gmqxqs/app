// 访客-- 部门选择
import { Component, ViewChild } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../../providers/http-service';
import { ZkTree } from '../../../base/zkTree/zkTree';
import { Utils } from "../../../../providers/utils";


@Component({
  selector: 'page-selectDepartment',
  templateUrl: 'selectDepartment.html'
})

export class SelectDepartmentPage {

  // 部分数据源
  items: Array<any>;
  selectItem: any;
  deptParam = {
    id: 0,
    text: ''
  }

  deptTemp:any;

  @ViewChild(ZkTree) tree: ZkTree;

  checkedClick(args: Array<any>) {
    this.deptParam.id = args[1].getSelectedItem().id;
    this.deptParam.text = args[1].getSelectedItem().text;
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public utils:Utils, public navParams: NavParams, public http: HttpService,private platform: Platform) {
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
        setTimeout(() => {
          this.deptTemp = this.deptParam.id;
          if(this.navParams.get("dept") && this.navParams.get("dept").id) {
            this.deptParam = this.navParams.get("dept");
            this.deptTemp = this.deptParam.id;
            this.utils.doTimeout(() => {
              this.tree.setChecked(this.deptParam.id, true);
              this.tree.setSelected(this.deptParam.id);
            }, 20, 20);
          }
        }, 10);
      }
    }, err => {});
  }

  finish() {
    if( this.deptTemp == this.deptParam.id) {
      this.navCtrl.pop();
    } else {
      this.selectItem(this.deptParam).then((result) => {
        this.navCtrl.pop();
      }, (err) => {});
    }
  }

}
