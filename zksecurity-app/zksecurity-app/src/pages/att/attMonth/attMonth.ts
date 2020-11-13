// 考勤-- 考勤月历
import { Component } from '@angular/core'
import { Platform,NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../providers/utils';
import { Storage } from '@ionic/storage';
import { HttpService } from '../../../providers/http-service';


@Component({
	selector: 'page-attMonth',
	templateUrl: 'attMonth.html' 
})

export class AttMonthPage {

	weeks:Array<string>;//星期简写数组
	fullWeeks:Array<string>;//星期简写
	days:Array<Array<any>>; //日期二维数组
	activeDay:{date:Date,shift?:string};//选中日期
	curDay:Date;//当前日期
	attInfo:any;//考勤信息
	todayText:string;
	todayCountMsg:string;

	userPhoto:string = 'assets/img/icon.png';
	userName:string;
	userDept:string;
	url:string='';
	initUserPhoto() {
		this.storage.get('SERVER').then(server => {
			if(server && server['address']) {
				this.storage.get('USER').then(user => {
					if(user) {
						if(user['photopath']) {
							this.userPhoto = server['address'] +':'+server['port']+ '/' + user['photopath'];	
						}
					}
				})
			}
		});
	}

    /**
     * 获取班次
     * @return {[type]} [description]
     */
    getShift() {
    	if(this.activeDay && this.activeDay.shift) {
    		return this.activeDay.shift;
    	} else if(this.attInfo && this.attInfo.shift) {
    		return this.attInfo.shift;
    	}
    	return '';
    }

    /**
     * 获取选中日文本
     * @param  {[type]} hours?:number [description]
     * @param  {[type]} num?:number   [description]
     * @return {[type]}               [description]
     */
	getTodayCountMsg(hours?:number, num?:number) {
		this.translate.get(['ATT_COUNT_MSG']).subscribe(v => {
			this.todayCountMsg = this.utils.stringFormat(v['ATT_COUNT_MSG'], num, hours);
		})
	}

	ionViewDidEnter() {
		this.getTodayCountMsg(0, 0);
		this.initWeekI18n();
		this.initUserPhoto();
	}

	/**
	 * 星期数组初始化
	 * @return {[type]} [description]
	 */
	initWeekI18n() {
		let wi18n = [];
		let fwi18n = [];
		for(let i=1; i<8; i++) {
			wi18n.push('COMMON_WEEK_'+i);
			fwi18n.push('COMMON_FULLWEEK_'+i);
		}
		this.translate.get(wi18n).subscribe(vals => {
			this.weeks = [];
			wi18n.forEach(key => {
				this.weeks.push(vals[key]);
			})
		});
		this.translate.get(fwi18n).subscribe(vals => {
			this.fullWeeks = [];
			fwi18n.forEach(key => {
				this.fullWeeks.push(vals[key]);
			});
		})
		this.todayText = this.getTodayText();
	}

	/**
	 * 选中事件
	 * @param  {[type]} day:{date:Date, hours?:number, shift?:string, attCount?:number, isCurMonth?:boolean, items?:Array<any>} [description]
	 * @return {[type]}                  [description]
	 */
	activeClick(day:{date:Date, hours?:number, shift?:string, count?:number, isCurMonth?:boolean, items?:Array<any>}) {
		if(!day.isCurMonth) {
			return;
		}
		if(day.items.length>0) {
			day.items.sort((a:{time:number},b:{time:number}) => {
				return a.time - b.time;
			});
		}
		this.activeDay = day;
		this.todayText = this.getDateText(day.date);
		this.getTodayCountMsg(day.hours || 0, day.count || 0);
	}

	/**
	 * 切换月份
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	changeMonth(event) {
		if(event.offsetDirection === 4) {
			this.curDay.setMonth(this.curDay.getMonth() - 1);
		}
		else {
			this.curDay.setMonth(this.curDay.getMonth() + 1);
		}
		this.initItem();
		this.activeDay = null;
		this.getTodayCountMsg(0, 0);
		this.todayText = this.getTodayText();
	}


	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}

	constructor(public navCtrl: NavController, public http:HttpService, public storage:Storage, public translate:TranslateService, public utils:Utils,private platform: Platform) {
		
		this.curDay = new Date();
		this.initItem();
	}

	/**
	 * 获取月份第一天
	 * @type {[type]}
	 */
	getFirstDay(day:Date):Date {
		let first:Date = new Date(day.getTime());
		first.setDate(1);
		return first;
	}

	/**
	 * 获取前n日
	 * @type {[type]}
	 */
	getPrevDay(day:Date, n?:number):Date {
		let prev:Date = new Date(day.getTime());
		if(typeof (n)==='undefined') {
			n = 1;
		}
		prev.setDate(day.getDate() - n);
		return prev;
	}

	/**
	 * 获取后n日
	 * @type {[type]}
	 */
	getNextDay(day:Date, n?:number):Date {
		let next:Date = new Date(day.getTime());
		if(typeof (n)==='undefined') {
			n = 1;
		}
		next.setDate(day.getDate() + n);
		return next;
	}

	/**
	 * 获取当月最大日期
	 * @type {[type]}
	 */
	getMaxDay(day:Date):number{
		let max:number = 27;
		let month:number = day.getMonth();
		let maxDay:Date = new Date(day.getTime());
		maxDay.setDate(max);
		for(let i=1; i<6; i++) {
			if(this.getNextDay(maxDay, i).getMonth() !== month) {
				max = max+i-1;
				break;
			}
		}
		return max;
	}

	getTodayText() {
		if(!this.fullWeeks) {
			return '';
		}
		let today:Date = this.curDay;
		let s = today.getFullYear()+'-'+ this.fillZero(today.getMonth()+1)+'-'+this.fillZero(today.getDate())+ ' '+ this.fullWeeks[this.getDay(today) - 1];
		return s;
	}

	getDateText(today:Date) {
		if(!this.fullWeeks) {
			return '';
		}
		let s = today.getFullYear()+'-'+ this.fillZero(today.getMonth()+1)+'-'+this.fillZero(today.getDate())+ ' '+ this.fullWeeks[this.getDay(today) - 1];
		return s;
	}

	/**
	 * 获取星期
	 * @param  {[type]} d:Date [description]
	 * @return {[type]}        [description]
	 */
	getDay(d:Date) {
		return d.getDay() === 0 ? 7 : d.getDay();
	}

	/**
	 * 填充零
	 * @param  {[type]} n:number [description]
	 * @return {[type]}          [description]
	 */
	fillZero(n:number) {
		return n < 10 ? '0'+ n : '' + n;
	}

	/**
	 * 初始化考勤信息
	 * @return {[type]} [description]
	 */
	initItem() {
		this.initDays();
		this.storage.get('USER').then(user => {
			if(user && user['pin']) {
				/*this.http.post('app/att/monthlyAttendanceCalendar',{pin:user['pin'],time:this.curDay.getTime()}).then(res=>{
					if(res['ret'] === 'OK') {
						this.attInfo = res['data'];
						this.mergeInfo();
						this.userName = this.attInfo['name'];
						this.userDept = this.attInfo['dept'];
					}
				}, err=> {});*/

				this.storage.get('supportElecBadge').then(supportElecBadge => {
					console.log("supportElecBadge111:",supportElecBadge);
					if(supportElecBadge == true){
						console.log("supportElecBadge222:",supportElecBadge);
						this.url = 'app/v1/monthlyAttendanceCalendar';
					} else{
						console.log("supportElecBadge333:",supportElecBadge);
						this.url = 'app/att/monthlyAttendanceCalendar';
					}

					this.http.post(this.url,{pin:user['pin'],time:this.curDay.getTime()}).then(res=>{
							if(res['ret'] === 'OK') {
								this.attInfo = res['data'];
								this.mergeInfo();
								this.userName = this.attInfo['name'];
								this.userDept = this.attInfo['dept'];
							}
						}, err => {
							
					});
					
				});
			}
		});


	}

	/**
	 * 合并考勤信息和日期二维数组
	 * @param  {[type]} today?:Date [description]
	 * @return {[type]}             [description]
	 */
	mergeInfo(today?:Date) {
		if(!today) {
			today = this.curDay|| new Date(); 
		}
		let first = this.getFirstDay(today);
		let offset:number = this.getDay(first)-2;
		Object.keys(this.attInfo.data).forEach(key => {
			let i:number = parseInt(key);
			Object.assign(this.days[parseInt((i+offset)/7+'')][(i+offset)%7], this.attInfo.data[key]);
		});
	}

	getTimeTex(mills:number) {
		let d = new Date(mills);
		let s = this.fillZero(d.getHours()) + ':' + this.fillZero(d.getMinutes());
		return s;
	}

	getStateColor(state?:number) {
		if(typeof state === 'undefined' || state < 0) {
			return '#fff';
		} else if(state > 0) {
			return '#7ac143';
		} else {
			return '#fea803';
		}
	}

	/**
	 * 初始化日期二维数组
	 * @param  {[type]} today?:Date [description]
	 * @return {[type]}             [description]
	 */
	initDays(today?:Date) {
		
		if(!today) {
			today = this.curDay || new Date(); 
		}
		this.days = [];
		let first:Date = this.getFirstDay(today);
		this.days[0] = [];
		for(let i=0; i< this.getDay(first)-1; i++) {
			this.days[0].push({date: this.getPrevDay(first, this.getDay(first)-1-i), text:'', items:[]});
		}

		let max:number = this.getMaxDay(today);
		let index:number = 0;
		for(let k = 0; k < max; k++) {
			if(this.days[index].length === 7) {
				index++;
				this.days[index] = [];
			}
			let nextDay = this.getNextDay(first,k);
			if(nextDay.getDate() === today.getDate()) {
				this.days[index].push({date:nextDay, text:k+1, isCurMonth:true, isToday:true,items:[]});
			} else {
				this.days[index].push({date:nextDay, text:k+1, isCurMonth:true, items:[]});
			}
		}
		let last:number = 7 - this.days[index].length;
		for(let j = 0; j<last; j++) {
			this.days[index].push({date: this.getNextDay(first, max + j), text:'', items:[]});
		}
	}
}