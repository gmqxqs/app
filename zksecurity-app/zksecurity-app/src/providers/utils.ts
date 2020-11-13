import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ZKMessage } from './zk-message';
import { MessageBox } from './message-box';


@Injectable()
export class Utils {
	constructor(public toast:ToastController, public storage:Storage, public translate: TranslateService, public message:ZKMessage, public msgBox:MessageBox) {
	}

	error(msg:string, duration:number=3000, cssClass:string='custom-error') {
		if(msg) {
			if(msg === '501' || msg === '502') {
				return;
			}
			this.translate.get([msg]).subscribe(values => {
				if(values && values[msg]) {
					this._createToast(values[msg], duration, cssClass);
				} else {
					this._createToast(msg, duration, cssClass);
				}
			})
		}
	}

	beforeRefresh(cmpName:string) {
		if(cmpName) {
			this.doTimeout(() => {
				(<HTMLElement>document.querySelector(cmpName + ' .scroll-content')).style.transform = 'translateY(8rem) translateZ(0px)';
			}, 10, 10);
		}
	}

	afterRefresh(cmpName:string) {
		if(cmpName) {
			this.doTimeout(() => {
				(<HTMLElement>document.querySelector(cmpName + ' .scroll-content')).style.transform = 'none';
			}, 10, 40);
		}
	}

	doTimeout(resolve :Function, timeout :number = 100, count :number = 1) {
		if(!resolve) {
			return;
		}
		if(count > 0) {
			setTimeout(() => {
				resolve.apply(this, [count]);
				count--;
				this.doTimeout(resolve, timeout, count);
			}, timeout);
		}
	}

	appendUrl(url:string, endpoint:string) {
		if(url && endpoint) {
			if(endpoint.indexOf('http')===0) {
				return endpoint;
			}
			endpoint = endpoint.indexOf('/') === 0? endpoint.substring(1):endpoint;
			if(url.lastIndexOf('/') === url.length - 1) {
				return url + endpoint;
			} else {
				return url + '/' + endpoint
			}
		}
		return url || endpoint;
	}

	userCallback() : Promise<any> {
		return new Promise((resolve, reject) => {
			this.storage.get('SERVER').then(server=> {
				if(server && server['address']) {
					this.storage.get('USER').then(user => {
						if(user && user['username']) {
							resolve({user, server});
						} else {
							reject({code:-1, message:'no user'});
						}
					}, err => {
						reject({code:-1, message:'no user'})
					})
				} else {
					reject({code:-1, message:'no server'})
				}
			}, err=>{
				reject(err);
			})
		});
	}

	private _createToast(msg:string, duration:number, cssClass?:string) {
		let opts = {
			message: msg,
			duration: duration,
			cssClass: cssClass
		}
		this.toast.create(opts).present();
	}

	stringFormat(str:string, ...params) :string {
		let result:string = str;
		if (params && params.length > 0) {
			if (params.length === 1 && typeof params[0] == 'object') {
	 			for (let key in params[0]) 
	            {
	                if(params[0][key] != undefined)
	                {
	                    let reg = new RegExp("({" + key + "})", "g");
	                    result = result.replace(reg, params[0][key]);
	                }
	            }
			} 
			else 
	        {
	            for (let i = 0; i < params.length; i++)
	            {
	                if (params[i] != undefined)
	                {
						let reg= new RegExp("({)" + i + "(})", "g");
	                    result = result.replace(reg, params[i]);
	                }
	            }
	        }
		}
		return result;    
    }
}