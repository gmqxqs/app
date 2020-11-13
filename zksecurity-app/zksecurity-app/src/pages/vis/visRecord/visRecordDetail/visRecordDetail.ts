/**
 * Created by DELL on 2017/8/8.
 */
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../providers/http-service";
import { Utils } from "../../../../providers/utils";

@Component({
  selector: 'page-visRecordDetail',
  templateUrl: 'visRecordDetail.html'
})

export class VisRecordDetailPage {

  // 服务器地址
  serverUrl: any;

  // 被访人部门名称
  visitedEmpDept: any;
  // 访客公司
  visitorCompany: any;
  // 访客证件类型
  visitorCertType: any;
  // 访客证件名称
  visitorCertTypeName: any;
  // 访客证件号码
  visitorCertNumber: any;
  // 访客手机号码
  visitorPhone: any;
  //访客visEmpLastName
  visEmpLastName: any;
  // 证件照片
  visitorCertPhoto: any;
  // 进入照片
  visitorEnterPhoto: any;
  // 离开照片
  visitorExitPhoto: any;

  data: any;

  lang:string = 'zh';


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpService,
              public utils: Utils,private platform: Platform) {
    this.initData();
  }

  private initData() {
    this.data = this.navParams.data;
    this.serveData();
    this.getVisTransactionById(this.data.id);
    this.lang = this.utils.translate.currentLang;
  }

  private serveData() {
    this.serverUrl = this.http.url;
  }

  previewSrc:any;
  showPreview:boolean=false;
  closeView() {
    this.showPreview = false;
  }

  preview(img:any) {
    if(img) {
      this.showPreview = true;
      this.previewSrc = img;
    }
  }

  // 获取访客历史记录
  private getVisTransactionById(idP) {
    this.http.post('app/v1/getVisTransactionById', {
      id: idP,
    }).then(res => {
      if (res['ret'] === 'OK') {
        this.visitedEmpDept = res['data'].visitedEmpDept;
        this.visitorCompany = res['data'].visitorCompany;
        this.visitorCertType = res['data'].visitorCertType;
        this.visitorCertNumber = res['data'].visitorCertNumber;
        this.visitorPhone = res['data'].visitorPhone;
        this.visitorCertTypeName = res['data'].visitorCertTypeName;
        this.visEmpLastName = res['data'].visEmpLastName;
        if (res['data'].visitorCertPhoto) {
          this.visitorCertPhoto = this.serverUrl + '/' + res['data'].visitorCertPhoto;
        }
        if (res['data'].visitorEnterPhoto) {
          this.visitorEnterPhoto = this.serverUrl + '/' + res['data'].visitorEnterPhoto;
        }
        if (res['data'].visitorExitPhoto) {
            this.visitorExitPhoto =  this.serverUrl + '/' + res['data'].visitorExitPhoto;
        }
      }
    }, err => {});
  }
}
