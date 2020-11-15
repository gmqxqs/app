import { Injectable } from '@angular/core';
import { NavController,App } from 'ionic-angular';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ZKMessage } from './zk-message';
import { Utils } from './utils';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { LoginPage } from '../pages/base/login/login';
import { AttQrCodePage } from '../pages/att/attQrCode/attQrCode';
import { NetworkPage } from '../pages/base/network/network';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class HttpService {
  url: string = '';

  defParams:{token:string, regCode:string};
  oldBrightValue:any;
  constructor(public appCtrl: App,public http: Http, public storage: Storage,  public zkmessage: ZKMessage, public utils:Utils) {
    this.defParams = {token:'', regCode: ''};
    this.initToken();
  }

  delConfirm(msg:string = 'COMMON_DEL_MSG'): Promise<any> {
    return new Promise((resolve) => {
      this.utils.msgBox.confirm(msg).then(() => {
        resolve();
      }, err => {});
    });
  }

  initToken() {
    this.storage.get('SERVER').then(server=> {
      if(server && server['address'] && server['port']) {
          this.url = server.address +':'+ server.port;
          this.defParams.regCode = server.barcode;
      } 
      this.storage.get('USER').then(user => {
        if(user && user['username']) {
           this.defParams.token = user.token;
          } 
      }, err => {});
    }, err=>{})
  }

  resetToken() {
    this.utils.userCallback().then((u:{user?:{token?:string},server?:{address?:string,barcode?:string}}) => {
      if(u.user) {
        u.user.token = '';
      }
      this.storage.set('USER', u.user);
      this.defParams.token = '';
    }, err=>{})
  }

  private _getURL(endpoint:string) {
    if(endpoint.indexOf('http')===0 || this.url === '') {
      return endpoint;
    } else {
      if(this.url.indexOf('http') === -1) {
        return 'https://'+ this.url+ '/' + endpoint;
      }
      return this.url+ '/' + endpoint;
    }
    //return '/' + endpoint;
  }



  /**
   * 设置服务器路径
   * @param {[type]} u:string 服务器路径
   */
  setUrl(u:string) {
    this.url = u;
  }

  /**
   * GET请求
   * @param  {[type]} endpoint:     string         请求路径
   * @param  {[type]} params?:      any            请求参数
   * @param  {[type]} hideLoading?: boolean        隐藏处理消息提示框
   * @param  {[type]} options?:     RequestOptions 请求配置
   * @return {[type]}               Promise
   */
  get(endpoint: string, params?: any, hideLoading?: boolean, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    if(params) { 
      Object.assign(params, this.defParams);
    } else {
      params = JSON.parse(JSON.stringify(this.defParams));
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return new Promise((resolve, reject) => {
      if(!hideLoading) {
        this.zkmessage.loading();
      }
      this.http.get(this._getURL(endpoint), options).subscribe(resp=> {
        resolve(resp);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      }, err=>{
        reject(err);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      });
    });
  }

  /**
   * POST请求
   * @param  {[type]} endpoint:     string         请求路径
   * @param  {[type]} body:         any            请求体
   * @param  {[type]} hideLoading?: boolean        隐藏处理消息提示框
   * @param  {[type]} options?:     RequestOptions 请求配置
   * @return {[type]}               Promise
   */
  post(endpoint: string, body: any, hideLoading?: boolean, timeoutNum:number=15000, options?: RequestOptions, timeoutTip?:boolean) {
   
    return new Promise((resolve, reject) => {
     // this.session.session(endpoint).then(() => {
        if (!options) {
          let headers = new Headers({'Content-Type': 'application/json','Is-Client-Dev':'true'});
          options = new RequestOptions({ headers: headers });
    
        }
        if(body) { 
          Object.assign(body, this.defParams);
        } else {
          body = JSON.parse(JSON.stringify(this.defParams));
        }
        if(!hideLoading) {
          this.zkmessage.loading();
        }
       
        this.http.post(this._getURL(endpoint), body, options).timeout(timeoutNum).map(res=> {
          var _res = res.json();
          return (typeof(_res)=="string" ? JSON.parse(_res) : _res) || {};
        }).catch(err => {
        
         
         
          if(err['_body'] != null){
            var tempJson;
            if(typeof(err['_body'])=="string"){
               tempJson = JSON.parse(err['_body']);
               console.log("tempJson:",tempJson);
               console.log(tempJson['success']);
               if(tempJson['success'] != null){
                  if(tempJson['success'] == false){
                     this.utils.message.error('LOGINE_STATUS_INVALID', 3000);
                      let activeNav: NavController = this.appCtrl.getActiveNav();
                     let activeVC = activeNav.getActive();
                      let page = activeVC.instance;
                       if(page instanceof AttQrCodePage){
                        clearInterval(page.userInfoTimer);
                        clearInterval(page.timer);
                        page.userInfoTimer = null;
                        page.timer = null;
                     }
                     activeNav.pop();
                     activeNav.setRoot(LoginPage);
                  }

               }
            }
           
            
          }
          if(err['name']=='TimeoutError') {
   
            console.log("timeoutTip:",timeoutTip);
            if(!timeoutTip) {
           
              this.utils.message.closeMessage();
              setTimeout(() => {
                 
                  this.utils.message.error('NETWORK_TIMEOUT', 3000);
              }, 500);
             let activeNav: NavController = this.appCtrl.getActiveNav();
             let activeVC = activeNav.getActive();
             let page = activeVC.instance;           
             
             if (page instanceof LoginPage) {
                 
              } else if(page instanceof AttQrCodePage){
                    //console.log("网络中断1");
                    if(page.userInfoTimer != null){
                      //console.log("网络中断1userInfoTimer不为空");
                      clearInterval(page.userInfoTimer);
                      page.userInfoTimer = null;
                    }else{
                      //console.log("网络中断1userInfoTimer为空");
                    }
                    
                    activeNav.pop();
                    activeNav.setRoot(LoginPage);
                   
           
              } else if(page instanceof NetworkPage){
              
              } else{
                 activeNav.pop();
                 activeNav.setRoot(LoginPage);
              }
            }
            err['message'] = '501';
            err['ret'] = '501';
            return Observable.of<any>(err);
          }  else if(err['status']===0 || err['status'] === 400) {
            
            if(!timeoutTip) {
           
              this.utils.message.closeMessage();
              setTimeout(() => {
                 
                  this.utils.message.error('NETWORK_CLOSE', 3000);
              }, 500);
      
             let activeNav: NavController = this.appCtrl.getActiveNav();
             let activeVC = activeNav.getActive();
             let page = activeVC.instance;           
           
              if (page instanceof LoginPage) {
                  
              } else if(page instanceof AttQrCodePage){
                 
                 
               if(page.userInfoTimer != null){
                
                  clearInterval(page.userInfoTimer);
                  page.userInfoTimer = null;
                }else{
                
                }
                    
                activeNav.pop();
                activeNav.setRoot(LoginPage);
          
              } else if(page instanceof NetworkPage){
                
              } else{
                activeNav.pop();
                activeNav.setRoot(LoginPage);
              }
           
            }
            err['message'] = '502';
            err['ret'] = '502';
            return Observable.of<any>(err);
          }else {
            return Observable.throw(err);
          }
        }).subscribe(resp=> {
          resolve(resp);
          if(!hideLoading) {
            this.zkmessage.closeMessage();
          }
        }, err=>{
          reject(err);
          if(!hideLoading) {
            this.zkmessage.closeMessage();
          }
        });
      });
   // });
  }

  /**
   * PUT请求
   * @param  {[type]} endpoint:     string         请求路径
   * @param  {[type]} body:         any            请求体
   * @param  {[type]} hideLoading?: boolean        隐藏处理消息提示框
   * @param  {[type]} options?:     RequestOptions 请求配置
   * @return {[type]}               Promise
   */
  put(endpoint: string, body: any, hideLoading?: boolean, options?: RequestOptions) {
     return new Promise((resolve, reject) => {
      if(!hideLoading) {
        this.zkmessage.loading();
      }
      return this.http.put(this._getURL(endpoint), body, options).subscribe(resp=> {
        resolve(resp);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      }, err=>{
        reject(err);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      });
    });
  }

  /**
   * DELETE请求
   * @param  {[type]} endpoint:     string         请求路径
   * @param  {[type]} hideLoading?: boolean        隐藏处理消息提示框
   * @param  {[type]} options?:     RequestOptions 请求配置
   * @return {[type]}               Promise
   */
  delete(endpoint: string, hideLoading?: boolean, options?: RequestOptions) {
     return new Promise((resolve, reject) => {
      if(!hideLoading) {
        this.zkmessage.loading();
      }
      return this.http.delete(this._getURL(endpoint), options).subscribe(resp=> {
        resolve(resp);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      }, err=>{
        reject(err);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      });
    });
  }

  /**
   * PATCH请求
   * @param  {[type]} endpoint:     string         请求路径
   * @param  {[type]} body:         any            请求体
   * @param  {[type]} hideLoading?: boolean        隐藏处理消息提示框
   * @param  {[type]} options?:     RequestOptions 请求配置
   * @return {[type]}               Promise
   */
  patch(endpoint: string, body: any, hideLoading?: boolean, options?: RequestOptions) {
     return new Promise((resolve, reject) => {
      if(!hideLoading) {
        this.zkmessage.loading();
      }
      return this.http.patch(this._getURL(endpoint), body, options).subscribe(resp=> {
        resolve(resp);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      }, err=>{
        reject(err);
        if(!hideLoading) {
          this.zkmessage.closeMessage(1000);
        }
      });
    });
  }



   inPageing(page): boolean {
    //注意：(getActiveNav) is deprecated and will be removed in the next major release. Use getActiveNavs instead.
    let activeVC = this.appCtrl.getActiveNav().getActive(); 
    let newPage = activeVC.instance;
    if (newPage instanceof page) {//当前页面对讲是否是页面
      return true;
    }else{
      return false;
    }
  }
}
