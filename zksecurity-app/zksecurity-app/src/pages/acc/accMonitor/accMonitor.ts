// 门禁-- 实时监控
import { Component } from '@angular/core'
import { Platform,NavController } from 'ionic-angular'
import { AccEventPage } from '../../acc/accEvent/accEvent'
import { AccMonitorSetPage } from '../../acc/accMonitorSet/accMonitorSet'
import { HttpService } from '../../../providers/http-service';
import { Storage } from '@ionic/storage';
import * as io from 'socket.io-client';

@Component({
	selector: 'page-accMonitor',
	templateUrl: 'accMonitor.html' 
})

export class AccMonitorPage {
	items:Array<any> =[];
	timestamp:any;
	socket:any;
	eventNos:any='28,101,102,105,700';
	normal:any=true;
	warning:any=true;
	alarm:any=true;
	postUrl:any;
	url:any;
	pin:string;
	port:any;
	userName:any;
	userPwd:any;
	areaNames:any;
	issuperuser:any;
	showDetail(item){
		this.navCtrl.push(AccEventPage,item);
	}

	accMonitorSet(){
		this.navCtrl.push(AccMonitorSetPage,this);
	}

	ionViewDidEnter(){

		this.http.post('app/v1/getPersonByPin', {pin:this.pin},true).then(res=> {
			this.storage.get('SERVER').then(val => {
				if (val) {
					this.userName = val.username;
					this.url = (val.address || '');
					//this.postUrl = this.url.substring(0,this.url.lastIndexOf(':')+1)+this.port;
					this.postUrl = this.url+":"+this.port;
					this.timestamp=new Date().getTime();
					this.socket = io(this.postUrl);
					this.socket.on('accRTMonitorListener', (msg) => {
						if(msg){
							let areaNamesArr:any = this.areaNames.split(",");  
							let resultData:any = eval("(" + msg.message + ")");
							if(resultData.data&&resultData.data.length>0){
								setTimeout(() => {
									if(this.issuperuser==="true"){
										if(this.items.length>50){
											this.items.splice(50,1);
										}
										this.items.unshift(resultData.data);
									}
									else
									{
										for(var i = 0; i < areaNamesArr.length; i++) {
											if(areaNamesArr[i]===resultData.data.areaName) {
												if(this.items.length>50){
													this.items.splice(50,1);
												}
												this.items.unshift(resultData.data);
											}
										}
									}
								}, 1);
							}
							else if(resultData.status){
								setTimeout(() => {
									if(('alarm'===resultData.status&&this.alarm)||('warning'===resultData.status&&this.warning)||('normal'===resultData.status&&this.normal)){
										if(this.issuperuser==="true"){
											if(this.items.length>50){
												this.items.splice(50,1);
											}
											this.items.unshift(JSON.parse(msg.message));
										}
										else
										{
											for(var j = 0; j < areaNamesArr.length; j++) {
												if(areaNamesArr[j]===resultData.areaName) {
													if(this.items.length>50){
														this.items.splice(50,1);
													}
													this.items.unshift(JSON.parse(msg.message));
												}
											}
										}
									}
								}, 1);	
							}
						}
					});
					var message = "{clientId:'1503910586078',userName:'"+this.userName+"',userPwd:'"+this.userPwd+"',eventNos:'" + this.eventNos+"'}";
					this.send({message:message});
				}
			});
		},err=>{
			
		});

		
		
	}

	ionViewWillLeave(){
		if(this.socket != null){
			this.socket.disconnect();
		}
	}

	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}


	
	constructor(public navCtrl: NavController, public http: HttpService, public storage: Storage,private platform: Platform) {
		this.storage.get('normal').then(flag=>{
			this.normal=flag === null ? true : flag;
		});

		this.storage.get('alarm').then(flag=>{
			this.alarm=flag === null ? true : flag;
		});

		this.storage.get('warning').then(flag=>{
			this.warning=flag === null ? true : flag;
		});
		this.storage.get('USER').then(val => {
			this.userName = val.username;
			this.userPwd = val.password;
			if (val) {
				this.port = val.socketioport;
				this.areaNames = val.areaNames;
				this.pin = val.pin;
				this.issuperuser = val.issuperuser;
			}
		});
	}
	send(msg) {
        if(msg != ''){
            this.socket.emit('accRTMonitorListener', msg);
        }
    }
}