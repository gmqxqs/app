// 停车场-- 车场参数设置
import {Component} from '@angular/core';
import {Platform,ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../providers/http-service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ParkDefaultPlatePage} from "../parkDefaultPlate/parkDefaultPlate";
import {Utils} from "../../../providers/utils";
import {ParkCarSetTreatmentPage} from "../parkCarSetTreatment/parkCarSetTreatment";


@Component({
  selector: 'page-parkCarSet',
  templateUrl: 'parkCarSet.html'
})

export class ParkCarSetPage {

  setCarForm: FormGroup;
  data = {
    company: true,
    second: true,
    third: true,
    fourth: true
  };
  myType: string = '';
  car: any = {};
  myplate: string = '';
  items: any;
  entry: any;
  entryid: any;
  carTypeId: Array<string>;
  typename: any;
  companyName: any;

  msg: any;
  mTypeName:any='';

  //车场模型：
  carMode: any;
  myTreatment: string = '';
  treatment: any = {
    carKey: '',
    carValue: '',
  };

  lang:string = 'zh';


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder, public http: HttpService, public actionsheetCtrl: ActionSheetController, public utils: Utils,private platform: Platform) {
    this.lang = this.utils.translate.currentLang;
    this.utils.translate.get(['COMMON_SURE', 'PARK_MATCHING_ACCURACY', 'PARK_FIXCARA', 'PARK_FIXCARB', 'PARK_FIXCARC', 'PARK_FIXCARD',
      'PARK_TEMPCARA', 'PARK_ENTRY_BIT', 'PARK_ENTRY_ACTURAL', 'PARK_CAR_MODE', 'PARK_UNMATCH_TREATMENT', 'PARK_HOLD_DAYS', "PRAK_ONE_CAR",
      "PARK_MORE_CAR", "PARK_FREE_GO", "PARK_CHANGE_GO", "PARK_CAR_SET_MSG3", "PARK_CAR_SET_MSG4","PARK_DAYS_FORMAT1","PARK_DAYS_FORMAT2"]).subscribe(vals => {
      this.msg = vals;
      this.setCarForm = formBuilder.group({
        companyName: [],
        fixedCarWarningDay: [],
        entryPrecision: [],
        defaultPlate: [],
        parkCarTypeIds: [],
        fixedCarGoMore: [true],
        temporaryCarGoMore: [true],
        shift: [true],
        fixedFeeScale: [true],
        printReceipts: [true],
        consumptionDiscount: [true],
        fixedIntoTemporary: [true],
        // fixedStatistical: [true],
        manualProcess: [],
        chargeOpen: [],
        parkingLotModel: [],
        // spaceResDays: [],
        parkCarTypeName:[],
      });
      this.http.post('app/v1/getParkParams', {}).then((resp: any) => {
        if (resp) {
          this.setCarForm.controls['companyName'].setValue(resp.data.companyName);
          this.setCarForm.controls['fixedCarWarningDay'].setValue(resp.data.fixedCarWarningDay);
          this.setCarForm.controls['fixedCarGoMore'].setValue(resp.data.fixedCarGoMore);
          this.setCarForm.controls['temporaryCarGoMore'].setValue(resp.data.temporaryCarGoMore);
          this.setCarForm.controls['shift'].setValue(resp.data.shift);
          this.setCarForm.controls['fixedFeeScale'].setValue(resp.data.fixedFeeScale);
          localStorage.setItem('fixedFeeScale', resp.data.fixedFeeScale);
          this.setCarForm.controls['printReceipts'].setValue(resp.data.printReceipts);
          this.setCarForm.controls['consumptionDiscount'].setValue(resp.data.consumptionDiscount);
          this.setCarForm.controls['fixedIntoTemporary'].setValue(resp.data.fixedIntoTemporary);
          // this.setCarForm.controls['fixedStatistical'].setValue(resp.data.fixedStatistical);
          this.setCarForm.controls['defaultPlate'].setValue(resp.data.defaultPlate);
          this.setCarForm.controls['parkCarTypeIds'].setValue(resp.data.parkCarTypeIds);
          this.setCarForm.controls['entryPrecision'].setValue(resp.data.entryPrecision);
          this.setCarForm.controls['manualProcess'].setValue(resp.data.manualProcess);
          this.setCarForm.controls['chargeOpen'].setValue(resp.data.chargeOpen);
          this.setCarForm.controls['parkingLotModel'].setValue(resp.data.parkingLotModel);
          // this.setCarForm.controls['spaceResDays'].setValue(resp.data.spaceResDays);
          this.setCarForm.controls['parkCarTypeName'].setValue(resp.data.parkCarTypeName);
          this.mTypeName=resp.data.parkCarTypeName;
          this.myplate = resp.data.defaultPlate;
          //未匹配处理方式
          this.treatment.carKey = resp.data.manualProcess;
          this.treatment.carValue = resp.data.chargeOpen;
          switch (this.treatment.carKey) {
            case 'free':
              this.myTreatment = this.msg['PARK_FREE_GO'];
              break;
            case 'charge':
              this.myTreatment = this.msg['PARK_CHANGE_GO'];
              break;
          }
          //车场模式
          switch (resp.data.parkingLotModel) {
            case 'many':
              this.carMode = this.msg['PARK_MORE_CAR'];
              break;
            case 'one':
              this.carMode = this.msg['PRAK_ONE_CAR'];
              break;
          }
          console.log(this.msg['PRAK_ONE_CAR']);
          // if (resp.data.parkCarTypeIds=="0") {
          //   this.myType ="";
          // } else {
          //   this.carTypeId = resp.data.parkCarTypeIds.split(',');
          //   if (this.carTypeId) {
          //     for (let an of this.carTypeId) {
          //       switch (an) {
          //         case 'monthA':
          //           this.typename = this.msg['PARK_FIXCARA'];
          //           break;
          //         case 'monthB':
          //           this.typename = this.msg['PARK_FIXCARB'];
          //           break;
          //         case 'monthC':
          //           this.typename = this.msg['PARK_FIXCARC'];
          //           break;
          //         case 'monthD':
          //           this.typename = this.msg['PARK_FIXCARD'];
          //           break;
          //         case 'tempA':
          //           this.typename = this.msg['PARK_TEMPCARA'];
          //           break;
          //       }
          //       this.myType += this.typename + ",";
          //     }
          //     if (this.myType) {
          //       this.myType = this.myType.substring(0, this.myType.length - 1);
          //     }
          //   }
          // }
          switch (resp.data.entryPrecision) {
            case '4':
              this.entry = this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 4);
              break;
            case '5':
              this.entry = this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 5);
              break;
            case '6':
              this.entry = this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 6);
              break;
            case '0':
              this.entry = this.msg['PARK_ENTRY_ACTURAL'];
              break;
          }
        }
      }, resp => {
      });
      this.http.post('app/v1/getParkCarLicensePlate', {}, true).then((resp: { data?: any }) => {
        if (resp.data) {
          this.items = resp.data;
        }
      }, resp => {
      });
      if (navParams.get('myParam')) {
        this.myType = navParams.get('myParam');
      }
    })
  }

  showCompany() {
    if (this.data.company == false) {
      this.data.company = true;
    } else {
      this.data.company = false;
    }
  }

  // type() {
  //   this.navCtrl.push(ParkCarTypePage, {typeCallback: this.typeCallback, typeId: this.setCarForm.value.parkCarTypeIds})
  // }

  defaultPlate() {
    this.navCtrl.push(ParkDefaultPlatePage, {plateCallback: this.plateCallback, myplate: this.myplate})
  }

  showSecond() {
    if (this.data.second == false) {
      this.data.second = true;
    } else {
      this.data.second = false;
    }
  }

  showThird() {
    if (this.data.third == false) {
      this.data.third = true;
    } else {
      this.data.third = false;
    }
  }

  showFourth() {
    if (this.data.fourth == false) {
      this.data.fourth = true;
    } else {
      this.data.fourth = false;
    }
  }

  // typeCallback = (params) => {
  //   return new Promise((resolve, reject) => {
  //     if (typeof (params) != 'undefined') {
  //       this.car = params;
  //       this.mTypeName = this.car.carValue;
  //       resolve('ok');
  //       if(this.car.carKey==""){
  //         this.car.carKey="0";
  //       }
  //       this.setCarForm.controls['parkCarTypeIds'].setValue(this.car.carKey);
  //     } else {
  //       reject(Error('error'));
  //     }
  //   });
  // };

  plateCallback = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.myplate = params;
        resolve('ok');
        this.setCarForm.controls['defaultPlate'].setValue(this.myplate);
      } else {
        reject(Error('error'));
      }
    });
  };

  checkData(): boolean {
    // 信息验证
    if (!this.setCarForm.value.fixedCarWarningDay) {
      this.utils.message.error('PARK_CAR_SET_MSG1');
      return false;
    }
    var re = /^[0-9]*$/
    if (!re.test(this.setCarForm.value.fixedCarWarningDay)) {
      this.utils.message.error('PARK_DAYS_FORMAT1');
      // this.setCarForm.value.fixedCarWarningDay = "";
      return false;
    }
    // if (!this.setCarForm.value.spaceResDays) {
    //   this.utils.message.error('PARK_CAR_SET_MSG3');
    //   return false;
    // }
    // if (!re.test(this.setCarForm.value.spaceResDays)) {
    //   this.utils.message.error('PARK_DAYS_FORMAT2');
    //   // this.setCarForm.value.spaceResDays = "";
    //   return false;
    // }
    return true;
  }

  save() {
    if (this.checkData()) {
      this.http.post('app/v1/setParkParams', this.setCarForm.value).then((resp: any) => {
        if (resp['ret'] === 'OK') {
          localStorage.setItem('fixedFeeScale', this.setCarForm.value.fixedFeeScale);
          this.utils.message.success('PERS_SET_SUCCESS');
        } else {
          this.utils.message.error(resp.message);
        }
      }, resp => {
        this.utils.message.error('COMMON_OP_FAILED');
      });
    }
  }

  ip() {
    this.http.post('app/v1/getParkDeviceIps', {}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data;
      }
    }, resp => {
    });
  }

  setSelectOption(as, ind) {
    as.instance.d.buttons.forEach((item, index) => {
      item.cssClass = index === ind ? 'action-sheet-selected' : '';
    })
  }

  entryPrecision() {
    let actionSheet = this.actionsheetCtrl.create({
      title: this.msg['PARK_MATCHING_ACCURACY'],
      cssClass: 'base-code-sheet',
      buttons: [
        {
          text: this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 4),
          handler: () => {
            this.entry = this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 4);
            this.entryid = '4';
            this.setSelectOption(actionSheet, 0);
            this.setCarForm.controls['entryPrecision'].setValue(this.entryid);
            return false;
          },
          cssClass: this.entry === this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 4) ? 'action-sheet-selected' : '',
        }, {
          text: this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 5),
          handler: () => {
            this.entry = this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 5);
            this.entryid = '5';
            this.setSelectOption(actionSheet, 1);
            this.setCarForm.controls['entryPrecision'].setValue(this.entryid);
            return false;
          },
          cssClass: this.entry === this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 5) ? 'action-sheet-selected' : '',
        }, {
          text: this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 6),
          handler: () => {
            this.entry = this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 6);
            this.entryid = '6';
            this.setSelectOption(actionSheet, 2);
            this.setCarForm.controls['entryPrecision'].setValue(this.entryid);
            return false;
          },
          cssClass: this.entry === this.utils.stringFormat(this.msg['PARK_ENTRY_BIT'], 6) ? 'action-sheet-selected' : '',
        }, {
          text: this.msg['PARK_ENTRY_ACTURAL'],
          handler: () => {
            this.entry = this.msg['PARK_ENTRY_ACTURAL'];
            this.entryid = '0';
            this.setSelectOption(actionSheet, 3);
            this.setCarForm.controls['entryPrecision'].setValue(this.entryid);
            return false;
          },
          cssClass: this.entry === this.msg['PARK_ENTRY_ACTURAL'] ? 'action-sheet-selected' : '',
        }, {
          text: this.msg['COMMON_SURE'],
          role: 'cancel',
          handler: () => {
            return true;
          }
        }
      ]
    });
    actionSheet.present();
  }

  selectCarMode() {
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'base-code-sheet',
      title: this.msg['PARK_CAR_MODE'],
      buttons: [{
        text: this.msg['PRAK_ONE_CAR'],
        handler: () => {
          this.carMode = this.msg['PRAK_ONE_CAR'];
          this.setSelectOption(actionSheet, 0);
          this.setCarForm.controls['parkingLotModel'].setValue("one");
          return false;
        },
        cssClass: this.carMode === this.msg['PRAK_ONE_CAR'] ? 'action-sheet-selected' : '',
      }, {
        text: this.msg['PARK_MORE_CAR'],
        handler: () => {
          this.carMode = this.msg['PARK_MORE_CAR'];
          this.setSelectOption(actionSheet, 1);
          this.setCarForm.controls['parkingLotModel'].setValue("many");
          return false;
        },
        cssClass: this.carMode === this.msg['PARK_MORE_CAR'] ? 'action-sheet-selected' : '',
      }, {
        text: this.msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      }],
    });
    actionSheet.present();
  }

  selectTreatment() {
    this.navCtrl.push(ParkCarSetTreatmentPage, {treatmentCallback: this.treatmentCallback, treatment: this.treatment});
  }

  treatmentCallback = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.treatment = params;
        if (this.treatment.carKey == "free") {
          this.myTreatment = this.msg['PARK_FREE_GO'];
        } else if (this.treatment.carKey == "charge") {
          this.myTreatment = this.msg['PARK_CHANGE_GO'];
        }
        resolve('ok');
        this.setCarForm.controls['manualProcess'].setValue(this.treatment.carKey);
        this.setCarForm.controls['chargeOpen'].setValue(this.treatment.carValue);
      } else {
        reject(Error('error'));
      }
    });
  };
}
