import { Component } from '@angular/core';
import { Platform,NavController, NavParams, Keyboard } from 'ionic-angular';
import { HomePage } from '../home/home';
import { NetworkPage } from '../network/network';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormGroup } from '@angular/forms';
import { HttpService } from '../../../providers/http-service';
import { CommonValidator } from '../../../providers/common-validator';
import { Utils } from '../../../providers/utils';
import { serverVersion } from '../../../providers/constants';
import { StatusBar } from '@ionic-native/status-bar';
import "hammerjs";
declare let cordova: any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  form: FormGroup;
  versionMsg:string='';
  version:string='';
  copyright:string;
  logo:string='assets/img/login_logo.png';
  showCopyRight:boolean = true;
  imgLang:string = 'zh';
  logintype:string;
  checkPermission:boolean = false;

  ionViewDidEnter() {
    this.http.initToken();

     if(this.platform.is('ios')){
       this.statusBar.styleBlackTranslucent();
       this.statusBar.overlaysWebView(true);
     } else{
       this.statusBar.styleLightContent();
       this.statusBar.overlaysWebView(true);
     }
     
  
  
  }

  inputFocus() {
    this.showCopyRight = false;
  }

  inputBlur() {
    this.showCopyRight = true;
   }
  ionViewDidLoad() {
    this.storage.get('OPEN_DOOR').then(v => {
      if(typeof v !== 'boolean') {
        this.storage.set('OPEN_DOOR', true);
      }
    })
    this.utils.doTimeout((c) => {
      this.initLogo();
      this.http.initToken();
      this.translate.get(['LOGIN_VERSION']).subscribe(values => {
        this.versionMsg = this.utils.stringFormat(values['LOGIN_VERSION'], serverVersion);
      });
    }, 50, 100);
  }


  loginUser(){
    this.storage.set('LOGINTYPE','PERS').then(() => {
      this.login();
    });
    
    
  }

  chooseAdmin(){
    const adminspan = (document.getElementById('adminspan') as HTMLInputElement);
    if(adminspan != null){
      adminspan.style.color="#FFF";
    } 
    const userspan = (document.getElementById('userspan') as HTMLInputElement);
    
    if(userspan != null){
      userspan.style.color="#5a616d";
    }
    this.storage.set('LOGINTYPE','NORMAL');
   
  }

  chooseUser(){
    const userspan = (document.getElementById('userspan') as HTMLInputElement);
    if(userspan != null){
       userspan.style.color="#FFF";
        console.log("userspan:",userspan);
    }
    const adminspan = (document.getElementById('adminspan') as HTMLInputElement);
    if(adminspan !=null){
       
       adminspan.style.color="#5a616d";
    }
    this.storage.set('LOGINTYPE','PERS');
    console.log("logintype:",this.storage.get('LOGINTYPE'));
  }

  loginAdmin(){
    
    this.storage.set('LOGINTYPE','NORMAL').then(() => {
      this.login();
    });
  }

  login() {
    if(this.keyboard.isOpen()) {
      this.keyboard.close();
    }
     //判断网络设置
    if(this.http.url === '') {
      this.utils.msgBox.confirm('LOGIN_ERR_MSG3').then(() => {
        this.networkSet();
      }, () => {});
      return;
    }
    //判断权限设置
    this.storage.get('permission').then(v=>{
        if(v == null){
          if(this.platform.is('ios')) {
              if (!this.cv.valid(this.form)) {
                return;
              }
              this.utils.message.loading('LOGIN_MSG', -1,null,'loader-custom loader-bg-hidden');
              this.chooseLogin();
          } else{
             cordova.plugins.BrightPlugin.getCheckPermission("",(success)=>{
                if (success == "false") {
                   this.utils.msgBox.confirm('LOGIN_ERR_MSG5').then(() => {
                        cordova.plugins.BrightPlugin.checkPermission();
                    }, () => {});

                    this.storage.set('permission','true').then(() => {
                      
                    });
                    
                    
                }
            },null);
              
           }
          
        }else{
        //通过cv的valid()方法判断是否校验通过
          if (!this.cv.valid(this.form)) {
            return;
          }
          this.utils.message.loading('LOGIN_MSG', -1,null,'loader-custom loader-bg-hidden');
          this.chooseLogin();
        }
      
    });

  }

  chooseLogin(){
      this.storage.get('LOGINTYPE').then((logintype) => {
              if(logintype){
                  this.form.value.loginType = logintype;
                  this.http.post('app/v1/login', this.form.value,true).then(res=> {
                  if (res['ret'] === 'OK') {
                    this.utils.message.closeMessage();
                    if(res['user']) {
                      console.log("user:",res['user']);
                      this.storage.set('USER', Object.assign(this.form.value, res['user']));
                      this.storage.set('supportElecBadge',res['supportElecBadge']);
                      this.storage.set('PASSWORD',this.form.value.password);
                    } else {
                      this.storage.set('USER', this.form.value);
                      this.storage.set('supportElecBadge',res['supportElecBadge']);
                      this.storage.set('PASSWORD',this.form.value.password);
                    }
                    this.http.initToken();
                    this.http.defParams.token = res['user']['token'];
                    console.log(res['menus']);
                    this.storage.set('MEUNS', res['menus']);
                    if(this.navCtrl.length() > 1) {
                       if(typeof this.navParams.data.callback === 'function') {
                          this.navParams.data.callback();
                       }
                       this.navCtrl.pop();

                    } else {
                        this.navCtrl.setRoot(HomePage, {menus: res['menus']});
                    }
                  } else {
                    this.utils.message.error(res['message']||res['ret'], 3000,null,'loader-custom loader-bg-hidden');
                  }
                }, err => {
                   console.log('登陆失败');
                   this.utils.message.error('LOGIN_FAILED', 3000,null,'loader-custom loader-bg-hidden');
                });
              }
             
          });
  }

  networkSet() {
    this.navCtrl.push(NetworkPage);
  }

  initForm() {
    //通过cv创建表单验证
    this.form = this.cv.validate({
      rules:{//校验规则
        username:[Validators.required],
        password:[Validators.required]
      },
      message: {//提示消息
        username: 'LOGIN_ERR_MSG1',
        password: 'LOGIN_ERR_MSG2'
      },
      noStatusChange:true//关闭状态变更触发提示
    });


    //设置初始值
    this.storage.get('USER').then(val=>{
      if(val) {
        console.log(val);
        this.form.controls['username'].setValue(val.username || '');
        this.form.controls['password'].setValue(val.password || '');
      }
    })
  }

  initLogo() {
    if(this.translate.currentLang === 'zh') {
      this.imgLang = 'zh';
      this.logo = 'assets/img/login_logo.png';
    } else {
      this.imgLang = 'en';
      this.logo = 'assets/img/login_logo_en.png';
    }
  }

  initVersion() {
    this.storage.get('version').then(v => {
      if(v) {
         this.version = v;
        
      } else {
        setTimeout(() => {
          this.initVersion()
        }, 50);
      }
    })
  }



  
  constructor(public navCtrl: NavController,public navParams:NavParams,public keyboard:Keyboard,public storage: Storage,public translate: TranslateService,public utils: Utils,public http: HttpService,public cv:CommonValidator,private platform: Platform,private statusBar: StatusBar) {
    this.initLogo();
    this.initForm();
    this.http.initToken();
    this.initVersion();
    this.copyright = '2008-'+new Date().getFullYear();
    this.storage.get('LOGINTYPE').then((logintype) => {
          if(logintype){
              if(logintype == 'PERS'){
                   this.chooseUser();
              }else{
                   this.chooseAdmin();
              }

          } else{
             this.chooseAdmin();
          }
     });
 
 

  }


  



}
