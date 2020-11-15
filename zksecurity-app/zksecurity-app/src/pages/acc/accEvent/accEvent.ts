// це╫Ш-- 
import { Component, ElementRef } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../../providers/utils';

@Component({
	selector: 'page-accEvent',
	templateUrl: 'accEvent.html' 
})

export class AccEventPage {
	event: any;
	pageTitle: string = 'PAGE_ACCEVENT';
	serverUrl: string = '';
	lang:string = 'zh';
	serverLang:string;

	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}


	
	constructor(public navCtrl: NavController, public navParams: NavParams, public elementRef: ElementRef, public utils:Utils,private platform: Platform) {
		this.event = this.navParams.data;
		this.lang = this.utils.translate.currentLang;
	}
}