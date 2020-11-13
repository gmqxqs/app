// 门禁-- 报表
import { Component, ViewChild } from '@angular/core'
import { Platform,NavController, Content } from 'ionic-angular'
import { AccEventPage } from '../../acc/accEvent/accEvent'
import { HttpService } from '../../../providers/http-service'
import { AccSearchEventPage } from '../../acc/accSearchEvent/accSearchEvent'
import { Utils } from '../../../providers/utils';
import { pager } from '../../../providers/constants';

@Component({
	selector: 'page-accReport',
	templateUrl: 'accReport.html' 
})

export class AccReportPage {
	items: any;
	public totalCount: number = 0;
	searchItems: any;
	filters:any='';
	doorId:any='';
	startTime:any='';
	endTime:any='';
	isLast:boolean;
	@ViewChild(Content) myContent:Content;
	
	resetContent() {
		this.myContent.scrollToTop(100);
	}

	showDetail(item) {
		this.navCtrl.push(AccEventPage,item);
	}

	initializeItems(){
		this.query();
	}

  	/**
	 * 下拉刷新数据
	 * @param  {any} event 
	 * @return {void}
	 */
	doRefresh(event) {
		this.filters = '';
		this.doorId='';
		this.startTime='';
		this.endTime='';
		this.utils.beforeRefresh('page-accReport');
		this.isLast = false;
		this.query(null, true).then(res=>{
			setTimeout(() => {
				event.complete();
				this.utils.afterRefresh('page-accReport');
			}, 2000);
			
		}, err => {
			setTimeout(() => {
				event.complete();
				this.utils.afterRefresh('page-accReport');
			}, 2000);
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
		        this.query(pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime,"doorId":this.doorId}, this.items.length),true, true).then(res => {
		        	resolve();
		        }, err => {
		        	resolve();
		        });
		    }, 500);
	    });
	}

	/**
	 * 查询报表
	 * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
	 * @param  {boolean} hideLoad [隐藏加载样式]
	 * @param  {boolean} append   [追加数据]
	 * @return {Promise<any>}     
	 */
	query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
		this.isLast = false;
		if(!params) {
			params = pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime,"doorId":this.doorId});
		} else {
			params = Object.assign(pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime,"doorId":this.doorId}), params);
		}
		return new Promise((resolve, reject) => {
			this.http.post('app/v1/getReportByFilters', params, hideLoad).then(res => {
				if(res['ret'] === 'OK') {
					if(!resolve(res) && res['data']) {
						if(append) {
							this.items = this.items.concat(res['data']['rows']);
						} else {
							this.items = res['data']['rows'];
						}
						if(res['data']['rows'].length < params.pageSize) {
			              this.isLast = true;
			            }
						this.totalCount = res['data']['totalCount'];
					}	
				} else {
					this.utils.message.error(res['message'] || res['ret']);
				}
			}, err => {
				reject(err);
			})
		});
	}


	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}

  	searchEvent(){
		this.navCtrl.push(AccSearchEventPage, this);
	}

	constructor(public navCtrl: NavController, public http: HttpService, public utils:Utils,private platform: Platform) {
		this.initializeItems();	
	}
}