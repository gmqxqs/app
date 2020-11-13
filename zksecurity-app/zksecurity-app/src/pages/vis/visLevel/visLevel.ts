// 访客-- 权限组管理
import { Component, ViewChild } from '@angular/core';
import { Platform,NavController, Content } from 'ionic-angular';
import { PopoverController } from "ionic-angular/index";
import { SelectLevelPage } from "./selectLevel/selectLevel";
import { VisLevelInfoPage } from "./visLevelInfo/visLevelInfo";
import { VisLevelMore } from "./visLevelMore/visLevelMore";
import { HttpService } from "../../../providers/http-service";
import { pager } from "../../../providers/constants";
import { Utils } from '../../../providers/utils';

@Component({
  selector: 'page-visLevel',
  templateUrl: 'visLevel.html'
})

export class VisLevelPage {
  items: any;
  id: any;
  isLast:boolean;
  criteriaCore:string='';

  @ViewChild(Content) myContent:Content;
  
  resetContent() {
    this.myContent.scrollToTop(100);
  }
  lang:string = 'zh';

  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController,
              public utils:Utils,
              public popoverCtrl: PopoverController,
              public http: HttpService,private platform: Platform) {
    this.lang = this.utils.translate.currentLang;
    this.query(null, true).then( res => {}, err => {});
  }

  /**
   * 下拉刷新数据
   * @param  {any} event
   * @return {void}
   */
  doRefresh(event) {
    this.utils.beforeRefresh('page-visLevel');
    this.query(null, true).then(res=>{
      setTimeout(() => {
        event.complete();
        this.utils.afterRefresh('page-visLevel');
      }, 2000);
      
    }, err => {
      setTimeout(() => {
        event.complete();
        this.utils.afterRefresh('page-visLevel');
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
        this.query(pager({}, this.items.length), true, true).then(res => {
          resolve();
        }, err => {
          resolve();
        });
      }, 500);
    });
  }


  /**
   * 权限组管理列表
   * @param  {any} params       [查询参数:{pageNo:1,pageSize:20,filter:'name or pin'}]
   * @param  {boolean} hideLoad [隐藏加载样式]
   * @param  {boolean} append   [追加数据]
   * @return {Promise<any>}
   */
  query(params?: any, hideLoad?: boolean, append?: boolean): Promise<any> {
    if(!params) {
      params = pager({});
    } else {
      params = pager(params);
    }
    return new Promise((resolve, reject) => {
      this.http.post('app/v1/getVisLevels', params, hideLoad
      ).then(res => {
        if (res['ret'] === 'OK') {
          if (!resolve(res) && res['data']) {
            if (append) {
              this.items = this.items.concat(res['data']);
            } else {
              this.items = res['data'];
            }
            if(res['data'].length < params.pageSize) {
                this.isLast = true;
            }
          }
        } else {}
      }, err => {});
    });
  }

  select() {
    this.navCtrl.push(SelectLevelPage, this);
  }

  more(myEvent) {
    let popover = this.popoverCtrl.create(VisLevelMore, this);
    popover.present({
      ev: myEvent
    });
  }

  selectItem(item) {
    this.id = item.visLevelId;
    this.navCtrl.push(VisLevelInfoPage, item);
  }

  // 删除权限组
  private postDelVisLevel(item) {
    this.http.post('app/v1/delVisLevel', {id: item.visLevelId}).then(res => {
      if (res['ret'] === 'OK') {
        // 循环删除本地数据
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i] == item) {
            this.items.splice(i, 1);
          }
        }
      } else {}
    }, err => {});
  }

  showAlert(item) {
    this.utils.translate.get(['VIS_LEVEL_SUREDEL']).subscribe(vals => {
       this.http.delConfirm(vals['VIS_LEVEL_SUREDEL']+ '<span>' + item.visLevelName + '</span>？').then(() => {
          this.postDelVisLevel(item);
      });
    });
  }

  refreshSearch(levelName) {
    this.query({levelName: levelName}, true).then(res => {
      this.resetContent();
    }, err => {});
  }

  refreshSelect(moduleName) {
    this.query({moduleName: moduleName}, true).then(res => {
      this.resetContent();
    }, err => {});
  }

  refreshLevel() {
    this.query(null, true).then(res => {
      this.resetContent();
    }, err => {});
  }
}
