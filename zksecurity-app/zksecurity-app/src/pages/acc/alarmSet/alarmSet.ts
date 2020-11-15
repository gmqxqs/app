// це╫Ш-- 
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'page-alarmSet',
	templateUrl: 'alarmSet.html' 
})

export class AlarmSetPage {
	eventNo1:FormControl = new FormControl(true);
	eventNo2:FormControl = new FormControl(true);
	eventNo3:FormControl = new FormControl(true);
	eventNo4:FormControl = new FormControl(true);
	eventNo5:FormControl = new FormControl(true);
	eventNos:any='28,101,102,105,700';
	
	ionViewWillLeave(){
		this.navParams.data.eventNo1=this.eventNo1.value;
		this.navParams.data.eventNo2=this.eventNo2.value;
		this.navParams.data.eventNo3=this.eventNo3.value;
		this.navParams.data.eventNo4=this.eventNo4.value;
		this.navParams.data.eventNo5=this.eventNo5.value;
		this.navParams.data.showNoData = false;
	}


	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}
	constructor(public navCtrl: NavController, public navParams:NavParams, public storage: Storage,private platform: Platform) {
		this.navParams.data.items = [];

		//this.eventNo1.setValue(this.navParams.data.eventNo1);
		//this.eventNo2.setValue(this.navParams.data.eventNo2);
		//this.eventNo3.setValue(this.navParams.data.eventNo3);
		//this.eventNo4.setValue(this.navParams.data.eventNo4);
		//this.eventNo5.setValue(this.navParams.data.eventNo5);

		//this.eventNo1 = new FormControl();
		this.eventNo1.valueChanges.subscribe((val)=>{
			this.storage.set('eventNo1', val);
		});
		this.storage.get('eventNo1').then(v => {
			this.eventNo1.setValue(v === null ? true : v);
		});

		this.eventNo2.valueChanges.subscribe((val)=>{
			this.storage.set('eventNo2', val);
		});
		this.storage.get('eventNo2').then(v => {
			this.eventNo2.setValue(v === null ? true : v);
		});

		this.eventNo3.valueChanges.subscribe((val)=>{
			this.storage.set('eventNo3', val);
		});
		this.storage.get('eventNo3').then(v => {
			this.eventNo3.setValue(v === null ? true : v);
		});

		this.eventNo4.valueChanges.subscribe((val)=>{
			this.storage.set('eventNo4', val);
		});
		this.storage.get('eventNo4').then(v => {
			this.eventNo4.setValue(v === null ? true : v);
		});

		this.eventNo5.valueChanges.subscribe((val)=>{
			this.storage.set('eventNo5', val);
		});
		this.storage.get('eventNo5').then(v => {
			this.eventNo5.setValue(v === null ? true : v);
		});

	}
}