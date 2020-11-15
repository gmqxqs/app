import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class ZKMessage {
	
	loader:Loading;

	constructor(public translate: TranslateService, public loadCtrl: LoadingController) {
	}

	/**
	 * 打开加载型消息提示框
	 * @param  {[type]} text?:string    消息文本
	 * @param  {[type]} timeout?:number 持续时间，毫秒
	 * @param  {[type]} icon?:string    字体图标
	 * @return {[type]}                 
	 */
	loading(text?: string, timeout?:number, icon?:string, cssClass:string='loader-custom') {
		this.openMessage('loading', text, timeout, icon, cssClass);
	}

	/**
	 * 打开成功型消息提示框
	 * @param  {[type]} text?:string    消息文本
	 * @param  {[type]} timeout?:number 持续时间，毫秒
	 * @param  {[type]} icon?:string    字体图标
	 * @return {[type]}                 
	 */
	success(text?: string, timeout?:number, icon?:string, cssClass:string='loader-custom') {
		this.openMessage('success', text, timeout, icon, cssClass);
	}

	/**
	 * 打开错误型消息提示框
	 * @param  {[type]} text?:string    消息文本
	 * @param  {[type]} timeout?:number 持续时间，毫秒
	 * @param  {[type]} icon?:string    字体图标
	 * @return {[type]}                 
	 */
	error(text?: string, timeout?:number, icon?:string, cssClass:string='loader-custom') {
		this.openMessage('failed', text, timeout, icon, cssClass);
	}

	openMessage(type:string, text?:string, timeout?:number, icon?:string, cssClass:string='loader-custom') {
		if( type === 'success') {
			text = text || 'COMMON_OP_SUCCESS';
			icon = icon || 'zk-icon-connect-success';
		} else if(type === 'failed') {
			text = text || 'COMMON_OP_FAILED';
			icon = icon || 'zk-icon-connect-failed';
		} else {
			text = text || 'COMMON_LOADING';
		} 
		this.translate.get([text]).subscribe(v => {
			if(v && v[text]) {
				text = v[text];
			}
			this._openMessage(type, text, timeout, icon, cssClass);
		})
	}

	/**
	 * 打开消息提示框
	 * @param  {[type]} type:string     消息框类型,3种类型loading,success,failed
	 * @param  {[type]} text?:string    消息文本
	 * @param  {[type]} timeout?:number 持续时间，毫秒
	 * @param  {[type]} icon?:string    字体图标
	 * @return {[type]}                 
	 */
	private _openMessage(type:string, text?:string, timeout?:number, icon?:string, cssClass:string='loader-custom'){
		try {
			if(!text || text === '501' || text === '502') {
				return;
			}
			this.closeMessage();
			let opts = {};
			if( type === 'success') {
				opts = {content: `<div class="loader-custom-success1"><div class="loader-custom-success `+ icon +`"></div>` + text + `</div>`, spinner: 'hide', cssClass: cssClass};
				timeout = timeout || 2000;
			} else if(type === 'failed') {
				opts = {content: `<div class="loader-custom-failed" text-center><span class="loader-custom-success `+ icon +`"></span>` + text + `</div>`, spinner: 'hide', cssClass: cssClass};
				timeout = timeout || 2000;
			} else {
				opts = {content: `<div class="loader-custom-loading">` + text + `</div>`, cssClass: cssClass};
				timeout = timeout || -1;
			}
			this.loader = this.loadCtrl.create(opts);
			this.loader.present();
			if(timeout > 0) {
				setTimeout(() => {
					this.closeMessage();
				}, timeout);
			}
		} catch(error) {}
	}

	/**
	 * 关闭消息提示框
	 * @return {[type]} 
	 */
	closeMessage(timeout?: number) {
		if(this.loader) {
			if(timeout) {
				setTimeout(() => {
					try{
						this.loader.dismiss();
						this.loader = null;
					} catch(error){}
				}, timeout);
			} else {
				try{
					this.loader.dismiss();
					this.loader = null;
				} catch(error){}
			}
		}
	}
}