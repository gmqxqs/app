// 门禁-- 门禁设备
import { Component } from '@angular/core'
import { Platform,NavController } from 'ionic-angular'
import { AccDoorPage } from '../../acc/accDoor/accDoor';
import { HttpService } from '../../../providers/http-service'
import { Utils } from '../../../providers/utils';
import { pager } from '../../../providers/constants';

@Component({
	selector: 'page-accDevice',
	templateUrl: 'accDevice.html' 
})

export class AccDevicePage {
	items: any;
	doorCount: any;
	filter:string = '';
	isLast:boolean;

  	/**
	 * 查询数据
	 * @param  {Event} ev: any           [事件对象]
	 * @return {void} 
	 */
	search(ev: any) {
		this.query({}, true).then(rep => {}, err=>{});
    }

    /**
	 * 下拉刷新数据
	 * @param  {any} event 
	 * @return {void}
	 */
	doRefresh(event) {
		this.filter = '';
		this.utils.beforeRefresh('page-accDevice');
		this.query(null, true).then(res=>{
			event.complete();
			this.utils.afterRefresh('page-accDevice');
		}, err => {
			event.complete();
			this.utils.afterRefresh('page-accDevice');
		})
	}

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
	doInfinite(): Promise<any> {
		this.isLast = false;
	    return new Promise((resolve) => {
		    setTimeout(() => {
		        this.query(pager({doorName:''}, this.items.length),true, true).then(res => {
		        	resolve();
		        }, err => {
		        	resolve();
		        });
		    }, 500);
	    });
	}

    /**
	 * 查询
	 * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
	 * @param  {boolean} hideLoad [隐藏加载样式]
	 * @param  {boolean} append   [追加数据]
	 * @return {Promise<any>}     
	 */
	query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
		if(!params) {
			params = pager({doorName:this.filter});
		} 
		else{
			params = Object.assign(pager({doorName:this.filter}), params);
		}

		return new Promise((resolve, reject) => {
			this.http.post('app/v1/getDoorByDoorName', params, hideLoad,25000).then(res => {
				if(res['ret'] === 'OK') {
					if(!resolve(res) && res['data']) {
						this.doorCount = res['data']['totalCount'];
						if(append) {
							this.items = this.items.concat(res['data']['rows']);
						} else {
							this.items = res['data']['rows'];
						}
						if(res['data']['rows'].length < params.pageSize) {
			              this.isLast = true;
			            }
					}	
				} else {
					this.utils.message.error(res['message'] || res['ret']);
				}
			}, err => {
				reject(err);
			})
		});
	}

	showDetail(item) {
		this.http.post('app/v1/getDoorByDoorName',{ doorName : item.doorName }).then((resp:{data?:any})=>{
  			if(resp.data) {
				this.navCtrl.push(AccDoorPage, resp.data.rows[0]);
			}
		}, resp => {});	
	}

	initializeItems() {
		this.http.post('app/v1/getDoorByDoorName',{doorName:'',pageNo:1,pageSize:20}).then((resp:{data?:any}) => {
  			if(resp.data) {
				this.items = resp.data.rows;
				this.doorCount = resp.data.totalCount;
			}
		}, resp => {});
	}
	
	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}

	constructor(public navCtrl: NavController, public http: HttpService, public utils:Utils,private platform: Platform) {
		//this.initializeItems();
		//获取登录用户和服务器信息
		this.utils.userCallback().then((u: { user: any, server: any }) => {
			//this.serverUrl = u.server['address'];
			//this.user = u.user;
			this.query(null).then(rep => {}, err=>{});
		}, err => {});
	}
}