// 人事-- 设置
import { Component } from '@angular/core';
import { Platform,NavController, NavParams, IonicApp, ActionSheetController } from 'ionic-angular';
import { FormGroup, AbstractControl } from '@angular/forms';
import { HttpService } from '../../../providers/http-service';
import { CommonValidator } from '../../../providers/common-validator';
import { Utils } from '../../../providers/utils';

@Component({
	selector: 'page-persSet',
	templateUrl: 'persSet.html' 
})

export class PersSetPage {

	setPersForm: FormGroup;
	isShowCode: boolean = true;
	isShowCard: boolean = true;
	isShowLeave: boolean = true;
	cardHexText: string = 'PERS_CARD_DECIMAL';
	initFlag:boolean;
	msg:any={};

	pinValidator = (control: AbstractControl): {[key: string]: boolean}  => {
		if(control.value) {
			if(/^[0-9]+$/.test(control.value)) {
				let val = parseInt(control.value+'');
				if(val<5 || val>23) {
					this.msg['pinLen'] = 'PERS_ERR_MSG9';
					return {nomatch:true};
				}

			} else {
				this.msg['pinLen'] = 'PERS_ERR_MSG9';
				return {nomatch:true};
			}

		} else {
			this.msg['pinLen'] = 'PERS_ERR_MSG8';
			return {nomatch:true};
		}
		return null;
	}

	cardValidator = (control: AbstractControl): {[key: string]: boolean}  => {
		if(control.value) {
			if(/^[0-9]+$/.test(control.value)) {
				let val = parseInt(control.value+'');
				if(val<1 || val>128) {
					this.msg['cardLen'] = 'PERS_ERR_MSG11';
					return {nomatch:true};
				}

			} else {
				this.msg['cardLen'] = 'PERS_ERR_MSG11';
				return {nomatch:true};
			}

		} else {
			this.msg['cardLen'] = 'PERS_ERR_MSG10';
			return {nomatch:true};
		}
		return null;
	}

	setOptionClass(opts, ind) {
		opts.buttons.forEach((item, index) => {
			item.cssClass = index === ind ? 'action-sheet-selected' : '';
		});
	}

	setCardHex() {
		this.utils.translate.get(['PERS_CARD_FORMAT', 'PERS_CARD_DECIMAL', 'PERS_CARD_HEXDECIMAL', 'COMMON_SURE']).subscribe(vals => {
			let opts = {
				cssClass: 'base-code-sheet',
			    title: vals['PERS_CARD_FORMAT'],
			    buttons: [{
			      	text: vals['PERS_CARD_DECIMAL'],
			      	cssClass: this.cardHexText === 'PERS_CARD_DECIMAL' ? 'action-sheet-selected' : '',
			      	handler: () => {
			      		this.setPersForm.controls['cardHex'].setValue(0);
			      		this.setOptionClass(opts, 0);
			      		return false;
			      	}
			    }, {
			    	text: vals['PERS_CARD_HEXDECIMAL'],
			      	cssClass: this.cardHexText === 'PERS_CARD_HEXDECIMAL' ? 'action-sheet-selected' : '',
			      	handler: () => {
			      		this.setPersForm.controls['cardHex'].setValue(1);
			      		this.setOptionClass(opts, 1);
			      		return false;
			      	}
			    }, {
			    	text: vals['COMMON_SURE'],
			      	role: 'cancel',
			      	handler: () => {
			        	return true;
			      	}
			    }]
			};
			this.asCtrl.create(opts).present();
		});
	}

	initForm() {
		this.initFlag = false;
		this.setPersForm = this.cv.validate({rules:{
			pinLen:[9, this.pinValidator],
			pinSupportLetter:[true],
			cardLen:[32, this.cardValidator],
			cardHex:[0],
			cardsSupport:[false],
			pinSupportIncrement:[true],
			pinRetain:[true]
		},
			message:this.msg,
			noStatusChange:true
		});
		this.setPersForm.controls['cardHex'].valueChanges.subscribe(v => {
			if(v === 1 || v === '1') {
				this.cardHexText = 'PERS_CARD_HEXDECIMAL';
			} else {
				this.cardHexText = 'PERS_CARD_DECIMAL';
			}
		});
		this.setPersForm.controls['pinSupportLetter'].valueChanges.subscribe(v => {
			if(!this.initFlag) {
				return;
			}
			if(v == true || v=="true") {
				if(this.setPersForm.value.pinSupportIncrement== true || this.setPersForm.value.pinSupportIncrement == "true") {
					this.utils.message.error("PERS_PIN_INCREMENT_MSG1");
					setTimeout(() => {
						this.setPersForm.controls['pinSupportLetter'].setValue("false");
					}, 2000);
				}
			}
		});
		this.setPersForm.controls['pinSupportIncrement'].valueChanges.subscribe(v => {
			if(!this.initFlag) {
				return;
			}
			if(v == true || v=="true") {
				if(this.setPersForm.value.pinSupportLetter== true || this.setPersForm.value.pinSupportLetter == "true") {
					this.utils.message.error("PERS_PIN_INCREMENT_MSG2");
					setTimeout(() => {
						this.setPersForm.controls['pinSupportIncrement'].setValue("false");
					}, 2000);
				}
			}
		});
		this.http.post('app/v1/getParams',{}, true).then((resp:any)=>{
			if (resp) {
				this.setPersForm.controls['pinLen'].setValue(resp.pinLen || 9);
				this.setPersForm.controls['pinSupportLetter'].setValue(resp.pinSupportLetter);
				this.setPersForm.controls['cardLen'].setValue(resp.cardLen || 32);
				this.setPersForm.controls['cardHex'].setValue(resp.cardHex || 0);
				this.setPersForm.controls['cardsSupport'].setValue(resp.cardsSupport || false);
				this.setPersForm.controls['pinSupportIncrement'].setValue(resp.pinSupportIncrement);
				this.setPersForm.controls['pinRetain'].setValue(resp.pinRetain);
				this.initFlag = true;
			}
		}, err => {
			this.initFlag = true;
		});
	}


	goBack(){
	    if(this.platform.is('ios')) {
	        this.navCtrl.pop();
	    }
	  }

	constructor(public navCtrl: NavController, public asCtrl:ActionSheetController, public app:IonicApp, public navParams: NavParams, public utils: Utils, public http: HttpService, 
		public cv:CommonValidator,private platform: Platform) {
		this.initForm();
	}

	showHideCode(){
		this.isShowCode = !this.isShowCode;
	}

	showHideCard(){
		this.isShowCard = !this.isShowCard;
	}

	save(){
		if(!this.cv.valid(this.setPersForm)) {
			return;
		}
		this.http.post('app/v1/setParams',this.setPersForm.value).then((resp:any)=>{
			if(resp['ret'] === 'OK') {
				this.utils.message.success('PERS_SET_SUCCESS');
			} else {
				this.utils.message.error(resp['message'] || resp['data'] || 'PERS_SET_FAILED');
			}
		}, err => {
			this.utils.message.error('PERS_SET_FAILED');
		});
	}
}