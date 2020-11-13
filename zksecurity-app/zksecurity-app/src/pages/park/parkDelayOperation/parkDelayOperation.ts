/**
 * Created by DELL on 2017/8/2.
 */
// 停车场-- 固定车延期操作
import {Component} from '@angular/core';
import {Platform,ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../providers/http-service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Utils} from "../../../providers/utils";

@Component({
  selector: 'page-parkDelayOperation',
  templateUrl: 'parkDelayOperation.html'
})

export class ParkDelayOperationPage {

  item: any;
  delayForm: FormGroup;
  car: any = {};
  time: any;
  id: any;
  /**
   * 固定车收费标准
   */
  fixedFeeScale: any;
  delayTime: any;
  typeFeeBtn = [];
  fixedFee = '';
  items: any;
  change: any;
  billingMethod: any;
  hourLong: any;
  timeArray: Array<number>;
  date: any;
  date1: any;
  dateArray: Array<number>;
  minTime: any;
  maxYear: any;
  maxDate: any='2100';
  start: any;
  displayParkingSpace:any;
  customCurrency:any = "$";

  //车场模式
  parkingLotModel: any;


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder, public http: HttpService, public utils: Utils, public actionSheetCtrl: ActionSheetController,private platform: Platform) {
    this.id = this.navParams.data.id;
    this.fixedFeeScale = localStorage.getItem('fixedFeeScale');
    this.delayForm = formBuilder.group({
      id: [''],
      delayMoney: [''],
      delayTime: [''],
      parkCarNumber: [''],
      parkCarTypeName: [''],
      endTime: [''],
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
    this.http.post('app/v1/getParkCarDelayById', {id: this.id}, true).then((resp: { data?: any }) => {
      if (resp.data) {
        this.car = resp.data;
        this.delayForm.controls['id'].setValue(this.id);
        this.delayForm.controls['delayMoney'].setValue(this.car.delayMoney);
        //时间截取
        this.timeArray = this.car.endTime.split(' ');
        this.date = this.car.endTime.substring(0, this.car.endTime.length - 8);
        this.date1 = this.car.endTime.substring(this.car.endTime.length - 8);

        this.start = this.getDateObj(this.car.endTime).getTime() + (24 + 8) * 3600 * 1000;
        this.minTime = new Date(this.start).toISOString();
        this.delayForm.controls['delayTime'].setValue(this.minTime);
        this.maxYear = parseInt(this.minTime.split("-")[0]) + 100;
        this.maxDate = this.maxYear + "-" + this.minTime.split("-")[1] + "-" + this.minTime.split("-")[2];
      }
    }, err => {
    });
  }

  save() {
    if (this.fixedFeeScale == 'false') {
      this.time = this.delayForm.value.delayTime;
      this.time = this.time.replace("T", " ").replace("Z", " ");
      this.time = this.time.split(" ")[0] + " 23:59:59";
      this.delayForm.controls['delayTime'].setValue(this.time);
    }

    if (this.checkData()) {
      this.http.post('app/v1/editParkCarDelay', this.delayForm.value, true).then(resp => {
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

  checkData(): boolean {
    // 新增临时车信息验证
    if (!this.delayForm.value.delayTime) {
      this.utils.message.error('PARK_DELAY_MSG1');
      return false;
    }
    if (!this.delayForm.value.delayMoney) {
      this.utils.message.error('PARK_CARDNUM_MSG10');
      return false;
    }
    return true;
  }

  getDateObj(str:string) {
    let result = new Date();
    if(!str) {
      return result;
    }
    let s = str.split(' ');
    if(s.length > 0 && s[0]) {
      let d = s[0].split('-');
      if(d.length == 0) {
          return result;
      }
      let y = parseInt(d[0]);
      let m = d.length > 1 ?  parseInt(d[1]) - 1 : 0;
      let day = d.length > 2 ? parseInt(d[2]) : 1;
      let h = 0;
      let min = 0;
      let sec = 0;
      if(s.length > 1 && s[1]) {
        let dd = s[1].split(':');
        h =  dd.length > 0 ? parseInt(dd[0]) : 0;
        min =  dd.length > 1 ? parseInt(dd[1]) : 0;
        sec =  dd.length > 2 ? parseInt(dd[2]) : 0;
      }
      result = new Date(y, m, day, h, min, sec);
    }
    return result;
  }

  fixedFeeData() {
    this.typeFeeBtn = [];
    if (this.car.parkCarTypeName) {
      this.http.post('app/v1/getFixCarChargeByCarTypeId', {carTypeName: this.car.parkCarTypeName}).then((resp: { data?: any }) => {
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
            this.delayTime = this.getCurrenDay(this.hourLong);
            this.delayForm.controls['delayMoney'].setValue(this.change);
            this.delayForm.controls['delayTime'].setValue(this.delayTime);
            return false;
          }
        }
      );
    }
    this.utils.translate.get(['COMMON_SURE']).subscribe(vals => {
      // 添加确定按钮
      this.typeFeeBtn.push({
        text: vals['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
    });
  }

  /**
   * 收费 ActionSheet
   */
  showfixedFeeAS(): void {
    this.utils.translate.get(['PARK_FIXED_CHARGE_NORNAME']).subscribe(vals => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: vals['PARK_FIXED_CHARGE_NORNAME'],
        buttons: this.typeFeeBtn
      });
      actionSheet.present();
    });
  }

  setFixedFeeOption(FixedFee) {
    this.typeFeeBtn.forEach(item => {
      item.cssClass = item.value === FixedFee ? 'action-sheet-selected' : '';
    })
  }

  getCurrenDay(dates?: any) {
    this.dateArray = this.date.split('-');
    let n: any = dates || 0;
    let y: number = this.dateArray[0];
    let m: any = this.dateArray[1];
    let d: any = this.dateArray[2];
    if (this.billingMethod === 1) {
      m = Number(m) + n;
      if (m >= 13) {
        y = Number(y) + 1;
        m = m - 12;
      }
    } else {
      d = Number(d) + n;
      if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
        if (d > 31) {
          d = d - 31;
          m = Number(m) + 1;
        }
      } else if (m == 4 || m == 6 || m == 9 || m == 11) {
        if (d > 30) {
          d = d - 30;
          m = Number(m) + 1;
        }
      } else {
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
          //闰年
          if (d > 29) {
            d = d - 29;
            m = Number(m) + 1;
          }
        } else {
          if (d > 28) {
            d = d - 28;
            m = Number(m) + 1;
          }
        }
      }
    }
    var mymonth =m;
    var myweekday = d;
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    var result = y + "-" + mymonth + "-" + myweekday + " " + this.date1;
    return result;
  }

}
