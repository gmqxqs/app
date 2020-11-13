// 人事-- 新增
import { Component } from '@angular/core';
import { Platform,NavController, NavParams, ActionSheetController,Keyboard, IonicApp } from 'ionic-angular';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PersAccLevelPage } from '../persAccLevel/persAccLevel';
import { PersListPage } from '../persList/persList';
import { PersPhotoPage } from '../persPhoto/persPhoto';
import { HttpService } from '../../../providers/http-service';
import { PersSelectDeptPage } from "../persSelectDept/persSelectDept";
import { Utils } from '../../../providers/utils';
import { Properties } from '../../../providers/properties';
import { CommonValidator } from '../../../providers/common-validator';
import { CallNumber } from '@ionic-native/call-number';
import { SMS, SmsOptions } from '@ionic-native/sms';

@Component({
	selector: 'page-persAdd',
	templateUrl: 'persAdd.html' 
})

export class PersAddPage {

	genderText:string;

	persForm: FormGroup;
	pageTitle: string;
	photoImg:string='assets/img/icon.png';
	isEditPage:boolean;
	accLevelsText:string;
	accLevelsTemp:Array<any> = [];
	pinSupport:boolean;
	cardHex:boolean = true;
	hasAcc:boolean=true;
	msg:any = {};
	lang:string = 'zh';
	serverLang:string;

	goToPhotoPage() {
		this.navCtrl.push(PersPhotoPage, this)
	}

	/**
	 * 自定义人员编号验证方法
	 * @type {Function}
	 */
	pinValidator = (control: AbstractControl): {[key: string]: boolean}  => {
		if(control.value) {
			if(this.pinSupport) {
				if(!/^[A-Za-z0-9]+$/.test(control.value)) {
					this.msg['pin'] = 'PERS_ERR_MSG3';
					return {nomatch:true};
				}
			} else {
				if(!/^[0-9]+$/.test(control.value)) {
					this.msg['pin'] = 'PERS_ERR_MSG4';
					return {nomatch:true};
				}
			}
		} else {
			this.msg['pin'] = 'PERS_ERR_MSG1';
			return {nomatch:true};
		}
		return null;
	}

	callPhone() {
		if(this.persForm.value.mobilePhone){
			this.callNumber.callNumber(this.persForm.value.mobilePhone, true).then(() => {}).catch(() => {})
		} else {
			this.utils.message.error('PERS_ERR_MSG13');
		}
		
	}

	callMessage() {
		if(this.persForm.value.mobilePhone){
			let options = {
				android: {
					intent: 'INTENT'
				}
			} as SmsOptions;
			this.sms.send(this.persForm.value.mobilePhone, '', options);
		} else {
			this.utils.message.error('PERS_ERR_MSG13');
		}

	}

	/**
	 * 自定义手机号验证方法
	 * @type {Function}
	 */
	phoneValidator = (control: AbstractControl): {[key: string]: boolean} => {
		if(control.value) {
			if(this.serverLang === 'zh_CN') {
				return Validators.pattern(/^1[3|4|5|8][0-9]\d{4,8}$/)(control);
			} else {
				return Validators.pattern(/^((\+27)|(0027)|(0))[1-9]\d{8}$/)(control);
			}
		}
		
		return null;
	}


	nameValidator = (control: AbstractControl): {[key: string]: boolean} => {
		if(control.value) {
			if(/[&<>`~!@#$%^*?/|\\:;="]/.test(control.value)) {
				this.msg['name'] = 'PERS_ERR_MSG10';
				this.msg['lastName'] = 'PERS_ERR_MSG10';
				return {nomatch:true};
			}
		}
		return null;
	}

	/**
	 * 自定义卡号验证方法
	 * @type {Function}
	 */
	cardValidator = (control: AbstractControl): {[key: string]: boolean} => {
		if(control.value) {
			if(this.cardHex) {
				if(!/^[0-9]+$/.test(control.value)) {
					this.msg['cardNo'] = 'PERS_ERR_MSG5';
					return {nomatch:true};
				}
			} else {
				if(!/^[A-Fa-f0-9]+$/.test(control.value)) {
					this.msg['cardNo'] = 'PERS_ERR_MSG6';
					return {nomatch:true};
				}
			}
		}
		return null;
	}

	initDefaultDept() {
		this.http.post('app/v1/getDepts', {}, true).then(res => {
			if(res['ret'] === 'OK') {
				for(let i = 0; i < res['data'].length; i++) {
					if(res['data'][i].selected === 'true') {
						this.persForm.controls['deptName'].setValue(res['data'][i].text);
						this.persForm.controls['deptCode'].setValue(res['data'][i].code);
						break;
					}
				}
			}
		}, err => {})
	}
	
	/**
	 * 初始化表单
	 * @return {[type]} [description]
	 */
	initForm() {
		this.persForm = this.cv.validate({rules: {
				name: ['', this.nameValidator],
				lastName: ['', this.nameValidator],
				pin: ['', this.pinValidator],
				gender: [''],
				deptName: ['', Validators.required],
				deptCode: ['', Validators.required],
				mobilePhone: [''],
				email: [''],
				cardNo: ['', this.cardValidator],
				accLevels: [new Array()],
				photoImg: [''],
				personPhoto:[''],
				faceTemplateCount: [''],
				fingerTemplateCount: [''],
				veinTemplateCount: [''],
				personPwd:['', Validators.maxLength(6)],
				id:[''],
				accAddAccLevelIds:[''],
				accDelAccLevelIds:['']
			}, message: this.msg, 
			noStatusChange:true
		});

		this.persForm.controls['photoImg'].valueChanges.subscribe(v => {
			if(v) {
				this.photoImg = v;
			} else {
				this.photoImg = 'assets/img/icon.png';
			}
		});

		this.persForm.controls['gender'].valueChanges.subscribe(v => {
			if(v) {
				this.genderText = v === 'F' ? 'PERS_FEMALE' : 'PERS_MALE';

			} else {
				this.genderText = '';
			}
		});

		this.persForm.controls['accLevels'].valueChanges.subscribe(v => {
			if(v) {
				this.accLevelsText = '';
				v.forEach(item => {
					if(item['selected']) {
						this.accLevelsText = this.accLevelsText+ ',' + item['accLevelName'];
					}
				})
				if(this.accLevelsText !== '') {
					this.accLevelsText = this.accLevelsText.substring(1);
				}
				this.setAddAndDelLevel(v);
			}
		})

		this.initPersonInfo();
	}

	setOptionClass(opts, ind) {
		opts.buttons.forEach((item, index) => {
			item.cssClass = index === ind ? 'action-sheet-selected' : '';
		});
	}

	setGender() {
		if(this.keyboard.isOpen()) {
			//return;
		}
		this.utils.translate.get(['PERS_GENDER', 'PERS_FEMALE', 'PERS_MALE', 'COMMON_SURE']).subscribe(vals => {
			let opts = {
				cssClass: 'base-code-sheet',
			    title: vals['PERS_GENDER'],
			    buttons: [{
			      	text: vals['PERS_FEMALE'],
			      	cssClass: this.genderText === 'PERS_FEMALE' ? 'action-sheet-selected' : '',
			      	handler: () => {
			      		this.persForm.controls['gender'].setValue('F');
			      		this.setOptionClass(opts, 0);
			      		return false;
			      	}
			    }, {
			    	text: vals['PERS_MALE'],
			      	cssClass: this.genderText === 'PERS_MALE' ? 'action-sheet-selected' : '',
			      	handler: () => {
			      		this.persForm.controls['gender'].setValue('M');
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

	initPersLevel(pin) {
		this.http.post('app/v1/getAccLevelsByPin', {pin:pin}, true).then(res => {
			if(res['ret'] === 'OK') {
				this.persForm.controls['accLevels'].setValue(res['data']);
				this.accLevelsTemp = JSON.parse(JSON.stringify(res['data']));
			}
		}, err => {})
	}

	/**
	 * 设置删除权限组和添加权限组
	 * @param {[type]} levels:any [description]
	 */
	setAddAndDelLevel(levels:any) {
		let del:string = '';
		let add:string = '';
		if(this.accLevelsTemp.length > 0) {
			this.accLevelsTemp.forEach(item => {
				let lev = this.getLevel(levels, item.accLevelId);
				if(lev != null) {
					if(item.selected && !lev.selected) {
						del = del + ',' + item.accLevelId;
					} else if(!item.selected && lev.selected) {
						add = add + ',' + item.accLevelId;
					}
				}
			});
		} else {
			levels.forEach(lev => {
				if(lev.selected) {
					add = add + ',' + lev.accLevelId;
				}
			});
		}
		del = del === '' ? del : del.substring(1);
		add = add === '' ? add : add.substring(1);
		this.persForm.controls['accAddAccLevelIds'].setValue(add);
		this.persForm.controls['accDelAccLevelIds'].setValue(del);
	}

	/**
	 * 根据 id获取权限
	 * @param  {[type]} levels:Array<any> 
	 * @param  {[type]} id:any            
	 * @return {[type]}                   
	 */
	getLevel(levels:Array<any>, id:any) {
		for(let i=0; i<levels.length; i++) {
			if(levels[i].accLevelId === id) {
				return levels[i];
			}
		}
		return null;
	}

	/**
	 * 初始化人员数据
	 * @return {[type]} [description]
	 */
	initPersonInfo() {
		//判断新增还是编辑
		if(this.navParams.data.pin) {
			this.pageTitle = 'PERS_DETAIL';
			this.isEditPage = true;
			this.http.post('app/v1/getPersonByPin', {pin: this.navParams.data.pin}, true).then(res => {
				if(res['ret'] === 'OK') {
					this.persForm.controls['name'].setValue(res['data']['name']);
					this.persForm.controls['lastName'].setValue(res['data']['lastName']);
					this.persForm.controls['pin'].setValue(res['data']['pin']);
					this.persForm.controls['gender'].setValue(res['data']['gender']);
					this.persForm.controls['deptName'].setValue(this.navParams.data.deptName);
					this.persForm.controls['deptCode'].setValue(this.navParams.data.deptCode);
					this.persForm.controls['mobilePhone'].setValue(res['data']['mobilePhone']);
					this.persForm.controls['email'].setValue(res['data']['email']);
					this.persForm.controls['cardNo'].setValue(res['data']['cardNo']);
					//this.persForm.controls['accLevels'].setValue(res['data']['accLevels']);
					this.persForm.controls['photoImg'].setValue(this.navParams.data.photoImg);
					this.persForm.controls['faceTemplateCount'].setValue(res['data']['faceTemplateCount']);
					this.persForm.controls['fingerTemplateCount'].setValue(res['data']['fingerTemplateCount']);
					this.persForm.controls['veinTemplateCount'].setValue(res['data']['veinTemplateCount']);
					this.persForm.controls['personPwd'].setValue(res['data']['personPwd']);
					this.persForm.controls['id'].setValue(res['data']['id']);
					//this.accLevelsTemp = JSON.parse(JSON.stringify(res['data']['accLevels']));
					this.initPersLevel(this.navParams.data.pin);
				}
			}, err => {})
			
		} else {
			this.http.post('app/v1/getAccLevelsByPin',{}, true).then(res => {
				if(res['ret'] === 'OK') {
					this.persForm.controls['accLevels'].setValue(res['data']);
				}
			}, err => {});
			this.http.post('app/v1/getPersPin',{}, true).then(res => {
				if(res['ret'] === 'OK') {
					this.persForm.controls['pin'].setValue(res['data']['pin']);
				}
			}, err => {});
			this.initDefaultDept();
			this.pageTitle = 'PAGE_PERSADD';
			this.isEditPage = false;
		}
	}

	/**
	 * 选择权限
	 * @return {[type]}
	 */
	selectAccLevel() {
		this.navCtrl.push(PersAccLevelPage, this);
	}

	/**
	 * 选择部门
	 * @return {[type]} 
	 */
	selectDepartment() {
    	this.navCtrl.push(PersSelectDeptPage, this);
  	}
	
	save() {
		if(!this.cv.valid(this.persForm)) {
			return;
		}
		this.http.post('app/v1/editPersPerson',this.persForm.value, false, 60000).then(resp => {
			if(resp['ret'] === 'OK') {
				this.utils.message.success('COMMON_SAVE_SUCCESS');
				setTimeout(() => {
					if(this.navCtrl.length() === 3) {
						this.navCtrl.getByIndex(1).instance.query().then(resp=>{}, err=>{});
						this.navCtrl.pop();
					} else {
						this.utils.message.closeMessage();
						this.navCtrl.pop();
						this.navCtrl.push(PersListPage);
					}
				},1000);
				
			} else {
				this.utils.message.error(resp['message']|| resp['data'])
			}
		}, err => {
			this.utils.message.error('COMMON_SAVE_FAILED');
		});
	}


	goBack(){
      if(this.platform.is('ios')) {
        this.navCtrl.pop();
      }
    }


	constructor(public cv:CommonValidator, public sms: SMS, public callNumber: CallNumber, public keyboard:Keyboard, public asCtrl:ActionSheetController, 
		public props:Properties,public app:IonicApp, public utils:Utils, public navCtrl: NavController, 
		public navParams: NavParams, public http: HttpService,private platform: Platform) {
		this.msg = {
			pin: 'PERS_ERR_MSG1',
			deptCode:'PERS_ERR_MSG2',
			cardNo:'',
			personPwd:'PERS_ERR_MSG7',
			mobilePhone: 'PERS_ERR_MSG12'
		};
		this.lang = this.utils.translate.currentLang;
		this.initForm();
		this.props.getPropertise(['pers.pinSupportLetter', 'pers.cardHex', 'system.language', 'acc.version']).then(val => {
			if(val) {
				this.pinSupport = val['pers.pinSupportLetter'] === 'true' ? true : false;
				this.cardHex = val['pers.cardHex'] === '0' ? true : false;
				this.serverLang = val['system.language'] || 'zh_CN';
				if(val['acc.version']) {
					this.hasAcc = true;
				} else {
					this.hasAcc = false;
				}
			}
		})
	}

}