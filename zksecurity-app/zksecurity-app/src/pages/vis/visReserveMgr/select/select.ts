// 预约 - 预约管理 - 搜索页面
import {Component} from '@angular/core';
import {Platform,NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../../providers/http-service";

@Component({
  selector: 'page-select',
  templateUrl: 'select.html'
})

export class SelectPage {


goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService,private platform: Platform) {
    this.getCriteriaByType();
    this.startTime = this.getCurrenDay(0) + " 00:00:00";
    this.endTime = this.getCurrenDay(0) + " 23:59:59";
    this.criteriaCore = this.navParams.data.filters;
  }

  items: any;
  filters: any;
  isTimeShow: any = false;
  startTime: any = '';
  endTime: any = '';
  criteriaCore:string='';

  showHideTime() {
    this.isTimeShow = !this.isTimeShow;
  }

  selectTime(event) {
    if (event == 0) {
      this.startTime = this.getCurrenDay(0) + " 00:00:00";
      this.endTime = this.getCurrenDay(0) + " 23:59:59";
    }
    else if (event == -1) {
      this.startTime = this.getCurrenDay(-1) + " 00:00:00";
      this.endTime = this.getCurrenDay(-1) + " 23:59:59";
    }
    else if (event == 2) {
      this.startTime = this.getCurrenDay(-2) + " 23:59:59";
      this.endTime = this.getCurrenDay(0) + " 00:00:00";
    }
    else if (event == 3) {
      this.startTime = this.getWeekStartDate() + " 00:00:00";
      this.endTime = this.getWeekEndDate() + " 23:59:59";
    }
    else if (event == 4) {
      this.startTime = this.getMonthStartDate() + " 00:00:00";
      this.endTime = this.getMonthEndDate() + " 23:59:59";
    }
  }

  getWeekStartDate() {
    let now: any = new Date();
    let nowDayOfWeek: any = now.getDay();         //今天本周的第几天
    let nowDay: any = now.getDate();              //当前日
    let nowMonth: any = now.getMonth();           //当前月
    let nowYear: any = now.getFullYear();             //当前年
    let weekStartDate: any = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return this.formatDate(weekStartDate);
  }

  getWeekEndDate() {
    let now: any = new Date();
    let nowDayOfWeek: any = now.getDay();         //今天本周的第几天
    let nowDay: any = now.getDate();              //当前日
    let nowMonth: any = now.getMonth();           //当前月
    let nowYear: any = now.getFullYear();             //当前年
    let weekEndDate: any = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return this.formatDate(weekEndDate);
  }

  getMonthStartDate() {
    let now: any = new Date();
    let nowMonth: any = now.getMonth();           //当前月
    let nowYear: any = now.getFullYear();             //当前年
    let monthStartDate: any = new Date(nowYear, nowMonth, 1);
    return this.formatDate(monthStartDate);
  }

  getCurrenDay(dates?: any) {
    let dd: any = new Date();
    let n: any = dates || 0;
    dd.setDate(dd.getDate() + n);
    let y: any = dd.getFullYear();
    let m: any = dd.getMonth() + 1;
    let d: any = dd.getDate();
    m = m < 10 ? 0 + m : m;
    d = d < 10 ? 0 + d : d;
    // var dayStartTime = y + "-" + m + "-" + d +" 00:00:00";
    // var dayEndTime = y + "-" + m + "-" + d +" 23:59:59";
    // this.startTime = dayStartTime;
    // this.endTime = dayEndTime;
    var result = y + "-" + m + "-" + d;
    return result;
  }

//获得本月的结束日期
  getMonthEndDate() {
    let now: any = new Date();
    let nowMonth: any = now.getMonth();           //当前月
    let nowYear: any = now.getFullYear();             //当前年
    let monthEndDate: any = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    return this.formatDate(monthEndDate);
  }

  getMonthDays(myMonth) {
    let now: any = new Date();
    let nowYear: any = now.getFullYear();             //当前年
    let monthStartDate: any = new Date(nowYear, myMonth, 1);
    let monthEndDate: any = new Date(nowYear, myMonth + 1, 1);
    let days: any = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }

  formatDate(date?: any) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
  }

  searchByTime() {
    this.navParams.data.filters = '';
    this.navParams.data.startTime = this.startTime;
    this.navParams.data.endTime = this.endTime;
    let prePage = this.navCtrl.getByIndex(this.navCtrl.length() - 2).instance;
    prePage.query().then(resp => {
      if (prePage.resetContent) {
        prePage.resetContent();
      }
    }, err => {
    });
    this.navCtrl.pop();
  }


  onInput(event) {
    if (event.keyCode === 13) {
      this.search();
    }
  }


  // 搜索指定内容
  getCriteriaByType() {
    // visReservation(预约管理)
    // visLevel(权限管理)
    // visTransaction(历史记录)
    let typeV = 'visReservation';
    this.http.post('app/v1/getCriteriaByType', {
      type: typeV,
    }).then(res => {
      if (res['ret'] === 'OK') {
        this.items = res['data'];
      } else {
      }
    }, err => {
    });
  }

  search() {
    this.select(this.filters);
  }

  select(item) {
    this.navParams.data.filters = item;
    this.navParams.data.startTime = '';
    this.navParams.data.endTime = '';
    let prePage = this.navCtrl.getByIndex(this.navCtrl.length() - 2).instance;
    prePage.query().then(resp => {
      if (prePage.resetContent) {
        prePage.resetContent();
      }
    }, err => {
    });
    this.navCtrl.pop();
  }

  cancle() {
    this.navCtrl.pop();
  }
}
