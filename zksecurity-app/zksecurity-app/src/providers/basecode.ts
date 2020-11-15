import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { HttpService } from './http-service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BaseCode {

	constructor(public http:HttpService, public translate:TranslateService, public asCtrl:ActionSheetController) {

	}

	/**
	 * 创建下拉字典，与服务端direction-*.xml里配置的字典对应
	 * @param  {[type]} code:string          [字典类型]
	 * @param  {[type]} itemClick?:Function  [单项单击事件，返回false不自动关闭]
	 * @param  {[type]} sureClick?:Function  [确定按钮单击事件]
	 * @param  {[type]} hideSureBtn?:boolean [是否隐藏确定按钮]
	 * @return {[type]}                      [void]
	 */
	create(code:string, itemClick?:Function, sureClick?:Function, hideSureBtn?:boolean) {
		this.http.post('app/v1/getDictionary', { type: code}, true).then((resp:{ret?:string,data:any}) => {
			if(resp.ret && resp.ret === 'OK') {
				this._createSheet(resp.data, itemClick, sureClick, hideSureBtn);
			}
		});
	}

	private _createSheet(data:{text?:string, items?:Array<any>}, resolve:Function, reject:Function, hideSureBtn?:boolean) {
		let opts = {
			title: data.text,
			cssClass:'base-code-sheet',
			buttons:[]
		}
		let curItem;
		data.items.forEach(item => {
			opts.buttons.push({
				text: item.value,
				handler: () => {
					curItem = item;
					return resolve(item);
				}
			});
		});
		if(!hideSureBtn) {
			this.translate.get(['COMMON_SURE']).subscribe(vals => {
				opts.buttons.push({
					text: vals['COMMON_SURE'],
					role:'cancel',
					handler: () => {
						reject(curItem);
					}
				});
				this.asCtrl.create(opts).present();
			});
			
		} else {
			this.asCtrl.create(opts).present();
		}
	}
}