// 停车场-- 时间选择

import { Component } from '@angular/core';
import { Platform,NavParams,NavController, ViewController } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";

@Component({
  selector: 'page-parkTimeSeletionsModal',
  templateUrl: 'parkTimeSeletionsModal.html'
})
export class ParkTimeSeletionsPage {
  items:Array<any>;
  startTime:any='';
  endTime:any='';



  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }


  constructor( public navCtrl: NavController,public viewCtrl: ViewController, public navParams:NavParams, public http: HttpService,private platform: Platform) {
    console.log(navParams.data);
    this.startTime=this.getCurrenDay(0)+" 00:00:00";
    this.endTime = this.getCurrenDay(0)+" 23:59:59";
  }

  selectTime(event){
    if(event == 0){
      this.startTime=this.getCurrenDay(0)+" 00:00:00";
      this.endTime = this.getCurrenDay(0)+" 23:59:59";
    }
    else if(event == -1){
      this.startTime=this.getCurrenDay(-1)+" 00:00:00";
      this.endTime = this.getCurrenDay(-1)+" 23:59:59";
    }
    else if(event == 2){
      this.startTime=this.getCurrenDay(-2)+" 00:00:00";
      this.endTime = this.getCurrenDay(0)+" 23:59:59";
    }
    else if(event == 3){
      this.startTime = this.getWeekStartDate()+" 00:00:00";
      this.endTime = this.getWeekEndDate()+" 23:59:59";
    }
    else if(event == 4){
      this.startTime = this.getMonthStartDate()+" 00:00:00";
      this.endTime = this.getMonthEndDate()+" 23:59:59";
    }
  }
  getCurrenDay(dates?:any){
    let dd:any = new Date();
    let n:any = dates || 0;
    dd.setDate(dd.getDate() + n);
    let y:any = dd.getFullYear();
    let m:any = dd.getMonth() + 1;
    let d:any = dd.getDate();
    m = m < 10 ? 0 + m: m;
    d = d < 10 ? 0 + d: d;
    // var dayStartTime = y + "-" + m + "-" + d +" 00:00:00";
    // var dayEndTime = y + "-" + m + "-" + d +" 23:59:59";
    // this.startTime = dayStartTime;
    // this.endTime = dayEndTime;
    var result =  y + "-" + m + "-" + d;
    return result;
  }
  getWeekStartDate() {
    let now:any = new Date();
    let nowDayOfWeek:any = now.getDay();         //今天本周的第几天
    let nowDay:any = now.getDate();              //当前日
    let nowMonth:any = now.getMonth();           //当前月
    let nowYear:any = now.getFullYear();             //当前年
    let weekStartDate:any = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return this.formatDate(weekStartDate);
  }


  getWeekEndDate() {
    let now:any = new Date();
    let nowDayOfWeek:any = now.getDay();         //今天本周的第几天
    let nowDay:any = now.getDate();              //当前日
    let nowMonth:any = now.getMonth();           //当前月
    let nowYear:any = now.getFullYear();             //当前年
    let weekEndDate:any = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return this.formatDate(weekEndDate);
  }

  getMonthStartDate() {
    let now:any = new Date();
    let nowMonth:any = now.getMonth();           //当前月
    let nowYear:any = now.getFullYear();             //当前年
    let monthStartDate:any = new Date(nowYear, nowMonth, 1);
    return this.formatDate(monthStartDate);
  }

  //获得本月的结束日期
  getMonthEndDate() {
    let now:any = new Date();
    let nowMonth:any = now.getMonth();           //当前月
    let nowYear:any = now.getFullYear();             //当前年
    let monthEndDate:any = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    return this.formatDate(monthEndDate);
  }
  getMonthDays(myMonth) {
    let now:any = new Date();
    let nowYear:any = now.getFullYear();             //当前年
    let monthStartDate:any = new Date(nowYear, myMonth, 1);
    let monthEndDate:any = new Date(nowYear, myMonth + 1, 1);
    let days:any = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }

  formatDate(date?:any) {
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


  dismiss() {
    this.viewCtrl.dismiss();
  }
  searchByTime(){
    console.log(this.navParams.data.name);
    if(this.navParams.data.name==="ParkInCarPage"){
      this.http.post('app/v1/getParkRecordin',{carNumber:'',startTime:this.startTime,endTime:this.endTime,pageNo:1,pageSize:20}).then((resp:{data?:any})=>{
        console.log(resp);
        if(resp.data){
          this.items  = resp.data.rows;
          this.navParams.data.startTime  = this.startTime;
          this.navParams.data.endTime  = this.endTime;
          this.navParams.data.items  = resp.data.rows;
          this.navParams.data.putTempItems(resp.data.rows, true);
          this.navParams.data.resetContent();
          this.dismiss();
        }
      }, resp=>{
      });
    }else {
      this.http.post('app/v1/getParkChargeDetail',{carNoOrOperator:'',startTime:this.startTime,endTime:this.endTime,pageNo:1,pageSize:20}).then((resp:{data?:any})=>{
        console.log(resp);
        if(resp.data){
          this.items  = resp.data.rows;
          this.navParams.data.startTime  = this.startTime;
          this.navParams.data.endTime  = this.endTime;
          this.navParams.data.items  = resp.data.rows;
          this.navParams.data.resetContent();
          this.dismiss();
        }
      }, resp=>{
      });
    }

  }
}
