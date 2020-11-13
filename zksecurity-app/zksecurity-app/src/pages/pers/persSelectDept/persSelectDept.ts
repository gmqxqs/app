import { Component, ViewChild } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { ZkTree } from '../../base/zkTree/zkTree';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'page-persSelectDept',
	templateUrl: 'persSelectDept.html' 
})

export class PersSelectDeptPage {

	@ViewChild(ZkTree) tree: ZkTree;

	depts:FormControl;
	
	ionViewDidLoad() {
		if(this.navParams.data.persForm.value['deptCode']) {
			this.depts.setValue(this.navParams.data.persForm.value['deptCode']);
		}
	}

	doSubtmit() {
		let ids:Array<any> = this.tree.getCheckedItems();
		if(ids.length>0) {
			this.navParams.data.persForm.controls['deptCode'].setValue(ids[0]['code']);
			this.navParams.data.persForm.controls['deptName'].setValue(ids[0]['text']);
		} else {
			this.navParams.data.persForm.controls['deptCode'].setValue('');
			this.navParams.data.persForm.controls['deptName'].setValue('');
		}
		this.navCtrl.pop();
	}


	goBack(){
	    if(this.platform.is('ios')) {
	        this.navCtrl.pop();
	    }
	  }

	constructor(public navCtrl: NavController, public navParams:NavParams,private platform: Platform) {
		this.depts = new FormControl();
	}
}