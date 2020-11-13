// 人事-- 人事
import { Component, ViewChild } from '@angular/core';
import { Platform,NavController, Content } from 'ionic-angular';
import { PersAddPage } from '../persAdd/persAdd';
import { HttpService } from '../../../providers/http-service';
import { Utils } from '../../../providers/utils';
import { pager } from '../../../providers/constants';


@Component({
	selector: 'page-persList',
	templateUrl: 'persList.html' 
})

export class PersListPage {
	
	items: Array<any> = [];        //数据源
	personCount: number = 0;       //人员总数
	serverUrl: string = '';        //服务器地址
	user: any;                     //用户信息
	filter:string = '';
	isLast:boolean;
	lang:string = 'zh';

	@ViewChild(Content) myContent: Content;

	/**
	 * 查询数据
	 * @param  {Event} ev: any           [事件对象]
	 * @return {void} 
	 */
	search(ev: any) {
		this.query({},true).then(rep => {
			this.myContent.scrollToTop(100);
		}, err=>{});
    }

	/**
	 * 新增人员
	 */
	addPerson() {
		this.navCtrl.push(PersAddPage);
	}

	/**
	 * 下拉刷新数据
	 * @param  {any} event 
	 * @return {void}
	 */
	doRefresh(event) {
		this.filter = '';
		this.utils.beforeRefresh('page-persList');
		this.query(null, true).then(res=>{
			event.complete();
			this.utils.afterRefresh('page-persList');
		}, err => {
			event.complete();
			this.utils.afterRefresh('page-persList');
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
		        this.query(pager({}, this.items.length),true, true).then(res => {
		        	resolve();
		        }, err => {
		        	resolve();
		        });
		    }, 500);
	    });
	}

	/**
	 * 显示信息详情页面
	 * @param  {any} item [人员信息]
	 * @return {void}  
	 */
	showDetail(item) {
		this.navCtrl.push(PersAddPage, item);
	}

	/**
	 * 初始化数据项
	 * @param  {Array<any>} _items[数据项]
	 * @return {void}
	 */
	private _initItems(_items?: Array<any>) {
		_items = _items || this.items;
		_items.forEach(item => {
			if(item['photoImg']) {
				item['photoImg'] = this.utils.appendUrl(this.serverUrl, item['photoImg']);
				
			} else {
				item['photoImg'] = this.utils.appendUrl(this.serverUrl, 'pers/images/userImage.gif');
				
			}
		})
	}

	/**
	 * 查询人员
	 * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
	 * @param  {boolean} hideLoad [隐藏加载样式]
	 * @param  {boolean} append   [追加数据]
	 * @return {Promise<any>}     
	 */
	query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
		this.isLast = false;
		if(!params) {
			params = pager({username: this.user.username, filter:this.filter});
		} else {
			params = Object.assign(pager({username: this.user.username, filter:this.filter}), params);
		}
		return new Promise((resolve, reject) => {
			this.http.post('app/v1/getPersonByPinOrName', params, hideLoad).then(res => {
				if(res['ret'] === 'OK') {
					if(!resolve(res) && res['data']) {
						this._initItems(res['data']['rows']);
						if(append) {
							this.items = this.items.concat(res['data']['rows']);
						} else {
							this.items = res['data']['rows'];
						}
						if(res['data']['rows'].length < params.pageSize) {
			              this.isLast = true;
			            }
						this.personCount = res['data']['totalCount'];
					}	
				} else {
					this.utils.message.error(res['message'] || res['ret']);
					reject(res);
				}
			}, err => {
				reject(err);
			})
		});
	}

	/**
	 * 删除人员
	 * @param  {any} item [要删除的人员对象]
	 * @return {void}     
	 */
	delPerson(item) {
		this.http.delConfirm().then(() => {
			this.utils.message.loading();
			this.http.post('app/v1/delRealById', { pin: item.pin }, true).then(resp => {
				if(resp['ret'] === 'OK') {
					this.utils.message.success(resp['message'] || 'COMMON_DEL_SUCCESS', 2000);
					this.query(null, true).then(rep => {}, err=>{});
				} else {
					this.utils.message.error(resp['message'] || resp['ret'] || 'COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
				}
		    }, err => {
			    this.utils.message.error('COMMON_DEL_FAILED', 2000, null, 'loader-custom loader-bg-hidden');
		    });
		});
	}

	goBack(){
	    if(this.platform.is('ios')) {
	        this.navCtrl.pop();
	    }
	}

	constructor(public navCtrl: NavController, public utils:Utils, public http: HttpService,private platform: Platform) {
		this.lang = this.utils.translate.currentLang;
		//获取登录用户和服务器信息
		this.utils.userCallback().then((u: { user: any, server: any }) => {
			this.serverUrl = u.server['address']+":"+u.server['port'];
			this.user = u.user;
			this.query(null).then(rep => {}, err=>{});
		}, err => {});
	}
}