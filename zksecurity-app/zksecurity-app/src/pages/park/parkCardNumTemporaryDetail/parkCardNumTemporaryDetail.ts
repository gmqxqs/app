/**
 * Created by DELL on 2017/8/1.
 */
// 停车场-- 临时车辆授权详情
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "../../../providers/http-service";
import { Utils } from "../../../providers/utils";
import { ParkEntranceAreaPage } from "../parkEntranceArea/parkEntranceArea";

@Component({
  selector: 'page-parkCardNumTemporaryDetail',
  templateUrl: 'parkCardNumTemporaryDetail.html'
})

export class ParkCardNumTemporaryDetailPage {

  car: any;
  cardNumTemporaryForm: FormGroup;
  parkEntranceAreaName :string ='';
  parkEntranceAreaId:any;
  item:any;


goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public formBuilder: FormBuilder,public http: HttpService, public utils: Utils,private platform: Platform) {
    this.car = this.navParams.data;
    this.cardNumTemporaryForm = formBuilder.group({
      id: [''],
      entranceAreaName: [''],
      parkCarTypeId: [''],
      parkCarTypeName:[''],
    });
    this.http.post('app/v1/getParkAuthorizeById', {id: this.car.id}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.car = resp.data;
        this.cardNumTemporaryForm.controls['id'].setValue(this.car.id );
        this.cardNumTemporaryForm.controls['entranceAreaName'].setValue(this.car.entranceAreaName );
        this.cardNumTemporaryForm.controls['parkCarTypeId'].setValue(this.car.parkCarTypeId );
        this.cardNumTemporaryForm.controls['parkCarTypeName'].setValue(this.car.parkCarTypeName );
        this.parkEntranceAreaId=this.car.entranceAreaId;
      }
    }, err => {});
  }

  entranceArea(){
    this.navCtrl.push(ParkEntranceAreaPage,{contactsCallback: this.entranceAreaEditCallback,entranceAreaName:this.car.entranceAreaName});
  }

  entranceAreaEditCallback = (params)=>{
    return new Promise((resolve,reject)=>{
      if (typeof (params)!='undefined'){
        this.item=params;
        this.parkEntranceAreaId=this.item.carKey;
        this.car.entranceAreaName=this.item.carValue;
        console.log(this.parkEntranceAreaId);
        resolve('ok');
      }else {
        reject(Error('error'));
      }
    });
  };

  save(){
    if(this.checkData()){
      this.http.post('app/v1/editTempCarLience',{entranceAreaId:this.parkEntranceAreaId}).then(resp=>{
        if (resp['ret'] === 'OK') {
          this.utils.message.success(resp['data'],500);
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            this.navParams.data.refresh();
            this.navCtrl.pop();
          })
        } else{
          this.utils.message.error('COMMON_OP_FAILED');
        }
      }, resp=>{
        this.utils.message.error('COMMON_OP_FAILED');
      });
    }
  }

  checkData(): boolean {
    // 新增临时车信息验证
    if (!this.parkEntranceAreaId) {
      this.utils.message.error('PARK_CARDNUM_MSG6');
      return false;
    }
    return true;
  }
}
