// ÃÅ½û-- 
import { Component, ViewChild } from '@angular/core';
import { Platform,NavController, NavParams, Content } from 'ionic-angular';
import { HttpService } from '../../../providers/http-service'
import { AccSearchEventPage } from '../../acc/accSearchEvent/accSearchEvent'
import { AccEventPage } from '../../acc/accEvent/accEvent'
import { Utils } from '../../../providers/utils';
import { pager } from '../../../providers/constants';

@Component({
	selector: 'page-accDoorReport',
	templateUrl: 'accDoorReport.html' 
})

export class AccDoorReportPage {
	items: any;
	door:any;
	filters:any='';
	doorId:any='';
	startTime:any='';
	endTime:any='';

	@ViewChild(Content) myContent:Content;
	
	resetContent() {
		this.myContent.scrollToTop(100);
	}

	initializeItems(door){
		this.doorId = door.id;
		this.query(null).then(res => {}, err => {});
	}

	showDetail(item){
		this.navCtrl.push(AccEventPage, item);
	}

	/**
	 * 下拉刷新数据
	 * @param  {any} event 
	 * @return {void}
	 */
	doRefresh(event) { 
		this.filters = '';
		//this.doorId='';
		this.startTime='';
		this.endTime='';
		this.utils.beforeRefresh('page-accDoorReport');
		this.query(null, true).then(res=>{
			setTimeout(() => {
				event.complete();
				this.utils.afterRefresh('page-accDoorReport');
			}, 2000);
		}, err => {
			setTimeout(() => {
				event.complete();
				this.utils.afterRefresh('page-accDoorReport');
			}, 2000);
		})
	}

  /**
   * 上拉加载数据
   * @return {Promise<any>}
   */
	doInfinite(): Promise<any> {
	    return new Promise((resolve) => {
		    setTimeout(() => {
		        this.query(pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime,"doorId":this.door.id}, this.items.length),true, true).then(res => {
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
		if(!params) {
			params = pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime,"doorId":this.door.id});
		} else {
			params = Object.assign(pager({"filters":this.filters,"startTime":this.startTime,"endTime":this.endTime,"doorId":this.door.id}), params);
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
					}	
				} else {
					this.utils.message.error(res['message'] || res['ret']);
				}
			}, err => {
				reject(err);
			})
		});
	}

  	searchEvent(){
		this.navCtrl.push(AccSearchEventPage, this);
	}

	goBack(){
		if(this.platform.is('ios')) {
    		this.navCtrl.pop();
    	}
	}
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpService, public utils:Utils,private platform: Platform) {
		this.door = this.navParams.data;
		this.doorId = this.navParams.data.id;
		this.initializeItems(this.navParams.data);
	}
}