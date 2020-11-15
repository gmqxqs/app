// 系统管理-- 条款声明
import { Component } from '@angular/core';
import { Platform,NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-statement',
	templateUrl: 'statement.html' 
})

export class StatementPage {
	logoSrc:string;
	isLocal:boolean;


	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}
	constructor(public navCtrl: NavController, public translate:TranslateService,private platform: Platform) {
		if(this.translate.currentLang === 'zh') {
			this.logoSrc = 'assets/img/cn_logo.png';
			this.isLocal = true;
		} else {
			this.logoSrc = 'assets/img/en_logo.png';
			this.isLocal = false;
		}

	}
}