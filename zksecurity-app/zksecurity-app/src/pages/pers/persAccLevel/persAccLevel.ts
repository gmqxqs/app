// ÈËÊÂ-- 
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../providers/http-service';

@Component({
	selector: 'page-persAccLevel',
	templateUrl: 'persAccLevel.html' 
})

export class PersAccLevelPage {
	
	items: Array<any>;
	
	save() {
		this.navParams.data.persForm.controls['accLevels'].setValue(this.items);
		this.navCtrl.pop();
	}



	initItems() {
		let param = {};
		if(this.navParams.data.persForm.value.pin) {
			param = {pin: this.navParams.data.persForm.value.pin};
		}
		this.http.post('app/v1/getAccLevelsByPin',param).then(res => {
			if(res['ret'] === 'OK') {
				this.items = res['data'];
				this.setLevels();
			}
		}, err => {})
	}

	setLevels() {
		let val = this.navParams.data.persForm.value.accLevels;
		for(let i = 0; i < val.length; i++) {
			for(let j = 0; j< this.items.length; j++) {
				if (val[i].accLevelId === this.items[j].accLevelId) {
					this.items[j].selected = val[i].selected;
					break;
				}
			}
		}
	}

	goBack(){
	    if(this.platform.is('ios')) {
	        this.navCtrl.pop();
	    }
	  }

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService,private platform: Platform) {
		this.initItems();
	}
}