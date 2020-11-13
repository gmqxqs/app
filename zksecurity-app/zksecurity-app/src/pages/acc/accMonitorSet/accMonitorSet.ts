// це╫Ш-- 
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../providers/http-service'
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'page-accMonitorSet',
	templateUrl: 'accMonitorSet.html' 
})


export class AccMonitorSetPage {

	normal:FormControl = new FormControl();
	warning:FormControl = new FormControl();
	alarm:FormControl = new FormControl();

	ionViewWillLeave(){
		this.navParams.data.normal = this.normal.value;
		this.navParams.data.warning = this.warning.value;
		this.navParams.data.alarm = this.alarm.value;
		this.navParams.data.items = [];
	}


	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}
	
	constructor(public navCtrl: NavController, public navParams:NavParams, public http: HttpService, public storage: Storage,private platform: Platform) {
		this.normal.valueChanges.subscribe((val)=>{
			this.storage.set('normal', val);
		});
		this.storage.get('normal').then(v => {
			this.normal.setValue(v === null ? true : v);
		})

		this.warning.valueChanges.subscribe((val)=>{
			this.storage.set('warning', val);
		});
		this.storage.get('warning').then(v => {
			this.warning.setValue(v === null ? true : v);
		})

		this.alarm.valueChanges.subscribe((val)=>{
			this.storage.set('alarm', val);
		});
		this.storage.get('alarm').then(v => {
			this.alarm.setValue(v === null ? true : v);
		})
	}
}