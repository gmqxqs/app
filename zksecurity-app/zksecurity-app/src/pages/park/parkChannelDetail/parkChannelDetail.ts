/**
 * Created by DELL on 2017/8/4.
 */
import { Component } from '@angular/core';
import { Platform,ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpService } from "../../../providers/http-service";
import { Utils } from "../../../providers/utils";
import { TranslateService } from '@ngx-translate/core';
import { Properties } from '../../../providers/properties';

@Component({
  selector: 'page-parkChannelDetail',
  templateUrl: 'parkChannelDetail.html'
})

export class ParkChannelDetailPage {

  car: any;
  item: any;
  channelForm: FormGroup;
  monthCarOpenType: any;
  tempCarOpenType: any;
  fixopen: String = '';
  tempopen: String = '';
  IPCIP: any;
  avoption1: any;
  avoption2: any;
  items: any;
  // 车牌按钮组
  ipBtn = [];
  idBtn = [];
  // 证件类型 显示信息
  ipType1 = '';
  ipType2 = '';
  videoType1 = '';
  videoType2 = '';
  parkPavilioName = '';
  parkPavilioId = '';
  // 证件类型 Id
  ipId = '';
  states: any;
  stateid: any;
  no: any;
  id: any;
  widechannelFlag: any;
  titleName:any;
  lang:string = 'zh';
  parkParkingAreaType: any;
  runningMode:any = 'lprCamera';
  parkAccDoorId:any;
  parkAccDoorName:any;
  parkAccDoors:any = [];
  videos:any = {};
  vid1:any;
  vid2:any;
  vidChannelId1 = '';
  vidChannelId2 = '';
  vid1Required:any=false;
  vid2Required:any=false;

  video(type:any) {
     this.translate.get(['COMMON_SURE', 'PARK_CHANNEL_VIDEO1', 'PARK_CHANNEL_VIDEO2']).subscribe(msg => {
      let buttons:any = [{
          text: '--------',
          value:'',
          handler: () => {
            if(type=='videoType1') { 
              this.videoType1 = '--------';
              this.vidChannelId1 = '';
              this.vid1 = {};
              this.channelForm.controls['vidChannelId1'].setValue('');
              this.vid1Required = false;
              this.avoption1 = '';
              this.channelForm.controls['avoption1'].setValue('');
              buttons.forEach(item => {
                item.cssClass = item.value === this.vidChannelId1 ? 'action-sheet-selected' : '';
              })
            } else if(type=='videoType2') { 
              this.videoType2 = '--------';
              this.vidChannelId2 = '';
              this.vid2 = {};
              this.channelForm.controls['vidChannelId2'].setValue('');
              this.vid2Required = false;
              this.avoption2 = '';
              this.channelForm.controls['avoption2'].setValue('');
              buttons.forEach(item => {
                item.cssClass = item.value === this.vidChannelId2 ? 'action-sheet-selected' : '';
              })
            }
            
            return false;
          },
          cssClass: this[type=='videoType1'?'vidChannelId1':'vidChannelId2'] === '' ? 'action-sheet-selected' : '',
        } ];
      
      for(let vid in this.videos) {
        if(type=='videoType1' && this.videoType2 == this.videos[vid].name) {
          continue;
        } else if(type=='videoType2' && this.videoType1 == this.videos[vid].name) {
          continue;
        } 
        buttons.push({
          text: this.videos[vid].name,
          value: this.videos[vid].id,
          cssClass: this[type=='videoType1'?'vidChannelId1':'vidChannelId2'] === this.videos[vid].id ? 'action-sheet-selected' : '',
          handler: () => {
            if(type=='videoType1') {
              this.videoType1 = this.videos[vid].name;
              this.vid1 = this.videos[vid];
              this.vidChannelId1 = this.videos[vid].id;
              this.channelForm.controls['vidChannelId1'].setValue(this.vidChannelId1);
              this.vid1Required = true;
              buttons.forEach(item => {
                item.cssClass = item.value === this.vidChannelId1 ? 'action-sheet-selected' : '';
              })
            } else if(type=='videoType2') {
              this.videoType2 = this.videos[vid].name;
              this.vid2 = this.videos[vid];
              this.vidChannelId2 = this.videos[vid].id;
              this.vid2Required = true;
              this.channelForm.controls['vidChannelId2'].setValue(this.vidChannelId2);
              buttons.forEach(item => {
                item.cssClass = item.value === this.vidChannelId2 ? 'action-sheet-selected' : '';
              })
            }
            return false;
          }  
        });
      }
      buttons.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: msg[type=='videoType1' ? 'PARK_CHANNEL_VIDEO1':'PARK_CHANNEL_VIDEO2'],
        buttons: buttons
      });
      actionSheet.present();
    });
  }

  getParkDoorFilterByChannel() {
    this.http.post('app/v1/getParkDoorFilterByChannel', {parkAccDoorId:this.parkAccDoorId}, true).then((res: { data?: any }) => {
      if (res['ret'] === 'OK') {
        this.parkAccDoors = res.data;
      }
    }, err => {})
  }

  getChannelInfo() {
    this.http.post('app/v1/getChannelInfo', {channelId:this.id}, true).then((res: { data?: any }) => {
      if (res['ret'] === 'OK') {
        this.videos = res.data;
        if(typeof(this.videos) == 'object') {
          for(let i in this.videos) {
            if(this.videos[i].id == this.vidChannelId1) {
              this.videoType1 = this.videos[i].name;
              this.vid1 = this.videos[i];
            } else if(this.videos[i].id == this.vidChannelId2) {
              this.videoType2 = this.videos[i].name;
              this.vid2 = this.videos[i];
            }
          }
        }
      }
    }, err => {})
  }


goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public props:Properties, public formBuilder: FormBuilder,
              public http: HttpService, public actionSheetCtrl: ActionSheetController, public utils: Utils
    ,public translate :TranslateService,private platform: Platform) {
    this.lang = this.utils.translate.currentLang;
    this.id = this.navParams.data.id;
    this.translate.get(['PARK_CHANNEL_DETAIL','PARK_CHANNEL_ADD']).subscribe(vals => {
      if (this.id) {
        this.titleName=vals['PARK_CHANNEL_DETAIL'];
        this.http.post('app/v1/getParkChannelById', {id: this.id}).then((resp: { data?: any }) => {
          this.car = resp.data;
          if (this.car) {
            switch (this.car.state) {
              case 1:
                this.states = 'PARK_AREA_IN';
                break;
              case 2:
                this.states = 'PARK_AREA_OUT';
                break;
              case 3:
                this.states = 'PARK_AREA_SIN';
                break;
              case 4:
                this.states = 'PARK_AREA_SOUT';
                break;
              case 5:
                this.states = 'PARK_CHARGE_CENTER';
                break;
              case 6:
                this.states = 'PARK_CHARGE_CENTEROUT';
                break;
            }
            switch (this.car.monthCarOpenType) {
              case 1:
                this.fixopen = 'PARK_FIXOPEN_IN';
                break;
              case 2:
                this.fixopen = 'PARK_FIXOPEN_GO';
                break;
            }
            switch (this.car.tempCarOpenType) {
              case 1:
                this.tempopen = 'PARK_FIXOPEN_IN';
                break;
              case 2:
                this.tempopen = 'PARK_FIXOPEN_GO';
                break;
            }
            this.ipType1 = this.car.IPC1_IP;
            this.ipType2 = this.car.IPC2_IP;
            this.avoption1 = this.car.avoption1;
            this.avoption2 = this.car.avoption2;
            this.parkPavilioName = this.car.parkPavilioName;
            this.parkParkingAreaType=this.car.parkParkingAreaType;
            this.parkAccDoorId = this.car.parkAccDoorId;
            this.parkAccDoorName = this.car.parkAccDoorName;
            this.runningMode = this.car.runningMode || 'lprCamera';
            this.channelForm.controls['id'].setValue(this.car.id);
            this.channelForm.controls['name'].setValue(this.car.name);
            this.channelForm.controls['state'].setValue(this.car.state);
            this.channelForm.controls['tempCarOpenType'].setValue(this.car.tempCarOpenType);
            this.channelForm.controls['monthCarOpenType'].setValue(this.car.monthCarOpenType);
            this.channelForm.controls['parkPavilioId'].setValue(this.car.parkPavilioId);
            this.channelForm.controls['parkDevice1Id'].setValue(this.car.parkDevice1Id);
            this.channelForm.controls['parkDevice2Id'].setValue(this.car.parkDevice2Id);
            this.channelForm.controls['avoption1'].setValue(this.car.avoption1);
            this.channelForm.controls['avoption2'].setValue(this.car.avoption2);
           
            if(this.runningMode == 'accReader') {
                this.channelForm.controls['parkAccDoorId'].setValue(this.car.parkAccDoorId);
                if(Array.isArray(this.car.parkVidChannelList)) {
                  if(this.car.parkVidChannelList.length > 0) {
                    this.vidChannelId1 = this.car.parkVidChannelList[0].vidChannelId;
                    this.avoption1 = this.car.parkVidChannelList[0].avoption;
                    this.channelForm.controls['avoption1'].setValue(this.avoption1);
                    this.channelForm.controls['vidChannelId1'].setValue(this.vidChannelId1);
                  }
                  if(this.car.parkVidChannelList.length > 1) {
                    this.vidChannelId2 = this.car.parkVidChannelList[1].vidChannelId;
                     this.avoption2 = this.car.parkVidChannelList[1].avoption;
                    this.channelForm.controls['avoption2'].setValue(this.avoption2);
                    this.channelForm.controls['vidChannelId2'].setValue(this.vidChannelId2);
                  }
                }
                this.getParkDoorFilterByChannel();
                this.getChannelInfo();
            }
          }
        }, resp => {});
      } else {
        this.props.getPropertise(['park.runningMode']).then(val => {
          if(val) {
            this.runningMode = val['park.runningMode'] || 'lprCamera';
            if(this.runningMode == 'accReader') {
                this.getParkDoorFilterByChannel();
                this.getChannelInfo();
            }
          }
        })
        this.titleName=vals['PARK_CHANNEL_ADD'];
      }
    });

    this.channelForm = formBuilder.group({
      id: [''],
      name: [''],
      state: [''],
      monthCarOpenType: [''],
      tempCarOpenType: [''],
      parkPavilioId: [''],
      parkDevice1Id: [''],
      parkDevice2Id: [''],
      vidChannelId1: [''],
      vidChannelId2: [''],
      parkAccDoorId: [''],
      avoption1: [''],
      avoption2: [''],
      ipAddress1: [''],
      port1: [''],
      loginName1: [''],
      loginPwd1: [''],
      ipAddress2: [''],
      port2: [''],
      loginName2: [''],
      loginPwd2: ['']
    });
  }

  assignVidInfo() {
    if(this.runningMode == 'accReader') {
      if(this.vidChannelId1) {
        this.channelForm.controls['ipAddress1'].setValue(this.vid1.host);
        this.channelForm.controls['port1'].setValue(this.vid1.port);
        this.channelForm.controls['loginName1'].setValue(this.vid1.username);
        this.channelForm.controls['loginPwd1'].setValue(this.vid1.commPwd);
      }
      if(this.vidChannelId2) {
        this.channelForm.controls['ipAddress2'].setValue(this.vid2.host);
        this.channelForm.controls['port2'].setValue(this.vid2.port);
        this.channelForm.controls['loginName2'].setValue(this.vid2.username);
        this.channelForm.controls['loginPwd2'].setValue(this.vid2.commPwd);
      }
    }
  }

  save() {
    this.assignVidInfo();
    if (this.checkData()) {
      this.http.post('app/v1/editParkChannel', this.channelForm.value, true).then(resp => {
        if (resp['ret'] === 'OK') {
          this.utils.message.success(resp['data'], 500);
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            this.navParams.data.refresh();
            this.navCtrl.pop();
          });
        } else {
          this.utils.message.error(resp['message']);
        }
      }, resp => {
        this.utils.message.error('COMMON_OP_FAILED');
      });
    }
  }

  setSelectOption(as, ind) {
    as.instance.d.buttons.forEach((item, index) => {
      item.cssClass = index === ind ? 'action-sheet-selected' : '';
    })
  }

  selectGender() {
    this.translate.get(['PARK_FIXOPEN_IN', 'PARK_FIXOPEN_GO', 'COMMON_SURE', 'PARK_FIXOPEN_SELECT']).subscribe(msg => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: msg['PARK_FIXOPEN_SELECT'],
        buttons: [{
          text: msg['PARK_FIXOPEN_IN'],
          handler: () => {
            this.fixopen = 'PARK_FIXOPEN_IN';
            this.setSelectOption(actionSheet, 0);
            this.monthCarOpenType = 1;
            this.channelForm.controls['monthCarOpenType'].setValue(this.monthCarOpenType);
            return false;
          },
          cssClass: this.fixopen === 'PARK_FIXOPEN_IN' ? 'action-sheet-selected' : '',
        }, {
          text: msg['PARK_FIXOPEN_GO'],
          handler: () => {
            this.fixopen = 'PARK_FIXOPEN_GO';
            this.setSelectOption(actionSheet, 1);
            this.monthCarOpenType = 2;
            this.channelForm.controls['monthCarOpenType'].setValue(this.monthCarOpenType);
            return false;
          },
          cssClass: this.fixopen === 'PARK_FIXOPEN_GO' ? 'action-sheet-selected' : '',
        }, {
          text: msg['COMMON_SURE'],
          role: 'cancel',
          handler: () => {
            return true;
          }
        }],
      });
      actionSheet.present();
    });
  }

  selectIPCIP(avoption: any) {
    this.translate.get(['COMMON_SURE', 'PARK_VIDEO_POS','PARK_VIDEO_VIDPOS']).subscribe(msg => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: msg[this.runningMode == 'accReader' ? 'PARK_VIDEO_VIDPOS':'PARK_VIDEO_POS'],
        buttons: [{
          text: '--------',
          handler: () => {
            this.IPCIP = '--------';
            this.setSelectOption(actionSheet, 0);
            if (avoption == 'avoption1') {
              this.avoption1 = this.IPCIP;
              this.channelForm.controls['avoption1'].setValue('');
            } else {
              this.avoption2 = this.IPCIP;
              this.channelForm.controls['avoption2'].setValue('');
            }
            return false;
          },
          cssClass: this.IPCIP === '---------' ? 'action-sheet-selected' : '',
        },{
          text: '1',
          handler: () => {
            this.IPCIP = '1';
            this.setSelectOption(actionSheet, 1);
            if (avoption == 'avoption1') {
              this.avoption1 = this.IPCIP;
              this.channelForm.controls['avoption1'].setValue(this.IPCIP);
            } else {
              this.avoption2 = this.IPCIP;
              this.channelForm.controls['avoption2'].setValue(this.IPCIP);
            }
            return false;
          },
          cssClass: this.IPCIP === '1' ? 'action-sheet-selected' : '',
        }, {
          text: '2',
          handler: () => {
            this.IPCIP = '2';
            this.setSelectOption(actionSheet, 2);
            if (avoption == 'avoption1') {
              this.avoption1 = this.IPCIP;
              this.channelForm.controls['avoption1'].setValue(this.IPCIP);
            } else {
              this.avoption2 = this.IPCIP;
              this.channelForm.controls['avoption2'].setValue(this.IPCIP);
            }
            return false;
          },
          cssClass: this.IPCIP === '2' ? 'action-sheet-selected' : '',
        }, {
          text: '3',
          handler: () => {
            this.IPCIP = '3';
            this.setSelectOption(actionSheet, 3);
            if (avoption == 'avoption1') {
              this.avoption1 = this.IPCIP;
              this.channelForm.controls['avoption1'].setValue(this.IPCIP);
            } else {
              this.avoption2 = this.IPCIP;
              this.channelForm.controls['avoption2'].setValue(this.IPCIP);
            }
            return false;
          },
          cssClass: this.IPCIP === '3' ? 'action-sheet-selected' : '',
        }, {
          text: '4',
          handler: () => {
            this.IPCIP = '4';
            this.setSelectOption(actionSheet, 4);
            if (avoption == 'avoption1') {
              this.avoption1 = this.IPCIP;
              this.channelForm.controls['avoption1'].setValue(this.IPCIP);
            } else {
              this.avoption2 = this.IPCIP;
              this.channelForm.controls['avoption2'].setValue(this.IPCIP);
            }
            return false;
          },
          cssClass: this.IPCIP === '4' ? 'action-sheet-selected' : '',
        }, {
          text: msg['COMMON_SURE'],
          role: 'cancel',
          handler: () => {
            return true;
          }
        }],
      });
      actionSheet.present();
    });
  }

  selectGender3() {
    this.translate.get(['PARK_IMPORTEXPORT_AREA_SET', 'COMMON_SURE', 'PARK_AREA_IN', 'PARK_AREA_OUT', 'PARK_AREA_SIN', 'PARK_AREA_SOUT', 'PARK_CHARGE_CENTER', 'PARK_CHARGE_CENTEROUT']).subscribe(msg => {
      
      var btns = [];
      if(this.parkParkingAreaType==0) {
          btns.push({
            text: msg['PARK_AREA_IN'],
            handler: () => {
              this.states = 'PARK_AREA_IN';
              this.stateid = 1;
              this.setSelectOption(actionSheet, 0);
              this.channelForm.controls['state'].setValue(this.stateid);
              return false;
            },
            cssClass: this.states === 'PARK_AREA_IN' ? 'action-sheet-selected' : '',
          });
          btns.push( {
            text: msg['PARK_AREA_OUT'],
            handler: () => {
              this.states = 'PARK_AREA_OUT';
              this.stateid = 2;
              this.setSelectOption(actionSheet, 1);
              this.channelForm.controls['state'].setValue(this.stateid);
              return false;
            },
            cssClass: this.states === 'PARK_AREA_OUT' ? 'action-sheet-selected' : '',
          });
          btns.push({
            text: msg['PARK_CHARGE_CENTER'],
            handler: () => {
              this.states = 'PARK_CHARGE_CENTER';
              this.stateid = 5;
              this.setSelectOption(actionSheet, 2);
              this.channelForm.controls['state'].setValue(this.stateid);
              this.fixopen = "";
              this.tempopen = "";
              this.channelForm.controls['tempCarOpenType'].setValue('');
              this.channelForm.controls['monthCarOpenType'].setValue('');
              this.channelForm.controls['parkDevice1Id'].setValue('');
              this.channelForm.controls['parkDevice2Id'].setValue('');
              this.channelForm.controls['avoption1'].setValue('');
              this.channelForm.controls['avoption2'].setValue('');
              this.channelForm.controls['vidChannelId1'].setValue('');
              this.channelForm.controls['vidChannelId2'].setValue('');
              this.channelForm.controls['parkAccDoorId'].setValue('');
              this.parkAccDoorId = '';
              this.parkAccDoorName = '';
              return false;
            },
            cssClass: this.states === 'PARK_CHARGE_CENTER' ? 'action-sheet-selected' : '',
          });
          btns.push({
            text: msg['PARK_CHARGE_CENTEROUT'],
            handler: () => {
              this.states = 'PARK_CHARGE_CENTEROUT';
              this.stateid = 6;
              this.setSelectOption(actionSheet, 3);
              this.channelForm.controls['state'].setValue(this.stateid);
              this.fixopen = 'PARK_FIXOPEN_GO';
              this.tempopen = 'PARK_FIXOPEN_GO';
              this.channelForm.controls['tempCarOpenType'].setValue(2);
              this.channelForm.controls['monthCarOpenType'].setValue(2);
              return false;
            },
            cssClass: this.states === 'PARK_CHARGE_CENTEROUT' ? 'action-sheet-selected' : '',
          });
      } else if(this.parkParkingAreaType==1){
        btns.push({
          text: msg['PARK_AREA_SIN'],
          handler: () => {
            this.states = 'PARK_AREA_SIN';
            this.stateid = 3;
            this.setSelectOption(actionSheet, 0);
            this.channelForm.controls['state'].setValue(this.stateid);
            return false;
          },
          cssClass: this.states === 'PARK_AREA_SIN' ? 'action-sheet-selected' : '',
        });
        btns.push({
          text: msg['PARK_AREA_SOUT'],
          handler: () => {
            this.states = 'PARK_AREA_SOUT';
            this.stateid = 4;
            this.setSelectOption(actionSheet, 1);
            this.channelForm.controls['state'].setValue(this.stateid);
            return false;
          },
          cssClass: this.states === 'PARK_AREA_SOUT' ? 'action-sheet-selected' : '',
        });
      }
      if(btns.length==0) {
        return;
      }
      btns.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
      let actionSheet = this.actionSheetCtrl.create({
          cssClass: 'base-code-sheet',
          title: msg['PARK_IMPORTEXPORT_AREA_SET'],
          buttons: btns,
        });
        actionSheet.present();
    });

  }

  showParkDoor() {
   
    this.translate.get(['COMMON_SURE', 'ACC_DOOR_NAME']).subscribe(msg => {
      let buttons:any = [];
      if(Array.isArray(this.parkAccDoors)) {
        for(let door of this.parkAccDoors) {
          buttons.push({
            text: door.parkAccDoorName,
            value: door.parkAccDoorId,
            cssClass: this.parkAccDoorId === door.parkAccDoorId ? 'action-sheet-selected' : '',
            handler: () => {
              this.parkAccDoorName = door.parkAccDoorName;
              this.parkAccDoorId = door.parkAccDoorId;
              this.channelForm.controls['parkAccDoorId'].setValue(this.parkAccDoorId);
              buttons.forEach(item => {
                item.cssClass = item.value === this.parkAccDoorId ? 'action-sheet-selected' : '';
              })
              return false;
            }  
          });
        }
      }
      buttons.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: msg['ACC_DOOR_NAME'],
        buttons: buttons
      });
      actionSheet.present();
    });
  }


  selectGender2() {
    this.translate.get(['PARK_TEMPOPEN_SELECT', 'COMMON_SURE', 'PARK_FIXOPEN_GO', 'PARK_FIXOPEN_IN']).subscribe(msg => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet',
        title: msg['PARK_TEMPOPEN_SELECT'],
        buttons: [{
          text: msg['PARK_FIXOPEN_IN'],
          handler: () => {
            this.tempopen = 'PARK_FIXOPEN_IN';
            this.tempCarOpenType = 1;
            this.setSelectOption(actionSheet, 0);
            this.channelForm.controls['tempCarOpenType'].setValue(this.tempCarOpenType);
            return false;
          },
          cssClass: this.tempopen === 'PARK_FIXOPEN_IN' ? 'action-sheet-selected' : '',
        }, {
          text: msg['PARK_FIXOPEN_GO'],
          handler: () => {
            this.tempopen = 'PARK_FIXOPEN_GO';
            this.tempCarOpenType = 2;
            this.setSelectOption(actionSheet, 1);
            this.channelForm.controls['tempCarOpenType'].setValue(this.tempCarOpenType);
            return false;
          },
          cssClass: this.tempopen === 'PARK_FIXOPEN_GO' ? 'action-sheet-selected' : '',
        }, {
          text: msg['COMMON_SURE'],
          role: 'cancel',
          handler: () => {
            return true;
          }
        }],
      });
      actionSheet.present();
    });

  }

  pavilioId() {
    this.idBtn = [];
    this.parkPavilioId = this.channelForm.value.parkPavilioId;
    this.http.post('app/v1/getParkPavilio', {pageNo: 1, pageSize: 9999999}).then((resp: { data?: any }) => {
      if (resp.data.rows) {
        this.items = resp.data.rows;
        if (this.items && this.items.length > 0) {
          this.pavilioIdProcess();
          this.showPavilioIdAS();
        } else {
          this.channelForm.controls['parkDevice1Id'].setValue('');
          this.utils.message.error('PARK_CHANNEL_MSG1');
        }
      }
    }, resp => {});
  }

  setPavilioIdOption(PavilioId) {
    this.idBtn.forEach(item => {
      item.cssClass = item.value === PavilioId ? 'action-sheet-selected' : '';
    })
  }

  /**
   * PavilioId类型 数据处理
   */
  pavilioIdProcess(): void {
    // 循环添加按钮组
    for (let bean of this.items) {
      // 按钮组 添加选项
      this.idBtn.push(
        {
          text: bean.name,
          value: bean.parkPavilioId,
          cssClass: this.parkPavilioId === bean.parkPavilioId ? 'action-sheet-selected' : '',
          handler: () => {
            this.parkPavilioName = bean.name;
            this.parkPavilioId = bean.parkPavilioId;
            this.widechannelFlag = bean.widechannelFlag;
            this.parkParkingAreaType = bean.parkParkingAreaType;
            this.setPavilioIdOption(bean.parkPavilioId);
            return false;
          }
        }
      );
    }
    this.translate.get(['COMMON_SURE']).subscribe(msg => {
      // 添加确定按钮
      this.idBtn.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          if(this.parkPavilioId !== this.channelForm.value.parkPavilioId) {
            this.channelForm.controls['parkPavilioId'].setValue(this.parkPavilioId);
            this.channelForm.controls['parkDevice1Id'].setValue('');
            this.ipType1 = '';
            this.channelForm.controls['avoption1'].setValue('');
            this.avoption1 = '';
            this.channelForm.controls['parkDevice2Id'].setValue('');
            this.ipType2 = '';
            this.channelForm.controls['avoption2'].setValue('');
            this.avoption2 = '';
            this.channelForm.controls['vidChannelId1'].setValue('');
            this.videoType1 = '';
            this.vidChannelId1 = '';
            this.vid1 = {};
            this.channelForm.controls['vidChannelId2'].setValue('');
            this.videoType2 = '';
            this.vidChannelId2 = '';
            this.vid2 = {};
          }
          return true;
        }
      });
    });
  }

  /**
   * PavilioId ActionSheet
   */
  showPavilioIdAS(): void {
    this.translate.get(['PARK_PAVILIO_NAEM']).subscribe(msg => {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'base-code-sheet-channel',
        title: msg['PARK_PAVILIO_NAEM'],
        buttons: this.idBtn
      });
      actionSheet.present();
    });
  }

  /**
   * IPC1_IP
   * @param ipType
   */
  ip(ipType: any) {
    this.ipBtn = [];
    this.http.post('app/v1/getParkDeviceIps', {id:this.id}).then((resp: { data?: any }) => {
      if (resp.data) {
        this.items = resp.data;
        if (this.items && this.items.length > 0) {
          this.certDataProcess(ipType);
          this.showCertAS();
        } else {
          if (ipType == 'ip1') {
            this.channelForm.controls['parkDevice1Id'].setValue('');
          } else {
            this.channelForm.controls['parkDevice2Id'].setValue('');
          }
          this.utils.message.error('PARK_CHANNEL_MSG2');
        }
      }
    }, resp => {});
  }

  setIpOption(parkDeviceId) {
    this.ipBtn.forEach(item => {
      item.cssClass = item.value === parkDeviceId ? 'action-sheet-selected' : '';
    })
  }

  /**
   * ip类型 数据处理
   */
  certDataProcess(ipType: any): void {
    this.ipBtn.push(
      {
        text: "--------",
        value: '0',
        cssClass: this.ipId === '0' ? 'action-sheet-selected' : '',
        handler: () => {
          this.setIpOption('0');
          this.ipId = '0';
          if (ipType == 'ip1') {
            this.ipType1 = "--------";
            this.channelForm.controls['parkDevice1Id'].setValue('');
          } else {
            this.ipType2 = "--------";
            this.channelForm.controls['parkDevice2Id'].setValue('');
          }
          return false;
        }
      }
    );
    // 循环添加按钮组
    for (let bean of this.items) {
      // 按钮组 添加选项
      this.ipBtn.push(
        {
          text: bean.ipAddress,
          value: bean.parkDeviceId,
          cssClass: this.ipId === bean.parkDeviceId ? 'action-sheet-selected' : '',
          handler: () => {
            this.setIpOption(bean.parkDeviceId);
            this.ipId = bean.parkDeviceId;
            if (ipType == 'ip1') {
              this.ipType1 = bean.ipAddress;
              this.channelForm.controls['parkDevice1Id'].setValue(this.ipId);
            } else {
              this.ipType2 = bean.ipAddress;
              this.channelForm.controls['parkDevice2Id'].setValue(this.ipId);
            }
            return false;
          }
        }
      );

    }
    // 添加确定按钮
    this.translate.get(['COMMON_SURE']).subscribe(msg => {
      this.ipBtn.push({
        text: msg['COMMON_SURE'],
        role: 'cancel',
        handler: () => {
          return true;
        }
      });
    });
  }

  /**
   * ip ActionSheet
   */
  showCertAS(): void {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass: 'base-code-sheet',
      title: 'IPC_IP',
      buttons: this.ipBtn
    });
    actionSheet.present();
  }

  checkData(): boolean {
    // 通道信息验证
    if (!this.channelForm.value.name) {
      this.utils.message.error('PARK_CHANNEL_MSG3');
      return false;
    }
    
    var res =/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
    if (!res.test(this.channelForm.value.name)) {
      this.utils.message.error('PARK_SPECIAL_CHANNEL');
      return false;
    }
    if (!this.channelForm.value.state) {
      this.utils.message.error('PARK_CHANNEL_MSG4');
      return false;
    }
    //进出口区域状态不是中央缴费定点
    if (this.channelForm.value.state != 5) {
      if(this.runningMode == 'accReader' && !this.channelForm.value.parkAccDoorId) {
        this.utils.message.error('PARK_CHANNEL_MSG15');
        return false;
      }
      if (!this.channelForm.value.monthCarOpenType) {
        this.utils.message.error('PARK_CHANNEL_MSG5');
        return false;
      }
      if (!this.channelForm.value.tempCarOpenType) {
        this.utils.message.error('PARK_CHANNEL_MSG6');
        return false;
      }
      if (this.runningMode=='lprCamera' && !this.channelForm.value.parkDevice1Id) {
        this.utils.message.error('PARK_CHANNEL_MSG7');
        return false;
      }
      if(this.widechannelFlag){
        if (this.widechannelFlag != 0) {
          if (this.runningMode=='lprCamera' && !this.channelForm.value.parkDevice2Id) {
            this.utils.message.error('PARK_CHANNEL_MSG8');
            return false;
          }
          if (this.runningMode=='lprCamera' && !this.channelForm.value.avoption2) {
            this.utils.message.error('PARK_CHANNEL_MSG9');
            return false;
          }
        }
      }


      if (this.runningMode=='lprCamera' && !this.channelForm.value.avoption1) {
        this.utils.message.error('PARK_CHANNEL_MSG10');
        return false;
      }

      if (this.runningMode=='lprCamera' && this.channelForm.value.parkDevice1Id == this.channelForm.value.parkDevice2Id) {
        this.utils.message.error('PARK_CHANNEL_MSG11');
        return false;
      }
      if (this.channelForm.value.avoption1 && this.channelForm.value.avoption1 == this.channelForm.value.avoption2) {
        this.utils.message.error('PARK_CHANNEL_MSG12');
        return false;
      }

      if (this.channelForm.value.vidChannelId1 && !this.channelForm.value.avoption1 || this.channelForm.value.vidChannelId2 && !this.channelForm.value.avoption2){
          this.utils.message.error('PARK_CHANNEL_MSG14');
          return false;
      }
      if(this.runningMode == 'accReader' && this.channelForm.value.avoption2 && !this.channelForm.value.vidChannelId2) {
           this.utils.message.error('PARK_CHANNEL_MSG17');
          return false;
      }

      if(this.runningMode == 'accReader' && this.channelForm.value.avoption1 && !this.channelForm.value.vidChannelId1) {
          this.utils.message.error('PARK_CHANNEL_MSG16');
          return false;
      }
      //如果ICP2选择了，对应的视频就为必选
      if (this.channelForm.value.parkDevice2Id || this.channelForm.value.vidChannelId2){
        if(!this.channelForm.value.avoption2){
          this.utils.message.error('PARK_CHANNEL_MSG9');
          return false;
        }
      }
    }

    if (!this.channelForm.value.parkPavilioId) {
      this.utils.message.error('PARK_CHANNEL_MSG13');
      return false;
    }

    return true;

  }

}
