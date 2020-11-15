import { Injectable } from '@angular/core';
import { HttpService } from './http-service';

@Injectable()
export class Properties {


	getPropertise(key:string|Array<any>, reGet?:boolean) :Promise<any> {
		let keys = typeof key === 'string' ? [key]: key;
		return new Promise(resolve => {
			this.http.post('app/v1/getValueByKey', {keys:keys}, true).then(resp => {
				if(resp['ret'] === 'OK') {
					resolve(resp['data']);
				} else {
					resolve(null);
				}
			}, err => {
				resolve(null);
			});
		});
	}

	constructor(public http:HttpService) {

	}
}