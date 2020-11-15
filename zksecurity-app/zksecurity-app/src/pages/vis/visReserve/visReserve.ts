// 访客-- 预约
import {Component} from '@angular/core';
import {Platform,ActionSheetController, NavController} from 'ionic-angular';
import {SelectDepartmentPage} from "./selectDepartment/selectDepartment";
import {NavParams} from "ionic-angular/index";
import {HttpService} from "../../../providers/http-service";
import {VisStaffSelectionPage} from "./visStaffSelection/visStaffSelection";
import {Utils} from "../../../providers/utils";

@Component({
  selector: 'page-visReserve',
  templateUrl: 'visReserve.html'
})

export class VisReservePage {


  // 选择后的日期
  selDate: any;
  submitDate:any;

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
  // 证件类型 certCode
  certCode = 0;

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
  visCertNumber: "";
  // 手机号
  visPhone: any;

  user: any;

  minDate: any;
  maxDate: any;
  maxYear: any;

  requiredVisitedEmp: any;
  requiredVisitedDept: any;

  lang: string = 'zh';


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
    //this.selDate = new Date().toISOString();
    this.selDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString();

    //console.log("data:",date);
    this.minDate = this.selDate;
    this.maxYear = parseInt(this.minDate.split("-")[0]) + 100;
    this.maxDate = this.maxYear + "-" + this.minDate.split("-")[1] + "-" + this.minDate.split("-")[2];
    console.log("selDate:",this.selDate);
    console.log("maxDate:",this.maxDate);
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
    this.reasonBtn = [];
    this.http.post('app/v1/getVisReason', {}, true).then(res => {
      if (res['ret'] === 'OK') {
        this.reasonData = res['data'];
        this.showReasonAS();
        this.reasonDataProcess();
      }
    }, err => {
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
    this.utils.translate.get(['COMMON_SURE']).subscribe(vals => {
      // 添加确定按钮
      this.reasonBtn.push({
        text: vals['COMMON_SURE'],
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
    this.utils.translate.get(['VIS_VISITTHEREASON']).subscribe(vals => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: vals['VIS_VISITTHEREASON'],
        buttons: this.reasonBtn
      });
      actionSheet.present();
    });
  }

  /**
   * 获取证件类型数据信息
   */
  postGetAllCertType() {
    this.certBtn = [];
    this.http.post('app/v1/getAllCertType', {}, true).then(res => {
      if (res['ret'] === 'OK') {
        this.certData = res['data'];
        this.showCertAS();
        this.certDataProcess();
      }
    }, err => {
    });
  }

  setDataProcess(Id) {
    this.certBtn.forEach(item => {
      item.cssClass = item.value === Id ? 'action-sheet-selected' : '';
    })
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
          value: bean.certCode,
          cssClass: this.certCode === bean.certCode ? 'action-sheet-selected' : '',
          handler: () => {
            this.certType = bean.certName;
            this.certCode = bean.certCode;
            this.setDataProcess(bean.certCode);
            return false;
          }
        });
      }
    }
    this.utils.translate.get(['COMMON_SURE']).subscribe(vals => {
      // 添加确定按钮
      this.certBtn.push({
        text: vals['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          this.isExist();
          return true;
        }
      });
    });
  }

  /**
   * 证件 ActionSheet
   */
  showCertAS(): void {
    this.utils.translate.get(['VIS_IDTYPE']).subscribe(vals => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: vals['VIS_IDTYPE'],
        buttons: this.certBtn
      });
      actionSheet.present();
    });
  }

  /**
   * 选择部门
   */
  selectDepartment() {
    this.navCtrl.push(SelectDepartmentPage, {sdBack: this.sdBack, dept:this.deptParam});
  }

  /**
   * 选择姓名
   */
  selEmp() {
    this.navCtrl.push(VisStaffSelectionPage, {vSSBack: this.vSSBack});
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


  isTel(){
    if (this.testInput(this.visPhone) ) {
      this.utils.message.error('VIS_RESERVE_MSG15');
      return false;
    }

  }
  isExist() {
    if (this.certCode != 0 && this.visCertNumber != "") {
      this.http.post('app/v1/getVisInfoByCertTypeAndCertNumber', {
        visCertType: this.certCode,                         //* 证件类型
        visCertNumber: this.visCertNumber,                  //* 证件号码
      }, true).then(res => {

        if (res['ret'] === '400') {
          this.visCertNumber = "";
          this.utils.message.error(res['message']);
          return;
        }

        this.visName = res['visName']?res['visName']:this.visName;
        this.lastName = res['visLastName']?res['visLastName']:this.lastName;
        this.visCompany = res['visCompany']?res['visCompany']:this.visCompany;
        this.visPhone = res['visPhone']?res['visPhone']:this.visPhone;
      }, err => {
      });
    }
  }

  /**
   * 姓名返回时 数据处理
   */
  vSSBack = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.resDent = params;
        // 设置部门 数据
        this.deptParam = {
          id: params.deptId,
          text: params.deptName
        };
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };

 getSubmitDate(){
   var date = this.selDate;
   var calendar = date.split("T")[0];
   var temp = date.split("T")[1];
   var time = temp.split(".")[0];
   this.submitDate = calendar + " "+time;
   console.log("selDate2:",this.submitDate);

 }

  /**
   * 保存
   */
  save() {
    if (this.checkData()) {
      this.getSubmitDate();
      this.editVisReservation();
    }
  }

  /**
   * 要提交的数据验证
   */
  checkData(): boolean {
    if (this.testInput(this.visName) || this.testInput(this.lastName)) {
      this.utils.message.error('VIS_RESERVE_MSG2');
      return false;
    }
    if (this.testInput(this.visCompany)) {
      this.utils.message.error('VIS_RESERVE_MSG3');
      return false;
    } else {
      if (this.visCompany && this.visCompany.length > 30) {
        this.utils.message.error('VIS_RESERVE_MSG4');
        return false;
      }
    }
    if (this.certCode === 2) {
      if (this.testInput(this.visCertNumber) || !(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(this.visCertNumber))) {
        this.utils.message.error('VIS_RESERVE_MSG5');
        return false;
      }
    }

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
    if (!this.certCode) {
      this.utils.message.error('VIS_RESERVE_MSG9');
      return false;
    }
    if (!this.visCertNumber) {
      this.utils.message.error('VIS_RESERVE_MSG10');
      return false;
    } else {
      if (this.testInput(this.visCertNumber)) {
        this.utils.message.error('VIS_RESERVE_MSG11');
        return false;
      }
      if (!/^[A-Za-z0-9]{1,20}$/.test(this.visCertNumber)) {

        this.utils.message.error('VIS_RESERVE_MSG12');
        return false;
      }
    }
    if (!this.selDate) {
      this.utils.message.error('VIS_RESERVE_MSG13');
      return false;
    }
    if (!this.reasonType) {
      this.utils.message.error('VIS_RESERVE_MSG14');
      return false;
    }
    return true;
  }

  /**
   * 获取参数设置数据
   */
  params: any;

  private getVisParam() {
    this.http.post('app/v1/getVisParam', {}, true).then(res => {
      if (res['ret'] === 'OK') {
        this.params = res['data'];
        this.requiredVisitedEmp = this.params.requiredVisitedEmp;
        this.requiredVisitedDept = this.params.requiredVisitedDept;
        this.http.post('app/v1/getVisReason', {}, true).then(res => {
          if (res['ret'] === 'OK') {
            this.reasonData = res['data'];
            this.reasonType = this.reasonData[0].reasonName;
            this.reasonId = this.reasonData[0].reasonId;
            this.setSelectOption(this.reasonData[0].reasonId);
          } else {
            console.log(res['message']);
          }
        }, err => {
          console.log("getAllCertType---err");
        });
      } else {
        console.log(res['message']);
      }
    }, err => {
      console.log("getVisParam---err");
    });
  }


  // 新增修改预约
  editVisReservation() {
    //获取登录用户和服务器信息
    this.utils.userCallback().then((u: { user: any, server: any }) => {
      this.user = u.user;
      this.http.post('app/v1/editVisReservation', {
        visitEmpId: this.resDent.id == null ? "" : this.resDent.id,                      //* 被访人id
        visitEmpName: this.resDent.name == null ? "" : this.resDent.name,                  //* 被访人
        visitEmpLastName: this.resDent.lastName == null ? "" : this.resDent.lastName,
        visitEmpPin: this.resDent.pin == null ? "" : this.resDent.pin,            //* pin
        visitEmpDeptId: this.deptParam.id,      //* 部门id
        visitEmpDeptName: this.deptParam.text,  //* 部门名称
        visReason: this.reasonType,                       //* 来访事由

        visDate: this.submitDate,//* 来访时间  .replace('-', '/').replace('-', '/')
        visCertType: this.certCode,                         //* 证件类型
        visCertName: this.certType,                       //* 证件名称

        visName: this.visName,                            //* 访客姓名
        visLastName: this.lastName,
        visCertNumber: this.visCertNumber,                //* 证件号码
        visCompany: this.visCompany,                      //  访客公司
        visPhone: this.visPhone,                          //  手机号码
        userName: this.user.username                      //  当前登录用户
      }).then(res => {
        if (res['ret'] === 'OK') {
          this.navCtrl.pop();
        } else if (res['ret'] === '400') {
          this.utils.message.error(res['message']);
        }
        else {
          console.log(res['data']);
        }
      }, err => {
        console.log("editVisReservation---err");
      });
    }, err => {
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
