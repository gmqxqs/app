/**
 * Created by DELL on 2017/8/1.
 */
// 停车场-- 新增车辆授权
import {Component} from '@angular/core';
import {Platform,ActionSheetController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ParkStaffSelectionPage} from "../parkStaffSelections/parkStaffSelection";
import {HttpService} from "../../../providers/http-service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ParkEntranceAreaPage} from "../parkEntranceArea/parkEntranceArea";
import {Utils} from "../../../providers/utils";
import {ParkCarSpacePage} from "../parkCarSpace/parkCarSpace";

@Component({
  selector: 'page-parkCardNumAdd',
  templateUrl: 'parkCardNumAdd.html'

})

export class ParkCardNumAddPage {

  myParam: string = '';
  staffId: string = '';
  personId: string = '';
  personPin: string = '';
  items: any;
  // 车牌按钮组
  certBtn = [];
  // 证件类型 显示信息
  certType = '';
  // 证件类型 Id
  certId = '';
  scaleStratTime: any;//固定车收费的开始时间
  scaleEndTime: any;//固定收费的结束时间
  stratTime: any;//开始时间
  endTime: any;//结束时间
  debt: any;
  car: any = {};
  carType: string = '';
  parkCarTypeId: any;
  cardNumForm: FormGroup;
  parkEntranceAreaName: string = '';
  parkEntranceAreaId = false;
  typeBtn = [];
  // 车类型 显示信息
  type = '';
  typeFeeBtn = [];
  fixedFee = '';
  /**
   * 固定车收费标准
   */
  fixedFeeScale: any;
  change: any;
  billingMethod: any;
  hourLong: any;
  carId: any;
  minStime: any;
  minEtime: any;
  maxYear: any;
  maxDate: any;
  displayParkingSpace:any;
  customCurrency:any = "$";

  sureText: string;
  //车场模式
  parkingLotModel: any;

  space: any = {};
  spaceName: any;

  swipeGoBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController, public formBuilder: FormBuilder, public http: HttpService,
              public toastCtrl: ToastController, public utils: Utils,private platform: Platform) {
    if (navParams.get('myParam')) {
      this.myParam = navParams.get('myParam');
    }
    this.utils.translate.get(['COMMON_SURE']).subscribe(val => {
      this.sureText = val['COMMON_SURE'];
    });
    this.http.post('app/v1/getParkParams', {}, true).then((resp: any) => {
      if (resp) {
        this.fixedFeeScale = resp.data.fixedFeeScale;
        this.customCurrency = resp.data.customCurrency;
        this.displayParkingSpace = typeof(resp.data.displayParkingSpace) != "undefined" ? resp.data.displayParkingSpace : 'true';
      }
    }, resp => {
    });
    //获取车场模型
    this.http.post('app/v1/getParkingLotModel', {}, true).then((resp: { data?: any }) => {
      if (resp.data) {
        this.parkingLotModel = resp.data.parkingLotModel;
      }
    }, resp => {
    });
    this.cardNumForm = formBuilder.group({
      id: [''],
      personId: [''],
      carNumberId: [''],
      parkSpaceId: [''],
      entranceAreaId: [''],
      parkCarTypeId: [''],
      stratTime: [''],
      endTime: [''],
      debt: [''],
    });
    //开始时间初始化
    this.stratTime = new Date().getTime() + 8 * 3600 * 1000;
    this.minStime = new Date(this.stratTime).toISOString();
    this.cardNumForm.controls['stratTime'].setValue(this.minStime);
    //结束时间初始化
    this.endTime = new Date().getTime() + 8 * 3600 * 1000;
    this.minEtime = new Date(this.endTime).toISOString();
    this.cardNumForm.controls['endTime'].setValue(this.minEtime);
    this.maxYear = parseInt(this.minStime.split("-")[0]) + 100;
    this.maxDate = this.maxYear + "-" + this.minStime.split("-")[1] + "-" + this.minStime.split("-")[2];
    this.stratTime =  this.getCurrenDay(0).split(" ")[0];
    this.scaleStratTime = this.getCurrenDay(0);
  }

  goBack() {
    this.navCtrl.pop();
  }

  staffSelection() {
    // 初始化
    this.navCtrl.push(ParkStaffSelectionPage, {contactsCallback: this.contactsCallback});
  }

  entranceArea() {
    this.navCtrl.push(ParkEntranceAreaPage, {
      contactsCallback: this.entranceAreaCallback,
      entranceAreaName: this.parkEntranceAreaName,
      parkSpaceId: this.space.parkSpaceId
    });
  }

  //车位号选择
  spaceSelection() {
    this.navCtrl.push(ParkCarSpacePage, {spaceCallback: this.spaceCallback})
  }

  cardTypeData() {
    this.typeBtn = [];
    this.http.post('app/v1/getParkCarType', {}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data;
        if (this.items && this.items.length > 0) {
          this.typeDataProcess();
          this.showTypeAS();
        }
      }
    }, resp => {
    });
  }

  fixedFeeData() {
    this.typeFeeBtn = [];
    if (this.type) {
      this.http.post('app/v1/getFixCarChargeByCarTypeId', {carTypeName: this.type}).then((resp: { data?: any }) => {
        if (resp.data) {
          this.items = resp.data;
          this.fixedFeeProcess();
          this.showfixedFeeAS();
        } else {
          this.utils.message.error(resp['message']);
        }
      }, resp => {
      });
    } else {
      this.utils.message.error('PARK_CARDNUM_MSG1');
    }
  }

  contactsCallback = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.car = params;
        this.myParam = this.car.personName;
        this.staffId="("+this.car.personPin+")";
        this.personId = this.car.personId;
        this.personPin = this.car.personPin;
        this.cardNumForm.controls['personId'].setValue(this.personId);
        this.certType = '';
        this.cardNumForm.controls['carNumberId'].setValue('');
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };

  entranceAreaCallback = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.car = params;
        this.parkEntranceAreaId = this.car.carKey;
        this.parkEntranceAreaName = this.car.carValue;
        this.cardNumForm.controls['entranceAreaId'].setValue(this.parkEntranceAreaId);
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };

  spaceCallback = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.space = params;
        this.spaceName = this.space.parkSpaceName;
        if (this.cardNumForm.value.parkSpaceId != this.space.parkSpaceId) {
          this.car = { };
          this.parkEntranceAreaId = false;
          this.parkEntranceAreaName = '';
          this.cardNumForm.controls['entranceAreaId'].setValue(this.parkEntranceAreaId);
        }
        this.cardNumForm.controls['parkSpaceId'].setValue(this.space.parkSpaceId);

        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };

  save() {
    if (this.fixedFeeScale == 'false') {
      this.stratTime = this.cardNumForm.value.stratTime;
      this.stratTime = this.stratTime.replace("T", " ").replace("Z", " ");
      this.stratTime = this.stratTime.split(" ")[0];
      this.endTime = this.cardNumForm.value.endTime;
      this.endTime = this.endTime.replace("T", " ").replace("Z", " ");
      this.endTime = this.endTime.split(" ")[0];
      this.cardNumForm.controls['id'].setValue('');
      this.cardNumForm.controls['stratTime'].setValue(this.stratTime);
      this.cardNumForm.controls['endTime'].setValue(this.endTime);
    }
    if (this.checkData()) {
      this.http.post('app/v1/editFixCarLience', this.cardNumForm.value, true).then(resp => {
        if (resp['ret'] === 'OK') {
          this.utils.message.success(resp['data'], 500);
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            this.navParams.data.refresh();
            this.navCtrl.pop();
          })
        } else {
          this.utils.message.error('COMMON_OP_FAILED');
        }
      }, resp => {
        this.utils.message.error('COMMON_OP_FAILED');
      });
    }
  }

  cardNum() {
    this.certBtn = [];
    if (this.personPin) {
      this.http.post('app/v1/getCarNumberByPersonPin', {personPin: this.personPin},).then((resp: { data?: any }) => {
        if (resp['ret'] === 'OK') {
          this.items = resp.data;
          if (this.items && this.items.length > 0) {
            this.certDataProcess();
            this.showCertAS();
          } else {
            this.certType = '';
            this.utils.message.error('PARK_CARDNUM_MSG2');
          }
        } else {
          this.utils.message.error(resp['message']);
        }
      }, resp => {
        this.utils.message.error('PARK_CARDNUM_MSG3');
      });
    } else {
      this.utils.message.error('PARK_CARDNUM_MSG3');
    }
  }

  setCardNumOption(CardNumId) {
    this.certBtn.forEach(item => {
      item.cssClass = item.value === CardNumId ? 'action-sheet-selected' : '';
    })
  }

  setCarTypeOption(CarType) {
    this.typeBtn.forEach(item => {
      item.cssClass = item.value === CarType ? 'action-sheet-selected' : '';
    })
  }

  setFixedFeeOption(FixedFee) {
    this.typeFeeBtn.forEach(item => {
      item.cssClass = item.value === FixedFee ? 'action-sheet-selected' : '';
    })
  }

  /**
   * 收费类型 数据处理
   */
  fixedFeeProcess(): void {
    // 循环添加按钮组
    for (let bean of this.items) {
      // 按钮组 添加选项
      this.typeFeeBtn.push(
        {
          text: bean.name,
          value: bean.name,
          cssClass: this.fixedFee === bean.name ? 'action-sheet-selected' : '',
          handler: () => {
            this.fixedFee = bean.name;
            this.change = bean.amount;
            this.billingMethod = bean.billingMethod;//收费周期类型
            this.hourLong = bean.hourLong;//收费时长
            this.setFixedFeeOption(bean.name);
            //this.scaleStratTime = this.getCurrenDay(0);
            this.cardNumForm.controls['stratTime'].setValue(this.scaleStratTime);
            this.cardNumForm.controls['debt'].setValue(this.change);
            this.scaleEndTime = this.getCurrenDay(this.hourLong);
            this.cardNumForm.controls['endTime'].setValue(this.scaleEndTime);
            return false;
          }
        }
      );
    }
    // 添加确定按钮
    this.typeFeeBtn.push({
      text: this.sureText,
      role: 'cancel',
      handler: () => {
        return true;
      }
    });
  }

  /**
   * 收费 ActionSheet
   */
  showfixedFeeAS(): void {
    this.utils.translate.get(['PARK_FIXED_CHARGE_NORNAME']).subscribe(val => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: val['PARK_FIXED_CHARGE_NORNAME'],
        buttons: this.typeFeeBtn
      });
      actionSheet.present();
    });
  }

  /**
   * 车牌类型 数据处理
   */
  certDataProcess(): void {
    // 循环添加按钮组
    for (let bean of this.items) {
      // 按钮组 添加选项
      this.certBtn.push(
        {
          text: bean.carNumberName,
          value: bean.carNumberId,
          cssClass: this.certId === bean.carNumberId ? 'action-sheet-selected' : '',
          handler: () => {
            this.certType = bean.carNumberName;
            this.certId = bean.carNumberId;
            this.setCardNumOption(bean.carNumberId);
            this.cardNumForm.controls['carNumberId'].setValue(this.certId);
            return false;
          }
        }
      );
    }
    // 添加确定按钮
    this.certBtn.push({
      text: this.sureText,
      role: 'cancel',
      handler: () => {
        return true;
      }
    });
  }


  /**
   * 车牌 ActionSheet
   */
  showCertAS(): void {
    this.utils.translate.get(['PARK_CARDNUM']).subscribe(val => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: val['PARK_CARDNUM'],
        buttons: this.certBtn
      });
      actionSheet.present();
    });
  }

  /**
   * 车类型 数据处理
   */
  typeDataProcess(): void {
    // 循环添加按钮组
    for (let bean of this.items) {
      // 按钮组 添加选项
      this.typeBtn.push(
        {
          text: bean.carTypeName,
          value: bean.carTypeName,
          cssClass: this.type === bean.carTypeName ? 'action-sheet-selected' : '',
          handler: () => {
            this.type = bean.carTypeName;
            this.carId = bean.Id;
            this.setCarTypeOption(bean.carTypeName);
            this.cardNumForm.controls['parkCarTypeId'].setValue(this.carId);
            //数据清空
            this.fixedFee = '';
            //this.scaleStratTime = '';
            //this.scaleStratTime = this.getCurrenDay(0);
            //this.cardNumForm.controls['stratTime'].setValue('');
            this.change = '';
            this.scaleEndTime = '';
            //this.cardNumForm.controls['endTime'].setValue('');
            return false;
          }
        }
      );
    }
    // 添加确定按钮
    this.typeBtn.push({
      text: this.sureText,
      role: 'cancel',
      handler: () => {
        return true;
      }
    });
  }

  /**
   * 车牌 ActionSheet
   */
  showTypeAS(): void {
    this.utils.translate.get(['PARK_CARTYPE']).subscribe(val => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: val['PARK_CARTYPE'],
        buttons: this.typeBtn
      });
      actionSheet.present();
    });
  }

  checkData(): boolean {
    // 新增固定车信息验证
    if (!this.cardNumForm.value.personId) {
      this.utils.message.error('PARK_CARDNUM_MSG4');
      return false;
    }
    if (this.parkingLotModel == "one") {
      if (!this.cardNumForm.value.carNumberId) {
        this.utils.message.error('PARK_CARDNUM_MSG5');
        return false;
      }
    }
    if (!this.cardNumForm.value.entranceAreaId) {
      this.utils.message.error('PARK_CARDNUM_MSG6');
      return false;
    }
    if (!this.cardNumForm.value.parkCarTypeId) {
      this.utils.message.error('PARK_CARDNUM_MSG7');
      return false;
    }
    if (!this.cardNumForm.value.stratTime) {
      this.utils.message.error('PARK_CARDNUM_MSG8');
      return false;
    }
    if (!this.cardNumForm.value.endTime) {
      this.utils.message.error('PARK_CARDNUM_MSG9');
      return false;
    }
    if (!this.compareTime()) {
      return false;
    }

    if (!this.cardNumForm.value.debt) {
      this.utils.message.error('PARK_CARDNUM_MSG10');
      return false;
    }
    return true;
  }

//判断日期，时间大小
  compareTime(): boolean {
    var startTime = this.cardNumForm.value.stratTime;
    var endTime = this.cardNumForm.value.endTime;
    if (startTime.length > 0 && endTime.length > 0) {
      var startDateTemp = startTime.split(" ");
      var endDateTemp = endTime.split(" ");

      var arrStartDate = startDateTemp[0].split("-");
      var arrEndDate = endDateTemp[0].split("-");

     // var arrStartTime = startDateTemp[1].split(":");
     // var arrEndTime = endDateTemp[1].split(":");

      var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], 0, 0, 0);
      var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], 23, 59, 59);

      if (allStartDate.getTime() >= allEndDate.getTime()) {
        this.utils.message.error('PARK_CARDNUM_MSG11');
        return false;
      }
      return true;
    } else {
      this.utils.message.error('PARK_CARDNUM_MSG12');
      return false;
    }
  }

  getCurrenDay(dates?: any) {
    let dd: any = new Date();
    let n: any = dates || 0;
    if (this.billingMethod === 1) {
      dd.setMonth(dd.getMonth() + n);
    } else {
      dd.setDate(dd.getDate() + n);
    }
    let y: any = dd.getFullYear();
    let m: any = dd.getMonth() + 1;
    let d: any = dd.getDate();
    let h: any = dd.getHours();
    let mm: any = dd.getMinutes();
    let ss: any = dd.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    var result = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + ss;
    return result;
  }
}
