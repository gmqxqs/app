import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class MessageBox {
	
	msg:any;

	constructor(public alertCtrl: AlertController, public translate: TranslateService, public toast:ToastController) {
	}

	/**
	 * 消息框弹窗
	 * @param  {[type]} text:       string        消息文本
	 * @param  {[type]} title?:     string        消息标题
	 * @param  {[type]} hideTitle?: boolean       是否隐藏标题
	 * @param  {[type]} okText?:    string        确定按钮文本
	 * @return {[type]}             void
	 */
	alert(text: string, title?: string, hideTitle?: boolean, okText?: string) {
		okText = okText || 'COMMON_SURE';
		title = title || 'COMMON_TIP';
		this.translate.get([okText,title,text]).subscribe(values => {
			this.msg = values;
			let opts = {title: this.msg[text]||text, buttons: [this.msg[okText]||okText], cssClass: 'dl-cus-alert'};
			if(!hideTitle) {
				opts['title'] = this.msg[title]||title;
			}
			this.alertCtrl.create(opts).present();
		});
		
	}

	createToast(msg:string, duration:number=3000, cssClass?:string) {
		if(msg) {
			this.translate.get([msg]).subscribe(values => {
				if(values && values[msg]) {
					this._createToast(values[msg], duration, cssClass);
				} else {
					this._createToast(msg, duration, cssClass);
				}
			})
		}
	}

	private _createToast(msg:string, duration:number, cssClass?:string) {
		let opts = {
			message: msg,
			duration: duration,
			cssClass: cssClass
		}
		this.toast.create(opts).present();
	}

	/**
	 * 确认框弹窗
	 * @param  {[type]} text:        string        消息文本
	 * @param  {[type]} title?:      string        消息标题
	 * @param  {[type]} okText?:     string        确定按钮文本
	 * @param  {[type]} cancelText?: string        取消按钮文本
	 * @return {[type]}              Promise
	 */
	confirm(text: string, title?: string, okText?: string, cancelText?: string){
		return new Promise((resolve, reject) => {
			title = title || 'COMMON_TIP';
			okText = okText || 'COMMON_SURE';
			cancelText = cancelText || 'COMMON_CANCEL';
			this.translate.get([okText, cancelText, title, text]).subscribe(values => {
				this.msg = values;
				let opts = {title: this.msg[text] || text, cssClass: 'dl-cus-alert',buttons: [{
					text: this.msg[cancelText] || cancelText,
					handler: reject
				}, {
					text: this.msg[okText]|| okText,
					handler: resolve
				}]};
				this.alertCtrl.create(opts).present();
			});
		});
	}
}