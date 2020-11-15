import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { LoginPage } from '../pages/base/login/login';
import { Utils } from './utils';

@Injectable()
export class Session {

	private lastTime:number = 0;
	private TIME_OUT:number = 30*60*1000;//超时30分钟

	private pending:boolean = false;

	private ingoreURI:Array<string> = ['login', 'testConnect','appBinding', 'loginOut'];

	private isIngoreURI(uri:string) :boolean {
		let isIngore = false;
		this.ingoreURI.forEach(item => {
			if(isIngore) {
				return;
			}
			if(uri.indexOf(item) !== -1) {
				isIngore = true;
			}
		});
		return isIngore;
	}

	private isTimeout() :boolean {
		let mills = new Date().getTime() - this.lastTime;
		return mills > this.TIME_OUT ? true : false;
	}

	session(uri:string):Promise<any> {
		return new Promise((resolve) => {
			if(this.isIngoreURI(uri)) {
				this.lastTime = new Date().getTime();
				resolve(uri);
				return;
			}
			if(this.pending) {
				return;
			}
			if(this.isTimeout()) {
				let toast = null;
				this.pending = true;
				let opts = {position:'middle', duration: 3000, cssClass: 'custom-toast-grey' ,message: ''};
				this.utils.doTimeout((count) => {
					if(count === 1) {
						this.pending = false;
						this.utils.message.closeMessage();
						this.app.getActiveNav().push(LoginPage, {callback: resolve});
					} else {
						this.utils.translate.get(['LOGIN_ERR_MSG4']).subscribe(msg => {
							opts['message'] = msg['LOGIN_ERR_MSG4'] + '  ' + (count-1) + 's';
							if(toast === null) {
								toast = this.utils.toast.create(opts);
								toast.present();
							}
						})	
					}
				}, 1000, 4);
				
			} else {
				this.lastTime = new Date().getTime();
				resolve(uri);
			}
		});
	}

	constructor(private app:App, public utils:Utils) {
	}
}