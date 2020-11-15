import { Component } from '@angular/core'
import { Platform,NavController, NavParams } from 'ionic-angular'
import { HttpService } from '../../../providers/http-service'


@Component({
	selector: 'page-persDept',
	templateUrl: 'persDept.html' 
})

export class PersDeptPage {
	
	items:Array<any>;
	selectItem:any;
	deptId:any;
	deptName:any;
	myParam = {
		id: 0,
		text: ''
	}

	checkedClick(args:Array<any>) {
		this.myParam.id = args[1].getSelectedItem().id;
		this.myParam.text = args[1].getSelectedItem().text;
		this.deptId = args[1].getSelectedItem().id;
		this.deptName = args[1].getSelectedItem().text;
	}


	goBack(){
      if(this.platform.is('ios')) {
        this.navCtrl.pop();
      }
    }


	constructor(public navCtrl:NavController, public navParams: NavParams, public http: HttpService,private platform: Platform) {
		this.selectItem = navParams.get("sdBack");
		this.initializeItems();
	}

	finish() {
		this.deptId = this.myParam.id;
		this.deptName = this.myParam.text;
		this.navCtrl.pop();
	}

	initializeItems(){
		this.http.post('app/v1/getDepts',{}).then((resp:{data?:any})=>{
		  this.items = resp.data;
		}, resp=>{});
	}

}
