import { Injectable } from '@angular/core';

//pages
import { PersListPage } from '../pages/pers/persList/persList';
import { PersAddPage } from '../pages/pers/persAdd/persAdd';
import { PersSetPage } from '../pages/pers/persSet/persSet';
import { AccAlarmPage } from '../pages/acc/accAlarm/accAlarm';
import { AccDevicePage } from '../pages/acc/accDevice/accDevice';
import { AccMonitorPage } from '../pages/acc/accMonitor/accMonitor';
import { AccReportPage } from '../pages/acc/accReport/accReport';
import { VisLevelPage } from '../pages/vis/visLevel/visLevel';
import { VisRecordPage } from '../pages/vis/visRecord/visRecord';
import { VisReservePage } from '../pages/vis/visReserve/visReserve';
import { VisReserveMgrPage } from '../pages/vis/visReserveMgr/visReserveMgr';
import { VisSetPage } from '../pages/vis/visSet/visSet';
import { AttCountPage } from '../pages/att/attCount/attCount';
import { AttMonthPage } from '../pages/att/attMonth/attMonth';
import { ParkCardNumPage } from '../pages/park/parkCardNum/parkCardNum';
import { ParkCarSetPage } from '../pages/park/parkCarSet/parkCarSet';
import { ParkChannelPage } from '../pages/park/parkChannel/parkChannel';
import { ParkChargeDetailPage } from '../pages/park/parkChargeDetail/parkChargeDetail';
import { ParkFixDelayPage } from '../pages/park/parkFixDelay/parkFixDelay';
import { ParkInCarPage } from '../pages/park/parkInCar/parkInCar';
import { ParkPavilioPage } from '../pages/park/parkPavilio/parkPavilio';
import { TranslateService } from '@ngx-translate/core';
import { AttQrCodePage } from '../pages/att/attQrCode/attQrCode';

@Injectable()
export class ZkMenus {

	menus:any;
	
	constructor(public translate: TranslateService) {
		
		this.initMenus();
		//this.intNoModuleMenus();
	}

	/**
	 * 过滤获取菜单
	 * @param  {[type]} items: Array<any>    菜单数组
	 * @return {[type]}        [description]
	 */
	getFilterMenus(items: Array<{code?:string,children?:Array<any>}>) {
		
		//debugger;
		items.forEach(module => {
			module['name']='MODULE_' + module['code'].toUpperCase();
			module['children'].forEach((child:{icon?: string, name?: string, color?: string})=> {
				child['icon'] = child['icon'] || this.menus[module['code']][child['name']]['icon'];
				child['color'] = child['color'] || this.menus[module['code']][child['name']]['color'];
				child['component'] = this.menus[module['code']][child['name']]['component'];
				child['text'] = this.menus[module['code']][child['name']]['text'];
				if(child['name']==='parkChargeDetail' && this.translate.currentLang !== 'zh') {
					child['icon'] = 'park-chargedetails_1';
				}
			});
			
		});
		var eBadgeItem = null;
		var attItem = null;
		for (var i = 0; i < items.length; i++) {
			if (items[i].code == "eBadge") {
				eBadgeItem = items[i];
			}
			if (items[i].code == "att") {
				attItem = items[i];
			}
		}

		if (attItem != null) {
			for (var j = 0; j < items.length; j++) {
				if (items[j].code == "att" && eBadgeItem != null) {
					items[j].children.push(eBadgeItem.children[0]);
				}
			}
			var newItems = new Array();
			for (var k = 0; k < items.length; k++) {
				if (items[k].code != "eBadge") {
					newItems.push(items[k]);
				}
			}
			return newItems;
		} else{
			return items;
		}
		
		
	}
	

	private initMenus() {
		
		this.menus = {
      		pers: {//人事模块
      			persList: {//人事
			        icon: 'person-admin',
			        component: PersListPage,
			        text: 'PAGE_PERSLIST',
			        color: '#e9745d'
			    }, 
			    persAdd: {//新增
			        icon: 'person-add',
			        component: PersAddPage,
			        text: 'PAGE_PERSADD',
			        color: '#7ac143'
			    }, 
			    persSet: {//设置
			        icon: 'person-setting',
			        component: PersSetPage,
			        text: 'PAGE_PERSSET',
			        color: '#fdbc44'
      			}
    		}, 
      		acc: {//门禁模块
      			accMonitor: {//实时监控
			        icon: 'acc-camera',
			        component: AccMonitorPage,
			        text: 'PAGE_ACCMONITOR',
			        color: '#29a9ec'
      			}, 
      			accDevice: {//门禁设备
			        icon: 'door',
			        component: AccDevicePage,
			        text: 'PAGE_ACCDEVICE',
			        color: '#00bf8f'
      			}, 
      			accAlarm: {//报警
			        icon: 'alarm',
			        component: AccAlarmPage,
			        text: 'PAGE_ACCALARM',
			        color: '#e9745d'
      			}, 
      			accReport: {//报表
			        icon: 'acc-report',
			        component: AccReportPage,
			        text: 'PAGE_ACCREPORT',
			        color: '#bd4bfe'
      			}
    		}, 
      		vis: {//访客模块
      			visReserve: {//预约
			        icon: 'vappointment',
			        component: VisReservePage,
			        text: 'PAGE_VISRESERVE',
			        color: '#7ac143'
			    }, 
			    visReserveMgr: {//预约管理
			        icon: 'appoint',
			        component: VisReserveMgrPage,
			        text: 'PAGE_VISRESERVEMGR',
			        color: '#fdbc44'
			    }, 
			    visLevel: {//权限组管理
			        icon: 'rightgroup',
			        component: VisLevelPage,
			        text: 'PAGE_VISLEVEL',
			        color: '#29a9ec'
			    }, 
			    visRecord: {//访客历史记录
			        icon: 'historyrecords',
			        component: VisRecordPage,
			        text: 'PAGE_VISRECORD',
			        color: '#00bf8f'
			    }, 
			    visSet: {//参数设置
			        icon: 'vis-setting',
			        component: VisSetPage,
			        text: 'PAGE_VISSET',
			        color: '#bd4bfe'
      			}
		    }, 
	      	park: {//停车场模块
	      		parkCardNum: {//车牌授权
			        icon: 'park-auth',
			        component: ParkCardNumPage,
			        text: 'PAGE_PARKCARDNUM',
			        color: '#29a9ec'
		      	}, 
		      	parkFixDelay: {//固定车延期
			        icon: 'fixeddelay',
			        component: ParkFixDelayPage,
			        text: 'PAGE_PARKFIXDELAY',
			        color: '#e9745d'
			    }, 
      			parkPavilio: {//岗亭
			        icon: 'park-watchhouse',
			        component: ParkPavilioPage,
			        text: 'PAGE_PARKPAVILIO',
			        color: '#bd4bfe'
			    }, 
			    parkChannel: {//通道
			        icon: 'passageway',
			        component: ParkChannelPage,
			        text: 'PAGE_PARKCHANNEL',
			        color: '#00bf8f'
			    }, 
			    parkInCar: {//场内车辆
			        icon: 'prkingcar',
			        component: ParkInCarPage,
			        text: 'PAGE_PARKINCAR',
			        color: '#fdbc44'
			    }, 
			    parkChargeDetail: {//收费明细
			        icon: 'charge',
			        component: ParkChargeDetailPage,
			        text: 'PAGE_PARKCHARGEDETAIL',
			        color: '#00bf8f'
			    },
			    parkCarSet: {//车场参数设置
			        icon: 'park-setting',
			        component: ParkCarSetPage,
			        text: 'PAGE_PARKCARSET',
			        color: '#7ac143'
      			}
		    }, 
	      	att: {//考勤模块
	      		attMonth: {//考勤月历
			        icon: 'att-reports',
			        component: AttMonthPage,
			        text: 'PAGE_ATTMONTH',
			        color: '#e9745d'
			    }, 
			    attCount: {//考勤统计
			        icon: 'att-statistics',
			        component: AttCountPage,
			        text: 'PAGE_ATTCOUNT',
			        color: '#7ac143'
			    },
			    attEBadge:{
      				icon:'elecCard',
      				component: AttQrCodePage,
			        text: 'PAGE_ElETRONIC_BADGE',
			        color: '#fdbc44'
      			}
      			
		    },
		    eBadge:{
		    	attEBadge:{
      				icon:'elecCard',
      				component: AttQrCodePage,
			        text: 'PAGE_ElETRONIC_BADGE',
			        color: '#fdbc44'
      			}
		    }
		}
	}
}