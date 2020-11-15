// ÃÅ½û-- 
import { Component } from '@angular/core';
import { Platform,NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AccDoorReportPage } from '../../acc/accDoorReport/accDoorReport';
import { ZKMessage } from '../../../providers/zk-message';
import { HttpService } from '../../../providers/http-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-accDoor',
	templateUrl: 'accDoor.html' 
})

export class AccDoorPage {
	door: any;
	openTime:any;
	doorTips:any;
	eventType:any;
	showDetail(door) {
		this.navCtrl.push(AccDoorReportPage, door);
	}

	openDoor(door) {
		this.zkmessage.loading('ACC_DOOR_OPENING');
		if(door.doorAlarmStatus===0 || door.doorAlarmStatus===1)
		{
			setTimeout(() => {
				this.http.post('app/v1/operateDoor',{"doorId":door.id,"type":"openDoor","interval": this.openTime},true).then((resp:{data?:any})=>{
					this.zkmessage.success('COMMON_OP_FINISH');
				}, err => {
					this.zkmessage.error('COMMON_OP_FAILED');
				});
			}, 2000);
		}
		else
		{
			let warningTips =this.door.doorName+","+this.doorTips;
			setTimeout(() => {
				this.zkmessage.error(warningTips);
			}, 500);
		}
		
	}

	setSelectOption(as, ind) {
	    as.instance.d.buttons.forEach((item, index) => {
	      item.cssClass = index === ind ? 'action-sheet-selected as-cutom-selected':'';
	    })
	}

	selectOpenTime(door) {
		this.translate.get(['ACC_DOOR_OPEN', 'COMMON_SECOND', 'COMMON_CANCEL']).subscribe(val => {
			this.storage.get('OPEN_DOOR').then( flag => {
				if(!flag){
					let actionSheet = this.actionsheetCtrl.create({
						title: val['ACC_DOOR_OPEN'],
						cssClass: 'base-code-sheet',
						buttons: [{
						  text: '5' + val['COMMON_SECOND'],
						  handler: () => {
						  	this.openTime = 5;
						  	this.openDoor(door);
						  	this.setSelectOption(actionSheet, 0);
						    return false;
						  }
						}, {
						  text: '10' + val['COMMON_SECOND'],
						  handler: () => {
						  	this.openTime = 10;
						  	this.openDoor(door);
						  	this.setSelectOption(actionSheet, 1);
						    return false;
						  }
						}, {
						  text: '25' + val['COMMON_SECOND'],
						  handler: () => {
						  	this.openTime = 25;
						  	this.openDoor(door);
						  	this.setSelectOption(actionSheet, 2);
						    return false;
						  }
						}, {
						  text: '50' + val['COMMON_SECOND'],
						  handler: () => {
						  	this.openTime = 50;
						  	this.openDoor(door);
						  	this.setSelectOption(actionSheet, 3);
						    return false;
						  }
						}, {
						  text: val['COMMON_CANCEL'],
						  role: 'cancel',
						  handler: () => {
						    return true;
						  }
						}]
					});
					actionSheet.present();
				}
				else{
					this.openTime = 5;
					this.openDoor(door);
				}
			});
		});
	}

	closeDoor(door) {
		this.zkmessage.loading('ACC_DOOR_CLOSEING');
		if(door.doorAlarmStatus===0 || door.doorAlarmStatus===1)
		{
			setTimeout(() => {
				this.http.post('app/v1/operateDoor',{"doorId":door.id,"type":"closeDoor","interval": ''},true).then((resp:{data?:any})=>{
					this.zkmessage.success('COMMON_OP_FINISH');	
				}, resp=>{
					this.zkmessage.error('COMMON_OP_FAILED');
				});
			}, 2000);
		}
		else
		{
			let warningTips =this.door.doorName+","+this.doorTips;
			setTimeout(() => {
				this.zkmessage.error(warningTips);
			}, 500);
		}
	}

	cancelAlarm(door) {
		this.zkmessage.loading('ACC_ALARM_CANCELING');
		if(door.doorAlarmStatus===0 || door.doorAlarmStatus===1)
		{
			setTimeout(() => {
				this.http.post('app/v1/operateDoor',{"doorId":door.id,"type":"cancelAlarm","interval": ''},true).then((resp:{data?:any})=>{
					this.zkmessage.success('COMMON_OP_FINISH');	
				}, err => {
					this.zkmessage.error('COMMON_OP_FAILED');
				});
			}, 2000);
		}
		else
		{
			let warningTips =this.door.doorName+","+this.doorTips;
			setTimeout(() => {
				this.zkmessage.error(warningTips);
			}, 500);
		}
	}


	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}

	constructor(public navCtrl: NavController, public navParams: NavParams,public zkmessage: ZKMessage, public http: HttpService, public translate: TranslateService,public actionsheetCtrl: ActionSheetController, public storage: Storage,private platform: Platform) {
		this.door = this.navParams.data;
		this.translate.get(['ACC_DOOR_OFFLINE_DISABLED']).subscribe(val => {
			this.doorTips = val['ACC_DOOR_OFFLINE_DISABLED'];
		});
	}
}