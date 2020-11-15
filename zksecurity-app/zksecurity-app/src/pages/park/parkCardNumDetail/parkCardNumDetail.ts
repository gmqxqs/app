/**
 * Created by DELL on 2017/8/1.
 */
// 停车场-- 固定车辆授权详情
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../providers/http-service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ParkEntranceAreaPage } from "../parkEntranceArea/parkEntranceArea";
import { Utils } from "../../../providers/utils";
import {ParkCarSpacePage} from "../parkCarSpace/parkCarSpace";

@Component({
  selector: 'page-parkCardNumDetail',
  templateUrl: 'parkCardNumDetail.html'
})

export class ParkCardNumDetailPage {

  car:any={};
  parkEntranceAreaName :string ='';
  parkEntranceAreaId:any;
  cardNumForm: FormGroup;
  item:any;
  entranceAreaId:any;
  entranceAreaName: any;
  id:any;
//车场模式
  parkingLotModel:any;
//车位号
  space: any = {};
  spaceName:any;
  displayParkingSpace:any;

  customCurrency:any = "$";

goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder,public http: HttpService,  public utils: Utils,private platform: Platform) {
    this.id  = this.navParams.data.id;
    //获取车场模型
    this.http.post('app/v1/getParkingLotModel', {}, true).then((resp: { data?: any }) => {
      if (resp.data) {
        this.parkingLotModel = resp.data.parkingLotModel;
      }
    }, resp => {});
    this.http.post('app/v1/getParkParams', {}, true).then((resp: any) => {
      if (resp) {
        this.customCurrency = resp.data.customCurrency;
        this.displayParkingSpace = typeof(resp.data.displayParkingSpace) != "undefined" ? resp.data.displayParkingSpace : 'true';
      }
    }, resp => { });
    this.cardNumForm = formBuilder.group({
      id: [''],
      personId: [''],
      personName: [''],
      carNumberId: [''],
      carNumber: [''],
      parkSpaceId:[''],
      parkSpaceName:[''],
      entranceAreaId:[''],
      entranceAreaName: [''],
      parkCarTypeId: [''],
      parkCarTypeName: [''],
      stratTime: [''],
      endTime: [''],
      debt: [''],
    });
    this.http.post('app/v1/getParkAuthorizeById', {id: this.id}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.car = resp.data;
        this.cardNumForm.controls['id'].setValue(this.car.id );
        this.cardNumForm.controls['personId'].setValue(this.car.personId );
        this.cardNumForm.controls['carNumberId'].setValue(this.car.carNumberId );
        this.cardNumForm.controls['parkSpaceId'].setValue(this.car.parkSpaceId );
        this.cardNumForm.controls['parkCarTypeId'].setValue(this.car.parkCarTypeId );
        this.cardNumForm.controls['entranceAreaId'].setValue(this.car.entranceAreaId );
        this.cardNumForm.controls['stratTime'].setValue(this.car.stratTime );
        this.cardNumForm.controls['endTime'].setValue(this.car.endTime );
        this.cardNumForm.controls['debt'].setValue(this.car.debt );
        this.spaceName=this.car.parkSpaceName;
      }
    }, err => {});
  }

  entranceArea(){
    this.navCtrl.push(ParkEntranceAreaPage,{contactsCallback: this.entranceAreaEditCallback,entranceAreaName:this.car.entranceAreaName, parkSpaceId: this.cardNumForm.controls['parkSpaceId'].value});
  }

  entranceAreaEditCallback = (params)=>{
    return new Promise((resolve,reject)=>{
      if (typeof (params)!='undefined'){
        this.item=params;
        this.parkEntranceAreaId=this.item.carKey;
        this.car.entranceAreaName=this.item.carValue;
        this.cardNumForm.controls['entranceAreaId'].setValue(this.parkEntranceAreaId );
        resolve('ok');
      }else {
        reject(Error('error'));
      }
    });
  };

  save(){
    if(this.checkData()){
      this.http.post('app/v1/editFixCarLience',this.cardNumForm.value,true).then(resp=>{
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
    //授权信息验证
    if (!this.cardNumForm.value.entranceAreaId) {
      this.utils.message.error('PARK_CARDNUM_MSG6');
      return false;
    }
    return true;
  }
  //车位号选择
  spaceSelection(){
    this.navCtrl.push(ParkCarSpacePage,{spaceCallback: this.spaceCallback,id:this.cardNumForm.value.id})
  }

  spaceCallback= (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.space = params;
        this.spaceName = this.space.parkSpaceName;
        if (this.cardNumForm.value.parkSpaceId != this.space.parkSpaceId) {
          this.item = { };
          this.parkEntranceAreaId = false;
          this.car.entranceAreaName = '';
          this.cardNumForm.controls['entranceAreaId'].setValue(this.parkEntranceAreaId);
        }
        this.cardNumForm.controls['parkSpaceId'].setValue(this.space.parkSpaceId);
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };
}
