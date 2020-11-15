// 预约管理 - 预约页面
import { Component } from '@angular/core';
import { Platform,NavParams, NavController } from "ionic-angular/index";
import {Utils} from "../../../../providers/utils";

@Component({
  selector: 'page-mgrNoReserve',
  templateUrl: 'mgrNoReserve.html'
})

export class MgrNoReservePage {


  // 选择后的日期
  selDate: any;

  // 来访事由 显示信息
  reasonType = '';
  // 来访事由 Id
  reasonId = '';

  // 证件类型 显示信息
  certType = '';
  // 证件类型 Id
  certId = '';

  // 被访人信息
  resDent = {
    // 被访人id
    id: null,
    // 被访姓名
    name: null,
    // 部门id
    visitEmpDeptId: null,
    // 部门名称
    visitEmpDeptName: null,
    // pin
    pin: null,
  };

  // 部门 数据源
  deptParam = {
    id: 0,
    text: ''
  };

  // 访客姓名
  visName: any;

  lastName: any;
  // 访客公司
  visCompany: any;
  // 证件号码
  visCertNumber: any;
  // 手机号
  visPhone: any;
  data: any;
  isVisited:any;//来访状态

  lang:string = 'zh';

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navParams: NavParams,public navCtrl: NavController,
              public utils: Utils,private platform: Platform) {
    this.initData();
  }

  /**
   * 初始化网络请求
   */
  initData(): void {

    this.data = this.navParams.data;
    this.resDent.id = this.data.visitEmpId;
    this.resDent.name = this.data.visitEmpName;
    this.deptParam.id = this.data.visitEmpDeptId;
    this.deptParam.text = this.data.visitEmpDeptName;
    this.visName = this.data.visName;
    this.lastName = this.data.visLastName;
    this.visCompany = this.data.visCompany;
    this.certId = this.data.visCertType;
    this.certType = this.data.visitorCertTypeName;
    this.visCertNumber = this.data.visCertNumber;
    this.visPhone = this.data.visPhone;
    this.selDate = this.data.visDate;
    this.reasonType = this.data.visReason;
    this.resDent.pin = this.data.visitEmpPin;
    this.isVisited=this.data.isVisited;

    if (this.navParams.get('deptParam')) {
      this.deptParam = this.navParams.get('deptParam');
    }
    if (this.navParams.get('rBean')) {
      this.resDent = this.navParams.get('rBean');
    }

    this.lang = this.utils.translate.currentLang;
  };


}
