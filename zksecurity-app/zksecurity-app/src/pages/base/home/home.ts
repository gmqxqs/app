import { Component, ViewChild} from '@angular/core';
import { Platform,NavController,NavParams, Slides } from 'ionic-angular';
import { ZkMenus } from '../../../providers/menus';
import { UserSettingPage } from '../userSetting/userSetting';
import { HttpService } from '../../../providers/http-service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  modules: Array<any> = [];
  index: number = 0;
  header_logo:string = 'assets/img/header_logo.png';

  @ViewChild(Slides) slides: Slides;
  @ViewChild('settingIcon') setIcon:any;

  bgPosition:boolean;
  userType:string='';
  imgLang:string='';
  booleanShow:boolean;


   

  initLogo() {
    if(this.translate.currentLang === 'zh') {
      this.imgLang = '';
      this.header_logo = 'assets/img/header_logo.png';
    } else {
      this.header_logo = 'assets/img/header_logo_en.png';
      this.imgLang = '_en';
    }


      this.storage.get('LOGINTYPE').then(type => {
        if(type) {
            if(type === 'PERS'){
              this.booleanShow = false;
            }

            if (type === 'NORMAL') {
              this.booleanShow = true;
            }          
    
          } 
      }, err => {});

    /**let zkToolBar = <HTMLElement> document.getElementById('content');

    if (zkToolBar != null) {
       zkToolBar.style.height = "8rem";
    } else {
       console.log("为空");
    
    }**/

     // if (this.platform.versions().ios.num < 11) {
     //    let navBar = <HTMLInputElement>document.getElementById('zk-nav-bar');
     //    if(navBar != null){
     //      alert("ios11以下");
     //      alert(navBar);
     //      navBar.style.margin = "100pt 0pt 0pt 0pt";
     //    }else{
     //      alert("navBar为空");
     //    }
     //  } 
      
      // if(this.platform.is('android') || this.platform.is('ios')) {
   
      //   let zkImg = <HTMLElement> document.getElementById('zkImg');
      //   if (zkImg != null) {
      //     zkImg.style.marginTop = "2rem";
      //   }
      //   let zkBtn = <HTMLElement> document.getElementById('zkBtn');
      //   if(zkBtn != null){
      //     zkBtn.style.marginTop = "2rem";
      //   }
      // }
      

      // let zk = <HTMLElement> document.getElementById('zk');
      // if(zk != null){
      //   zk.style.marginTop = "2rem";
      // }


    
  }






  openPage(page) {
    if(page.component) {
  		this.navCtrl.push(page.component, {home:this, page:page});
  	}
  }

  getSlideHeight() {
    return document.body.offsetWidth * 448/750 + 'px';
  }

  getHeaderHeight() {
    return this.setIcon.elementRef.nativeElement.clientHeight * 1.1 + 'px';
    
  }

  ionViewDidEnter() {
    this.slides.autoplayDisableOnInteraction=false;
    let ind = this.slides.realIndex;
    setTimeout(() => {
      if(ind === this.slides.realIndex) {
        this.slides.slideTo((this.slides.getActiveIndex()+1)%this.slides.length());
        this.slides.startAutoplay();
      } 
    }, this.slides.autoplay + 1000);
    this.initLogo();
    this.http.initToken();
    //this.loadMenus();

     if(this.platform.is('ios')){
         this.statusBar.styleBlackTranslucent();
         this.statusBar.overlaysWebView(true);
     } else{
         this.statusBar.styleLightContent();
         this.statusBar.overlaysWebView(true);
     }
  
  }

  goToUserSetting() {

    this.navCtrl.push(UserSettingPage);
  
  }

  group(array: Array<any>, subGroupLength: number) {
      let index = 0;
      let newArray = [];
      while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
  }

  groupModule() {
  
    this.modules.forEach(item => {
      item.children = this.group(item.children, 4);
    });

    
 
  }

   initMenus() {
    this.modules = [{
      name: 'MODULE_PERS',
      code: 'pers',
      children: [{
        name: 'persList',
        text: 'PAGE_PERSLIST'
      }, {
        name: 'persAdd',
        text: 'PAGE_PERSADD'
      }, {
        name: 'persSet',
        text: 'PAGE_PERSSET'
      }]
    }, {
      name: 'MODULE_ACC',
      code: 'acc',
      children: [{
        name: 'accMonitor',
        text: 'PAGE_ACCMONITOR'
      }, {
        name: 'accDevice',
        text: 'PAGE_ACCDEVICE'
      }, {
        name: 'accAlarm',
        text: 'PAGE_ACCALARM'
      }, {
        name: 'accReport',
        text: 'PAGE_ACCREPORT'
      }]
    }, {
      name: 'MODULE_VIS',
      code: 'vis',
      children: [{
        name: 'visReserve',
        text: 'PAGE_VISRESERVE'
      }, {
        name: 'visReserveMgr',
        text: 'PAGE_VISRESERVEMGR'
      }, {
        name: 'visLevel',
        text: 'PAGE_VISLEVEL'
      }, {
        name: 'visRecord',
        text: 'PAGE_VISRECORD'
      }, {
        name: 'visSet',
        text: 'PAGE_VISSET'
      }]
    }, {
      name: 'MODULE_PARK',
      code: 'park',
      children: [{
        name: 'parkCardNum',
        text: 'PAGE_PARKCARDNUM'
      }, {
        name: 'parkFixDelay',
        text: 'PAGE_PARKFIXDELAY'
      }, {
        name: 'parkCarSet',
        text: 'PAGE_PARKCARSET'
      }, {
        name: 'parkPavilio',
        text: 'PAGE_PARKPAVILIO'
      }, {
        name: 'parkChannel',
        text: 'PAGE_PARKCHANNEL'
      }, {
        name: 'parkInCar',
        text: 'PAGE_PARKINCAR'
      }, {
        name: 'parkChargeDetail',
        text: 'PAGE_PARKCHARGEDETAIL'
      }]
    }, {
      name: 'MODULE_ATT',
      code: 'att',
      children: [{
        name: 'attMonth',
        text: 'PAGE_ATTMONTH'
      }, {
        name: 'attCount',
        text: 'PAGE_ATTCOUNT'
      }]
    },{
      name: 'MODULE_EBADGE',
      code: 'eBadge',
      children:[{
        name: 'attEBadge',
        text: 'PAGE_ElETRONIC_BADGE'
      }]
    }]
    this.modules = this.zkMenus.getFilterMenus(this.modules);
    this.groupModule();
  }

  loadMenus() {
    if(typeof this.navParams.data.menus !== 'undefined') {
      
        this.modules = this.zkMenus.getFilterMenus(JSON.parse(JSON.stringify(this.navParams.data.menus)));
       
        this.groupModule();
    } else {
        this.storage.get('MEUNS').then(val => {
          if(val) {
           // debugger;
           
            this.modules = this.zkMenus.getFilterMenus(val);
            
            this.groupModule();
          } else {
          
            this.http.post('app/v1/queryMenus', {}, true).then(res => {
              this.modules = this.zkMenus.getFilterMenus(res['menus']);
              this.groupModule();
            }, err => {});
          }
      }, err => {});
    }
  }

  ionViewDidLoad() {
    this.http.initToken();
    this.loadMenus(); 
    
  }

 /* goBack(){
    if(this.platform.is('ios')) {
       //处理弹窗
  
        if(this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        }else{
          //退出程序
          this.msgBox.confirm('APP_EXIT').then(() => {
            alert("退出程序");
            this.platform.exitApp();
            
          }, () => {}); 
        }
      }
  }*/
  
  constructor(public navCtrl: NavController, public navParams:NavParams, public translate: TranslateService, 
    public zkMenus: ZkMenus, public storage: Storage, public http: HttpService,private statusBar: StatusBar,private platform:Platform) {
    this.bgPosition = true;
  
    //var width = screen.width;
    //console.log("width:",width);
   // alert("222222");
    
  }
}
