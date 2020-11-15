import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from 'ionic-angular';
import { Utils } from './utils';

@Injectable()
export class CommonValidator {

	count:number = 1;

	constructor(public translate:TranslateService, public utils:Utils, public toast:ToastController, public formBuilder:FormBuilder) {}

	validate(opts: {rules: any, message?:any, errorFun?:Function, noStatusChange?:boolean}):FormGroup {
		let form:FormGroup;
		form = this.createRules(opts.rules);
		if(!opts.errorFun) {
			opts.errorFun = this.onErrorHandler;
		}
		form['message']= opts.message;
		form['customErrorFn'] = opts.errorFun;
		if (!opts.noStatusChange) {
			this.initErrorControl(form, opts.errorFun);
		}
		return form;
	}

	createRules(rules:any):FormGroup {
		if(rules) {
			Object.keys(rules).forEach(key => {
				if(Array.isArray(rules[key]) && typeof (rules[key][0])==='function') {
					rules[key].unshift('');
				}
			})
			return this.formBuilder.group(rules);
		}
		return null;
	}

	valid(form:FormGroup) {
		form.reset(form.value);
		if(!form.valid) {
			let ctrlNames:Array<string> = Object.keys(form.controls);
			for(let i =0; i< ctrlNames.length; i++) {
				if(!form.controls[ctrlNames[i]].valid) {
					form['customErrorFn'].apply(this,[form.controls[ctrlNames[i]], ctrlNames[i]]);
					break;
				}
			}
		}
		return form.valid;
	}

	onErrorHandler(control:any, controlName:string) {
		let form:any = control['root'];
		if(form['message'] && form['message'][controlName]) {
			this.translate.get([form['message'][controlName]]).subscribe(vals => {
				if(vals && vals[form['message'][controlName]]) {
					if(this.count) {
						this.count = 0;
						this.utils.message.error(vals[form['message'][controlName]], 2500);
						setTimeout(() => {
							this.count = 1;
						}, 2500);
					}
				} else {
					if(this.count) {
						this.count = 0;
						this.utils.message.error(form['message'][controlName], 2500);
						setTimeout(() => {
							this.count = 1;
						}, 2500);
					}
				}
			});
		}
	}

	initErrorControl(form:FormGroup, errorFun:Function) {
		Object.keys(form.controls).forEach(key => {
			form.controls[key].statusChanges.subscribe(s => {
				if(s === 'INVALID') {
					errorFun.apply(this,[form.controls[key], key]);
				}
			})
		});
	}
}