import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// import pages



import { LoginPage } from '../pages/base/login/login';
import { PersListPage } from '../pages/pers/persList/persList';
import { PersAddPage } from '../pages/pers/persAdd/persAdd';
import { PersAccLevelPage } from '../pages/pers/persAccLevel/persAccLevel';
import { PersDeptPage } from '../pages/pers/persDept/persDept';
import { PersSetPage } from '../pages/pers/persSet/persSet';
import { AccAlarmPage } from '../pages/acc/accAlarm/accAlarm';
import { AlarmSetPage } from '../pages/acc/alarmSet/alarmSet';
import { AccDevicePage } from '../pages/acc/accDevice/accDevice';
import { AccDoorPage } from '../pages/acc/accDoor/accDoor';
import { AccDoorReportPage } from '../pages/acc/accDoorReport/accDoorReport';
import { AccMonitorPage } from '../pages/acc/accMonitor/accMonitor';
import { AccMonitorSetPage } from '../pages/acc/accMonitorSet/accMonitorSet';
import { AccEventPage } from '../pages/acc/accEvent/accEvent';
import { AccSearchEventPage } from '../pages/acc/accSearchEvent/accSearchEvent';
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
import { ParkChargeInfoPage } from '../pages/park/parkChargeInfo/parkChargeInfo';
import { ParkFixDelayPage } from '../pages/park/parkFixDelay/parkFixDelay';
import { ParkInCarPage } from '../pages/park/parkInCar/parkInCar';
import { ParkInCarDetailPage } from '../pages/park/parkInCarDetail/parkInCarDetail';
import { ParkPavilioPage } from '../pages/park/parkPavilio/parkPavilio';
import { NetworkPage } from '../pages/base/network/network';
import { UserSettingPage } from '../pages/base/userSetting/userSetting';
import { UserDetailPage } from '../pages/base/userDetail/userDetail';
import { PopoverPage } from "../pages/park/parkCardNum/popoverPage";
import { ParkCardNumDetailPage } from "../pages/park/parkCardNumDetail/parkCardNumDetail";
import { ParkCardNumTemporaryDetailPage } from "../pages/park/parkCardNumTemporaryDetail/parkCardNumTemporaryDetail";
import { ParkCardNumAddPage } from "../pages/park/parkCardNumAdd/parkCardNumAdd";
import { ParkStaffSelectionPage } from "../pages/park/parkStaffSelections/parkStaffSelection";
import { ParkDelayOperationPage } from "../pages/park/parkDelayOperation/parkDelayOperation";
import { SelectPage } from "../pages/vis/visReserveMgr/select/select";
import { SelectDepartmentPage } from "../pages/vis/visReserve/selectDepartment/selectDepartment";
import { SelectLevelPage } from "../pages/vis/visLevel/selectLevel/selectLevel";
import { VisLevelInfoPage } from "../pages/vis/visLevel/visLevelInfo/visLevelInfo";
import { VisLevelMore } from "../pages/vis/visLevel/visLevelMore/visLevelMore";
import { AddRKE } from "../pages/vis/visLevel/visLevelMore/addRKE/addRKE";
import { AddLadder } from "../pages/vis/visLevel/visLevelMore/addLadder/addLadder";
import { SelectHistory } from "../pages/vis/visRecord/selectHistory/selectHistory";
import { ParkPavilioDetailPage } from "../pages/park/parkPavilioDetail/parkPavilioDetail";
import { VisRecordDetailPage } from "../pages/vis/visRecord/visRecordDetail/visRecordDetail";
import { AboutPage } from '../pages/base/about/about';
import { StatementPage } from '../pages/base/statement/statement';
import { PersSelectDeptPage } from '../pages/pers/persSelectDept/persSelectDept';
import { PersPhotoPage } from '../pages/pers/persPhoto/persPhoto';
import { ZkIcon } from '../pages/base/zkIcon/zkIcon';
import { ZkTree } from '../pages/base/zkTree/zkTree';
import { ZkNavBar } from '../pages/base/zkNavBar/zkNavBar';
import { ArrowAnimation } from '../pages/base/arrowAnimation/arrowAnimation';

import { Settings } from '../providers/settings';
import { HttpService } from '../providers/http-service';
import { ZKMessage } from '../providers/zk-message';
import { MessageBox } from '../providers/message-box';
import { ZkMenus } from '../providers/menus';
import { Utils } from '../providers/utils';
import { BaseCode } from '../providers/basecode';
import { CommonValidator } from '../providers/common-validator';
import { Properties } from '../providers/properties';
import { StringFormat } from '../filter/stringformat';
import { ParkState } from '../filter/parkstate';
import { ChargeType } from '../filter/chargetype';
import { Session } from '../providers/session';
import { ImageUtils } from '../providers/image-utils';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AppVersion } from '@ionic-native/app-version';
import { ImagePicker } from '@ionic-native/image-picker';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MultiPickerModule } from 'ion-multi-picker';
import { ParkCarTypePage } from "../pages/park/parkCarType/parkCarType";
import { ParkTemporaryModalPage } from "../pages/park/parkTemporaryModal/parkTemporaryModal";
import { ParkTemporaryModalTreePage } from "../pages/park/parkTemporaryTreeModal/parkTemporaryTreeModal";
import { ParkChannelDetailPage } from "../pages/park/parkChannelDetail/parkChannelDetail";
import { VisStaffSelectionPage } from "../pages/vis/visReserve/visStaffSelection/visStaffSelection";
import { ParkEntranceAreaPage } from "../pages/park/parkEntranceArea/parkEntranceArea";
import { ParkDefaultPlatePage } from "../pages/park/parkDefaultPlate/parkDefaultPlate";
import { ParkEntranceAreaEditPage } from "../pages/park/parkEntranceAreaEdit/parkEntranceAreaEdit";
import { ParkTemporaryAddPage } from "../pages/park/parkTemporaryAdd/parkTemporaryAdd";
import { MgrReservePage } from "../pages/vis/visReserveMgr/mgrReserve/mgrReserve";
import { MgrSelectDepartmentPage } from "../pages/vis/visReserveMgr/mgrReserve/mgrSelectDepartment/mgrSelectDepartment";
import { MgrStaffSelectionPage } from "../pages/vis/visReserveMgr/mgrReserve/mgrStaffSelection/mgrStaffSelection";
import { MgrNoReservePage } from "../pages/vis/visReserveMgr/mgrNoReserve/mgrNoReserve";
import { ParkTimeSeletionsPage } from "../pages/park/parkTimeSeletionsModal/parkTimeSeletionsModal";
import { PersPhotoEditPage } from '../pages/pers/persPhotoEdit/persPhotoEdit';
import { ParkCarSetTreatmentPage } from "../pages/park/parkCarSetTreatment/parkCarSetTreatment";
import { ParkCarSpacePage } from "../pages/park/parkCarSpace/parkCarSpace";
import { Brightness } from '@ionic-native/brightness';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { HomePage } from '../pages/base/home/home';
//添加二维码
import { AttQrCodePage } from '../pages/att/attQrCode/attQrCode';
//添加隐私协议
import { PrivacyPage } from '../pages/base/privacy/privacy';
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http:Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage:Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    StringFormat,
    ParkState,
    ChargeType,
    LoginPage,
    HomePage,
    PersListPage,
    PersAddPage,
    PersAccLevelPage,
    PersDeptPage,
    PersSetPage,
    AccAlarmPage,
    AlarmSetPage,
    AccDevicePage,
    AccDoorPage,
    AccDoorReportPage,
    AccMonitorPage,
    AccMonitorSetPage,
    AccEventPage,
    AccSearchEventPage,
    AccReportPage,
    VisLevelPage,
    VisRecordPage,
    VisReservePage,
    VisReserveMgrPage,
    VisSetPage,
    VisStaffSelectionPage,
    AttCountPage,
    AttMonthPage,
    ParkCardNumPage,
    ParkCarSetPage,
    ParkChannelPage,
    ParkChargeDetailPage,
    ParkChargeInfoPage,
    ParkFixDelayPage,
    ParkInCarPage,
    ParkInCarDetailPage,
    ParkPavilioPage,
    NetworkPage,
    UserSettingPage,
    UserDetailPage,
    ZkIcon,
    ArrowAnimation,
    PopoverPage,
    ParkCardNumDetailPage,
    ParkCardNumTemporaryDetailPage,
    ParkCardNumAddPage,
    ParkStaffSelectionPage,
    ParkDelayOperationPage,
    SelectPage,
    SelectDepartmentPage,
    ZkTree,
    ZkNavBar,
    SelectLevelPage,
    VisLevelInfoPage,
    VisLevelMore,
    AddRKE,
    AddLadder,
    SelectHistory,
    VisLevelInfoPage,
    SelectDepartmentPage,
    ParkPavilioDetailPage,
    VisRecordDetailPage,
    ParkCarTypePage,
    ParkTemporaryModalPage,
    ParkTemporaryModalTreePage,
    ParkChannelDetailPage,
    AboutPage,
    StatementPage,
    PersSelectDeptPage,
    PersPhotoPage,
    StatementPage,
    VisStaffSelectionPage,
    ParkDefaultPlatePage,
    ParkEntranceAreaPage,
    ParkEntranceAreaEditPage,
    ParkTemporaryAddPage,
    PersSelectDeptPage,
    MgrReservePage,
    MgrSelectDepartmentPage,
    MgrStaffSelectionPage,
    MgrNoReservePage,
    ParkTimeSeletionsPage,
    PersPhotoEditPage,
    ParkCarSetTreatmentPage,
    ParkCarSpacePage,
    AttQrCodePage,
    PrivacyPage

   
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MultiPickerModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(
        MyApp,{backButtonIcon:'ios-arrow-back',mode:'ios', spinner: 'crescent',statusbarPadding: 'false'}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    PersListPage,
    PersAddPage,
    PersAccLevelPage,
    PersDeptPage,
    PersSetPage,
    AccAlarmPage,
    AlarmSetPage,
    AccDevicePage,
    AccDoorPage,
    AccDoorReportPage,
    AccMonitorPage,
    AccMonitorSetPage,
    AccEventPage,
    AccSearchEventPage,
    AccReportPage,
    VisLevelPage,
    VisRecordPage,
    VisReservePage,
    VisReserveMgrPage,
    VisSetPage,
    VisStaffSelectionPage,
    AttCountPage,
    AttMonthPage,
    ParkCardNumPage,
    ParkCarSetPage,
    ParkChannelPage,
    ParkChargeDetailPage,
    ParkChargeInfoPage,
    ParkFixDelayPage,
    ParkInCarPage,
    ParkInCarDetailPage,
    ParkPavilioPage,
    NetworkPage,
    UserSettingPage,
    UserDetailPage,
    ZkIcon,
    ArrowAnimation,
    ZkNavBar,
    PopoverPage,
    ParkCardNumDetailPage,
    ParkCardNumTemporaryDetailPage,
    ParkCardNumAddPage,
    ParkStaffSelectionPage,
    ParkDelayOperationPage,
    SelectPage,
    SelectDepartmentPage,
    ZkTree,
    SelectLevelPage,
    VisLevelInfoPage,
    VisLevelMore,
    AddRKE,
    AddLadder,
    SelectHistory,
    VisLevelInfoPage,
    SelectDepartmentPage,
    ParkPavilioDetailPage,
    VisRecordDetailPage,
    ParkCarTypePage,
    ParkTemporaryModalPage,
    ParkTemporaryModalTreePage,
    ParkChannelDetailPage,
    AboutPage,
    StatementPage,
    PersSelectDeptPage,
    StatementPage,
    VisStaffSelectionPage,
    ParkDefaultPlatePage,
    ParkEntranceAreaPage,
    ParkEntranceAreaEditPage,
    ParkTemporaryAddPage,
    PersSelectDeptPage,
    PersPhotoPage,
    MgrReservePage,
    MgrSelectDepartmentPage,
    MgrStaffSelectionPage,
    MgrNoReservePage,
    ParkTimeSeletionsPage,
    PersPhotoEditPage,
    ParkCarSetTreatmentPage,
    ParkCarSpacePage,
    AttQrCodePage,
    PrivacyPage

  ],
  providers: [
    HttpService,
    ZKMessage,
    ZkMenus,
    Utils,
    MessageBox,
    BaseCode,
    ImagePicker,
    ImageUtils,
    Properties,
    CommonValidator,
    Camera,
    GoogleMaps,
    SplashScreen,
    Device,
    BarcodeScanner,
    StatusBar,
    Session,
    ScreenOrientation,
    SMS,
    CallNumber,
    AppVersion,
    Brightness,
    MobileAccessibility,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    // Keep this to enable Ionic's runtime error handling during development
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
