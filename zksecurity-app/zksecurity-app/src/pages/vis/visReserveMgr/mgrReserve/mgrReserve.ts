// 预约管理 - 编辑预约页面
import { Component } from '@angular/core';
import { Platform,ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../providers/http-service";
import { Utils } from "../../../../providers/utils";
import { MgrSelectDepartmentPage } from "./mgrSelectDepartment/mgrSelectDepartment";
import { MgrStaffSelectionPage } from "./mgrStaffSelection/mgrStaffSelection";

@Component({
  selector: 'page-mgrReserve',
  templateUrl: 'mgrReserve.html'
})

export class MgrReservePage {


  // 选择后的日期
  selDate: any;

  // 来访事由 数据源
  reasonData: any;
  // 来访事由 按钮组
  reasonBtn = [];
  // 来访事由 显示信息
  reasonType = '';
  // 来访事由 Id
  reasonId = '';

  // 证件类型 数据源
  certData: any;
  // 证件类型 按钮组
  certBtn = [];
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

    lastName: null,
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

  minDate: any;
  maxDate: any;
  maxYear: any;
  start: any;

  requiredVisitedEmp:any;
  requiredVisitedDept:any;
  lang:string = 'zh';


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public http: HttpService,
              public utils: Utils,private platform: Platform) {
    this.initData();
  }

  /**
   * 初始化网络请求
   */
  initData(): void {

    this.data = this.navParams.get('item');
    this.resDent.id = this.data.visitEmpId;
    this.resDent.name = this.data.visitEmpName;
    this.resDent.lastName = this.data.visitEmpName;
    this.deptParam.id = this.data.visitEmpDeptId;
    this.deptParam.text = this.data.visitEmpDeptName;
    this.visName = this.data.visName;
    this.lastName = this.data.visLastName;
    this.visCompany = this.data.visCompany;
    this.certId = this.data.visCertType;
    this.certType = this.data.visitorCertTypeName;
    this.visCertNumber = this.data.visCertNumber;
    this.visPhone = this.data.visPhone;
    this.reasonType = this.data.visReason;
    this.resDent.pin = this.data.visitEmpPin;

    this.start= new Date( this.data.visDate).getTime()+8*3600*1000;
    this.selDate = new Date(this.start).toISOString();
    this.minDate = new Date().toISOString();
    this.maxYear = parseInt(this.minDate.split("-")[0]) + 100;
    this.maxDate = this.maxYear + "-" + this.minDate.split("-")[1] + "-" + this.minDate.split("-")[2];

    if (this.navParams.get('deptParam')) {
      this.deptParam = this.navParams.get('deptParam');
    }
    if (this.navParams.get('rBean')) {
      this.resDent = this.navParams.get('rBean');
    }
    this.getVisParam();
    this.lang = this.utils.translate.currentLang;
  };

  /**
   * 来访事由
   */
  getVisReason() {
    this.utils.translate.get(['VIS_VISITTHEREASON']).subscribe(msg => {
      this.reasonBtn = [];
      this.http.post('app/v1/getVisReason', {}).then(res => {
        if (res['ret'] === 'OK') {
          this.reasonData = res['data'];
          this.reasonDataProcess();
          let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'base-code-sheet',
            title: msg['VIS_VISITTHEREASON'],
            buttons: this.reasonBtn
          });
          actionSheet.present();
        }
      }, err => {});
    });
  }

  setSelectOption(CardNumId) {
    this.reasonBtn.forEach(item => {
      item.cssClass = item.value === CardNumId ? 'action-sheet-selected' : '';
    })
  }

  /**
   * 来访事由 数据处理
   */
  reasonDataProcess(): void {
    if (this.reasonData && this.reasonData.length > 0) {
      // 循环添加按钮组
      for (let bean of this.reasonData) {
        // 按钮组 添加选项
        this.reasonBtn.push({
          text: bean.reasonName,
          value: bean.reasonId,
          cssClass: this.reasonId === bean.reasonId ? 'action-sheet-selected' : '',
          handler: () => {
            this.reasonType = bean.reasonName;
            this.reasonId = bean.reasonId;
            this.setSelectOption(bean.reasonId);
            return false;
          }
        });
      }
    }
    this.utils.translate.get(['COMMON_SURE']).subscribe(msg => {
      // 添加确定按钮
      this.reasonBtn.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
    });
  }

  /**
   * 来访事由 ActionSheet
   */
  showReasonAS(): void {
    this.getVisReason();
  }

  /**
   * 获取证件类型数据信息
   */
  postGetAllCertType() {
    this.utils.translate.get(['VIS_IDTYPE']).subscribe(msg => {
      this.certBtn = [];
      this.http.post('app/v1/getAllCertType', {}, true).then(res => {
        if (res['ret'] === 'OK') {
          this.certData = res['data'];
          this.certDataProcess();
          let actionSheet = this.actionSheetCtrl.create({
            cssClass: 'cus-action-sheet',
            title: msg['VIS_IDTYPE'],
            buttons: this.certBtn
          });
          actionSheet.present();
        }
      }, err => {});
    });
  }

  /**
   * 证件类型 数据处理
   */
  certDataProcess(): void {
    if (this.certData && this.certData.length > 0) {
      // 循环添加按钮组
      for (let bean of this.certData) {
        // 按钮组 添加选项
        this.certBtn.push({
          text: bean.certName,
          handler: () => {
            this.certType = bean.certName;
            this.certId = bean.id;
            return false;
          }
        });
      }
    }
    this.utils.translate.get(['COMMON_SURE']).subscribe(msg => {
      // 添加确定按钮
      this.certBtn.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
    });
  }

  /**
   * 证件 ActionSheet
   */
  showCertAS(): void {
    this.postGetAllCertType();
  }

  isTel(){
    if (this.testInput(this.visPhone) ) {
      this.utils.message.error('VIS_RESERVE_MSG15');
      return false;
    }
  }

  /**
   * 选择部门
   */
  selectDepartment() {
    this.navCtrl.push(MgrSelectDepartmentPage, {sdBack: this.sdBack});
  }

  /**
   * 选择姓名
   */
  selEmp() {
    this.navCtrl.push(MgrStaffSelectionPage, {vSSBack: this.vSSBack});
  }

  /**
   * 部门返回时 数据处理
   */
  sdBack = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.deptParam = params;
        // 清除姓名数据
        this.resDent = {
          id: null,
          name: null,
          lastName: null,
          visitEmpDeptId: null,
          visitEmpDeptName: null,
          pin: null,
        };
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };

  /**
   * 姓名返回时 数据处理
   */
  vSSBack = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.resDent = params;
        // 设置部门 数据
        this.deptParam = {
          id: params.deptCode,
          text: params.deptName
        };
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };


  /**
   * 保存
   */
  save() {
    if (this.checkData()) {
      this.editVisReservation();
    }
  }

  /**
   * 要提交的数据验证
   */
  checkData(): boolean {
    if (this.params.requiredVisitedEmp === "1") {
      if (!this.resDent.id) {
        this.utils.message.error('VIS_RESERVE_MSG6');
        return false;
      }
    }

    if (this.params.requiredVisitedDept === "1") {
      if (!this.deptParam.id) {
        this.utils.message.error('VIS_RESERVE_MSG7');
        return false;
      }
    }
    if (!this.visName) {
      this.utils.message.error('VIS_RESERVE_MSG8');
      return false;
    }
    if (this.testInput(this.visName) || (this.lang !== 'zh' && this.testInput(this.lastName))) {
      this.utils.message.error('VIS_RESERVE_MSG2');
      return false;
    }
    if (!this.visCertNumber) {
      this.utils.message.error('VIS_RESERVE_MSG10');
      return false;
    }
    if (!this.selDate) {
      this.utils.message.error('VIS_RESERVE_MSG13');
      return false;
    }
    return true;
  }

  /**
   * 获取参数设置数据
   */
  params: any;

  private getVisParam() {
    this.http.post('app/v1/getVisParam', {}).then(res => {
      if (res['ret'] === 'OK') {
        this.params = res['data'];

        this.requiredVisitedEmp=this.params.requiredVisitedEmp;
        this.requiredVisitedDept=this.params.requiredVisitedDept;
      } else {
        //console.log(res['message']);
      }
    }, err => {
      //console.log("getVisParam---err");
    });
  }

  // 新增修改预约
  editVisReservation() {
    this.http.post('app/v1/editVisReservation', {
      id: this.data.id,
      visitEmpId: this.resDent.id,                      //* 被访人id
      visitEmpName: this.resDent.name,                  //* 被访人
      visitEmpLastName: this.resDent.lastName,
      visitEmpDeptId: this.deptParam.id,      //* 部门id
      visitEmpDeptName: this.deptParam.text,  //* 部门名称
      visitEmpPin: this.resDent.pin,            //* pin

      visReason: this.reasonType,                       //* 来访事由
      visDate: this.selDate,//* 来访时间   .replace('-', '/').replace('-', '/')
      visCertType: this.certId,                         //* 证件id
      visCertName: this.certType,                       //* 证件名称

      visName: this.visName,                            //* 访客姓名
      visLastName: this.lastName,
      visCertNumber: this.visCertNumber,                //* 证件号码
      visCompany: this.visCompany,                      //  访客公司
      visPhone: this.visPhone,                          //  手机号码

    }).then(res => {
      if (res['ret'] === 'OK') {
        this.navParams.get('items').refreshReserve();
        this.navCtrl.pop();
      } else {
        //console.log(res['data']);
      }
    }, err => {
      //console.log("editVisReservation---err");
    });
  }

  //特殊字符
  unchar = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");

  testInput(str: any) {
    if (this.unchar.test(str)) {
      return true;
    }
    return false;
  }
}
