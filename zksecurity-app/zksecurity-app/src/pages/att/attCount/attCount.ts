// 考勤-- 考勤统计
import { Component } from '@angular/core'
import { Platform,NavController } from 'ionic-angular'
import { HttpService } from '../../../providers/http-service';
import { Utils } from '../../../providers/utils';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-attCount',
	templateUrl: 'attCount.html' 
})

export class AttCountPage {
	items: any;
	month:any;
	averageHours:any=0;
	dept:any='';
	name:any='';
	user:any;
	userPhoto:string = 'assets/img/icon.png';
	isShowAttendance = false;
	isShowLate = false;
	isShowEarly = false;
	isShowOvertime = false;
	isShowException = false;
	url:string='';

	showHide(type) {
  		//console.log(item.isShow);
  		switch(type)
		{
			case 0:
				this.isShowAttendance = !this.isShowAttendance;
				break;
			case 1:
				this.isShowLate = !this.isShowLate;
				break;
			case 2:
				this.isShowEarly = !this.isShowEarly;
				break;
			case 3:
				this.isShowOvertime = !this.isShowOvertime;
				break;
			case 4:
				this.isShowException = !this.isShowException;
				break;
			default:
				break;
		}
  		//item.isShow = !item.isShow;
  	}

	initializeItems(){

		this.storage.get('supportElecBadge').then((supportElecBadge) => {
			if(supportElecBadge == true){
				this.url = 'app/v1/monthlyStatistics';
			} else{
				this.url = 'app/att/monthlyStatistics';
			}

			this.http.post(this.url,{pin:'1',date:this.month}).then((resp?:any)=>{
					if(resp){
						this.items = resp;
					}
				}, resp => {
					console.log("error.........."+resp);
			});
			
		});


		
		/*this.http.post('app/att/monthlyStatistics',{pin:'1',date:this.month}).then((resp?:any)=>{
			if(resp){
				this.items = resp;	
				//this.averageHours = resp[resp.length-1].detailsList[0].value;
			}
		}, resp=>{});*/
	}

	selectMonth(month){
		this.storage.get('SERVER').then(server => {
			if(server && server['address']) {
				this.storage.get('USER').then(user => {
					if(user && user['pin']) {
						this.dept = user['dept'];
						this.name = user['name'];
						this.storage.get('supportElecBadge').then((supportElecBadge) => {
							if(supportElecBadge == true){
								this.url = 'app/v1/monthlyStatistics';
							} else{
								this.url = 'app/att/monthlyStatistics';
							}

							this.http.post(this.url,{pin:user['pin'],date:this.month}).then((resp?:any)=>{
									if(resp){
										this.items = resp;
											if(user['photopath']) {
												this.userPhoto = server['address']+':'+server['port'] + '/' + user['photopath'];	
											}
										this.dept = user['dept'];
										//this.averageHours = resp[resp.length-1].detailsList[0].value;
									}
								}, resp => {
									console.log("error.........."+resp);
							});
							
						});
						
					}
				});
			}
		})
	}


	ionViewDidEnter() {
		//获取登录用户和服务器信息
		this.utils.userCallback().then((u: { user: any, server: any }) => {
			this.user = u.user;
		}, err => {});
	}

	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}

	constructor(public navCtrl: NavController, public http: HttpService, public utils:Utils, public storage:Storage,private platform: Platform) {
		//this.initializeItems();
		this.month = new Date().toISOString().substring(0,7);
		this.selectMonth(this.month);
		
	}
}