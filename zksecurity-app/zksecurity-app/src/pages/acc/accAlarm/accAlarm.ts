// 门禁-- 报警
import { Component } from '@angular/core'
import { Platform,NavController } from 'ionic-angular'
import * as io from 'socket.io-client';
import { HttpService } from '../../../providers/http-service';
import { Storage } from '@ionic/storage';
import { ZKMessage } from '../../../providers/zk-message';
import { AlarmSetPage } from "../../acc/alarmSet/alarmSet";

@Component({
	selector: 'page-accAlarm',
	templateUrl: 'accAlarm.html' 
})

export class AccAlarmPage {
	items: Array<any> =[];
	uniqueKeys: Array<any> =[];
	eventNos: any='28,101,102,103,105,700';
	socket:any
	url:any;
	isShow:any = false;
	selectedIds:any;
	eventNo1:boolean = true;
	eventNo2:boolean = true;
	eventNo3:boolean = true;
	eventNo4:boolean = true;
	eventNo5:boolean = true;
  	timestamp:any;
  	userName:any;
  	pin:string;
	userPwd:any;
	port:any;
	showNoData:boolean = false;
	areaNames:any;
	issuperuser:any;
	showAlarmButton(item, event) {
		var index = this.uniqueKeys.indexOf(item.uniqueKey);
		if(event.checked && index < 0) {
			this.uniqueKeys.push(item.uniqueKey);
		}
		else if (!event.checked && index > -1)
		{
			this.uniqueKeys.splice(index, 1);
		}
		if(this.uniqueKeys.length > 0) {
			this.isShow = true;
		}
		else{
			this.isShow = false;
		}
		this.selectedIds = this.uniqueKeys.join(",");
	}

	alarm(item) {
		this.zkmessage.loading('ACC_ALARM_ING');
		setTimeout(() => {
			this.http.post('app/v1/ackAlarm',{"uniqueKeys":this.selectedIds},true).then((resp:{data?:any}) => {
			    this.zkmessage.success('COMMON_OP_FINISH');
			    this.selectedIds='';
				this.isShow =false;
				//this.getAlarmList();
				this.ionViewDidEnter();
			}, res => {
				this.zkmessage.error('COMMON_OP_FAILED');
				this.selectedIds='';
			});
		}, 500);
	}

	getAlarmList() {
		this.http.post('app/v1/getRTMonitorAlarmData', { "clientId" : this.timestamp, userName: 'admin', userPwd : 'admin', "eventNos" : this.eventNos }, true).then((resp:{data?:any})=>{
			this.items = resp.data;
		}, err => {});
	}

	alarmSet() {
		this.navCtrl.push(AlarmSetPage, this);
	}

	selectEventNo() {
		var arr = [this.eventNo1, this.eventNo2, this.eventNo3, this.eventNo4, this.eventNo5];
		var arr2 = ['28','101,103','102','105','700'];
		var s = new Array();
		for(var i = 0; i < arr.length; i++) {
			if(arr[i]) {
				s.push(arr2[i]);
			}
		}
		this.eventNos=s.join(",");
	}

	ionViewWillLeave() {
		if(this.socket != null){
			this.socket.disconnect();
		}
		this.showNoData = false;
	}

	ionViewDidEnter() {
		
		setTimeout(() => {
			this.showNoData = true;
		}, 3000);
		this.selectEventNo();
		var postUrl = '';
		this.timestamp=new Date().getTime();
		this.http.post('app/v1/getPersonByPin', {pin:this.pin},true).then(res=> {

				this.storage.get('SERVER').then(val => {
			
					if (val) {
						this.url = (val.address || '');
						//postUrl = this.url.substring(0, this.url.lastIndexOf(':') + 1) + this.port;
						postUrl = this.url+":"+ this.port;
						this.socket = io(postUrl);
						this.socket.on('accRTMonitorAlarmListener', (msg) => {
						   
							if (msg) {
							//debugger;
								let areaNamesArr:any = this.areaNames.split(",");  
								let resultData:any = eval("(" + msg.message + ")");
								let itemArry:Array<any>=[];
								setTimeout(() => {
									
								/*if(typeof(resultData.data)=="string") {
									resultData.data = eval(resultData.data);
								}*/
									if (resultData.data && resultData.data.length > -1) {
										
										if(this.issuperuser==="true"){
											this.items = resultData.data;
											
										}
										else{
											for(var i = 0; i < areaNamesArr.length; i++) {
												for(var j=0;j<resultData.data.length;j++){
													if(areaNamesArr[i]===resultData.data[j].areaName) {
														if(itemArry.length>200){
															itemArry.splice(200,1);
														}
														itemArry.unshift(resultData.data[j]);
													}
												}
											}
											this.items = itemArry;
											
										}
										
									}
									else if(resultData && !resultData.data) {
										if(this.issuperuser==="true"){
											if(this.items.length>200){
												this.items.splice(200,1);
											}

											
											this.items.unshift(JSON.parse(msg.message));
											
										}
										else{
											for(var k = 0; k < areaNamesArr.length; k++) {
												if(areaNamesArr[k]===resultData.areaName) {
													if(this.items.length>200){
														this.items.splice(200,1);
														
													}
													this.items.unshift(JSON.parse(msg.message));
													
												}
											}
										}
									}
								}, 1);	
							}	
						});
						var message = "{clientId:" + this.timestamp + ",userName:'"+this.userName+"',userPwd:'"+this.userPwd+"',eventNos:'" + this.eventNos + "'}";
						this.send({message:message});
					}
				});	
			
		},err=>{
			
		});
	
	}

	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}

	constructor(public navCtrl: NavController, public http: HttpService, public storage: Storage, public zkmessage: ZKMessage,private platform: Platform) {
		
		//debugger;
		//alert("1111");
		this.storage.get('eventNo1').then(flag => {
			this.eventNo1= flag === null ? true : flag;
		});

		this.storage.get('eventNo2').then(flag => {
			this.eventNo2= flag === null ? true : flag;
		});

		this.storage.get('eventNo3').then(flag => {
			this.eventNo3= flag === null ? true : flag;
		});

		this.storage.get('eventNo4').then(flag => {
			this.eventNo4= flag === null ? true : flag;
		});

		this.storage.get('eventNo5').then(flag => {
			this.eventNo5= flag === null ? true : flag;
		});

		setTimeout(() => {
			this.showNoData = true;
		}, 3000);
		this.storage.get('USER').then(val => {
			this.userName = val.username;
			this.userPwd = val.password;
			this.pin = val.pin;
			if (val) {
				this.port = val.socketioport;
				this.areaNames = val.areaNames;
				this.issuperuser = val.issuperuser;
			}
		});
	}

	send(msg) {

        if(msg != ''){
        
            this.socket.emit('accRTMonitorAlarmListener', msg);
        }
    }
}