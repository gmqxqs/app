// ÏµÍ³¹ÜÀí-- µ¼º½À¸
import { Component, Input } from '@angular/core';
import { Platform,NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
@Component({
	selector: 'zk-nav-bar',
	templateUrl: 'zkNavBar.html' 
})

export class ZkNavBar {

	@Input() titleMsg:string;
	@Input() hideBackButton:boolean;

	constructor(public navCtrl: NavController,private statusBar: StatusBar,public storage: Storage,public platform:Platform) {
		this.statusBar.styleDefault();
   		if(this.platform.is('ios')) {
   			this.statusBar.overlaysWebView(true);
   		}

        	
	}


	ionViewDidEnter() {
    	this.statusBar.styleDefault();
   		if(this.platform.is('ios')) {
   			this.statusBar.overlaysWebView(true);
   		}
  
  	}
}