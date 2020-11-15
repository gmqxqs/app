/**
 * Created by DELL on 2017/8/4.
 */
// 停车场-- 临时车辆授权详情
import { Component } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "../../../providers/http-service";
import { ParkEntranceAreaEditPage } from "../parkEntranceAreaEdit/parkEntranceAreaEdit";
import { Utils } from "../../../providers/utils";
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-parkPavilioDetail',
  templateUrl: 'parkPavilioDetail.html'
})

export class ParkPavilioDetailPage {

  car: any;
  id: any;
  pavilioForm: FormGroup;
  parkEntranceAreaId: any;
  parkEntranceAreaName: any;
  parkParkingAreaType: any;
  ip: any;
  item: any;
  // yPavolio = "0";
  // tPavolio = "0";
  wideitem:any;
  check:boolean=true;
  titilName:any;

  // items = [
  //   {id: 1, text: 'PARK_PAVILIO_WAYT', value: "0"},
  //   {id: 2, text: 'PARK_PAVILIO_WAYY', value: "0"}
  // ];


goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder, public http: HttpService, public utils: Utils,public translate :TranslateService,private platform: Platform) {
    this.id = this.navParams.data.id;
    this.pavilioForm = formBuilder.group({
      id: [''],
      name: [''],
      ipAddress: [''],
      parkEntranceAreaId: [''],
      parkEntranceAreaName: [''],
      parkParkingLotId: [''],
      parkParkingLotName: [''],
      parkParkingAreaId: [''],
      parkParkingAreaName: [''],
      temporaryCarFree: [false],
      replacement: [true],
      opengagebyhandFlag: [true],
      tempcarQuickoutFlag: [true],
      // fingerVerificationflag: [true],
      // widechannelFlag: [false],
      onechannelFlag: [false],
    });
    this.translate.get(['PARK_PAVILIO_DETAIL','PARK_PAVILIO_ADD']).subscribe(vals => {
      if (this.id) {
        this.titilName=vals['PARK_PAVILIO_DETAIL'];
        this.http.post('app/v1/getParkPavilioById', {id: this.id}).then((resp: { data?: any }) => {
          if (resp.data) {
            this.pavilioForm.controls['id'].setValue(resp.data.id);
            this.pavilioForm.controls['name'].setValue(resp.data.name);
            this.pavilioForm.controls['ipAddress'].setValue(resp.data.ipAddress);
            this.pavilioForm.controls['parkEntranceAreaId'].setValue(resp.data.parkEntranceAreaId);
            this.pavilioForm.controls['parkEntranceAreaName'].setValue(resp.data.parkEntranceAreaName);
            this.pavilioForm.controls['parkParkingLotName'].setValue(resp.data.parkParkingLotName);
            this.pavilioForm.controls['parkParkingAreaName'].setValue(resp.data.parkParkingAreaName);
            this.pavilioForm.controls['temporaryCarFree'].setValue(resp.data.temporaryCarFree);
            this.pavilioForm.controls['replacement'].setValue(resp.data.replacement);
            this.pavilioForm.controls['opengagebyhandFlag'].setValue(resp.data.opengagebyhandFlag);
            this.pavilioForm.controls['tempcarQuickoutFlag'].setValue(resp.data.tempcarQuickoutFlag);
            // this.pavilioForm.controls['fingerVerificationflag'].setValue(resp.data.fingerVerificationflag);
            // this.pavilioForm.controls['widechannelFlag'].setValue(resp.data.widechannelFlag);
            this.pavilioForm.controls['onechannelFlag'].setValue(resp.data.onechannelFlag);
            this.parkParkingAreaType=resp.data.parkParkingAreaType;
            // if(this.pavilioForm.value.widechannelFlag=="1"){
            //   this.yPavolio="1";
            //   this.tPavolio="0";
            // }else if(this.pavilioForm.value.widechannelFlag=="2"){
            //   this.tPavolio="1";
            //   this.yPavolio="0";
            // }
            // this.initializeItems();
          }
        }, resp => {});
      } else {
        this.titilName=vals['PARK_PAVILIO_ADD'];
      }
    });
  }

  // initializeItems() {
  //   this.items = [
  //     {id: 1, text: 'PARK_PAVILIO_WAYT', value: this.yPavolio},
  //     {id: 2, text: 'PARK_PAVILIO_WAYY', value: this.tPavolio}
  //   ];
  // }

  // getItems(item) {
  //   if (item.text === 'PARK_PAVILIO_WAYT') {
  //     this.yPavolio = "1";
  //     this.tPavolio = "0";
  //     this.pavilioForm.value.widechannelFlag="1";
  //   } else {
  //     this.yPavolio = "0";
  //     this.tPavolio = "1";
  //     this.pavilioForm.value.widechannelFlag="2";
  //   }
  //   this.initializeItems();
  // }

  save() {
    // if(this.pavilioForm.value.widechannelFlag==false){
    //   this.pavilioForm.value.widechannelFlag="0";
    // }else{
    //   if(this.yPavolio=="1"){
    //     this.pavilioForm.value.widechannelFlag="1";
    //   }else if(this.tPavolio == "1"){
    //     this.pavilioForm.value.widechannelFlag="2";
    //   }
    // }

    if (this.checkData()) {
      this.http.post('app/v1/editParkPavilio', this.pavilioForm.value, true).then(resp => {
        if (resp['ret'] === 'OK') {
          this.utils.message.success(resp['data'], 500);
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            this.navParams.data.refresh();
            this.navCtrl.pop();
          })
        } else {
          this.utils.message.error(resp['message']);
        }
      }, resp => {
        this.utils.message.error('COMMON_OP_FAILED');
      });
    }

  }

  entranceArea() {
    this.navCtrl.push(ParkEntranceAreaEditPage, {
      parkParkingAreaType: this.parkParkingAreaType,
      parkEntranceAreaName:this.pavilioForm.value.parkEntranceAreaName,
      contactsCallback: this.entranceAreaEditCallback});
  }

  entranceAreaEditCallback = (params) => {
    return new Promise((resolve, reject) => {
      if (typeof (params) != 'undefined') {
        this.item = params;
        this.pavilioForm.controls['parkEntranceAreaId'].setValue(this.item.parkEntranceAreaId);
        this.pavilioForm.controls['parkEntranceAreaName'].setValue(this.item.parkEntranceAreaName);
        this.getParkLotandArea(this.item.parkEntranceAreaId);
        resolve('ok');
      } else {
        reject(Error('error'));
      }
    });
  };

  getParkLotandArea(parkEntranceAreaId) {
    this.http.post('app/v1/getParkLotandAreaById', {parkEntranceAreaId: parkEntranceAreaId}, true).then((resp: { data?: any }) => {
      if (resp.data) {
        this.pavilioForm.controls['parkParkingLotName'].setValue(resp.data.parkParkingLotName);
        this.pavilioForm.controls['parkParkingAreaName'].setValue(resp.data.parkingAreaName);
        this.pavilioForm.controls['parkParkingAreaId'].setValue(resp.data.parkingAreaId);
      }
    }, resp => {});
  }

  checkData(): boolean {
    // 通道信息验证
    if (!this.pavilioForm.value.name) {
      this.utils.message.error('PARK_PAVILIO_MSG1');
      return false;
    }
    var res =/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
    if (!res.test(this.pavilioForm.value.name)) {
      this.utils.message.error('PARK_SPECIAL_PAVILIO');
      return false;
    }
    if (!this.pavilioForm.value.ipAddress) {
      this.utils.message.error('PARK_PAVILIO_MSG2');
      return false;
    }
    if (!this.pavilioForm.value.parkEntranceAreaId) {
      this.utils.message.error('PARK_CARDNUM_MSG6');
      return false;
    }
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (!reg.test(this.pavilioForm.value.ipAddress)) {
      this.utils.message.error('PARK_PAVILIO_MSG3');
      return false;
    }
    if (this.pavilioForm.value.widechannelFlag===true) {
      this.utils.message.error('PARK_PAVILIO_MSG4');
      return false;
    }
    return true;
  }

  showThird() {
    if (this.check == false) {
      this.check= true;
    } else {
      this.check = false;
    }
  }
}
