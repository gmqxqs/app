// 访客-- 参数设置
import {Component} from '@angular/core';
import {Platform,NavController} from 'ionic-angular';
import {HttpService} from "../../../providers/http-service";
import {Utils} from "../../../providers/utils";

@Component({
  selector: 'page-visSet',
  templateUrl: 'visSet.html'
})

export class VisSetPage {

  isAuth: any;
  // 是否需要发卡 1：是，0:否（默认选择）, ""
  isNeedIssueCard = "0";
  // 是否需要登记指纹 1：是，0、否
  isNeedFP = "0";
  // 是否需要使用密码 1：是，0、否
  isNeedPwd = "0";
  // 是否需要使用扫码开门 1：是，0、否
  isNeedSC = "0";

  // 被访人是否必填  1：是，0、否
  requiredVisitedEmp = false;
  // 部门是否必填 1：是，0、否
  requiredVisitedDept = false;

  // 邮件发送地址
  receiver = "";
  // 选择后的时间
  selTime: any;

  data = {
    // 显示隐藏
    accredit: true,

    required: true,
    receiver: true,
  };

  save() {
    if (this.receiver) {
      if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(this.receiver)) {
        this.utils.message.error('VIS_EMAIL_IS_WRONG');
        return false;
      }
    }
    this.setVisParam();
  }

  getItems(isAuth) {
    if (isAuth) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
  }

  getNeedAuthItems(item) {
    if (item === 1) {
      this.isNeedIssueCard = this.isNeedIssueCard === "1" ? "0" : "1";
      this.isNeedSC = "0";
    } else if (item === 2) {
      this.isNeedFP = this.isNeedFP === "1" ? "0" : "1";
    } else if (item === 3) {
      this.isNeedPwd = this.isNeedPwd === "1" ? "0" : "1";
    } else if (item === 4) {
      this.isNeedIssueCard = "0";
      this.isNeedSC = this.isNeedSC === "1" ? "0" : "1";
    }
  }

  showAccredit() {
    if (this.data.accredit == false) {
      this.data.accredit = true;
    } else {
      this.data.accredit = false;
    }
  }

  showRequired() {
    if (this.data.required == false) {
      this.data.required = true;
    } else {
      this.data.required = false;
    }
  }

  showReceiver() {
    if (this.data.receiver == false) {
      this.data.receiver = true;
    } else {
      this.data.receiver = false;
    }
  }


  goBack(){
    if(this.platform.is('ios')) {
        this.navCtrl.pop();
    }
  }

  constructor(public navCtrl: NavController,
              public http: HttpService,
              public utils: Utils,private platform: Platform) {
    this.initData();
  }

  private initData() {
    this.getVisParam();
  }

  /**
   * 获取参数设置数据
   */
  private getVisParam() {
    this.http.post('app/v1/getVisParam', {}).then(res => {
      if (res['ret'] === 'OK') {
        this.isNeedIssueCard = res['data'].isNeedIssueCard;
        this.isNeedFP = res['data'].isNeedFP;
        this.isNeedPwd = res['data'].isNeedPwd;
        this.isNeedSC = res['data'].isNeedSC;

        if (this.isNeedIssueCard != "1" && this.isNeedFP != "1" && this.isNeedPwd != "1" && this.isNeedSC != "1") {
          this.isAuth = false;
        } else {
          this.isAuth = true;
        }

        this.hour = res['data'].alertTimeHour
        if (this.hour < 10) {
          this.hour = "0" + this.hour;
        }
        this.min = res['data'].alertTimeMinute
        if (this.min < 10) {
          this.min = "0" + this.min;
        }
        this.selTime = this.hour + ":" + this.min;
        if (res['data'].requiredVisitedEmp && res['data'].requiredVisitedEmp === "1") {
          this.requiredVisitedEmp = true;
        } else {
          this.requiredVisitedEmp = false;
        }
        if (res['data'].requiredVisitedDept && res['data'].requiredVisitedDept === "1") {
          this.requiredVisitedDept = true;
        } else {
          this.requiredVisitedDept = false;
        }
        this.receiver = res['data'].receiver;
      } else {
      }
    }, err => {
    });
  }

  hour: any;
  min: any;

  // 设置参数设置数据
  private setVisParam() {
    this.hour = this.selTime.split(":")[0]
    if (this.hour < 10) {
      this.hour = this.hour.substring(1, 2);
    }
    this.min = this.selTime.split(":")[1]
    if (this.min < 10) {
      this.min = this.min.substring(1, 2);
    }
    this.http.post('app/v1/setVisParam', {
      isNeedIssueCard: this.isAuth ? this.isNeedIssueCard : "0",
      isNeedFP: this.isAuth ? this.isNeedFP : "0",
      isNeedPwd: this.isAuth ? this.isNeedPwd : "0",
      isNeedSC: this.isAuth ? this.isNeedSC : "0",
      alertTimeHour: this.hour,
      alertTimeMinute: this.min,
      requiredVisitedEmp: this.requiredVisitedEmp ? "1" : "0",
      requiredVisitedDept: this.requiredVisitedDept ? "1" : "0",
      receiver: this.receiver,
    }).then(res => {
      if (res['ret'] === 'OK') {
        //this.navCtrl.pop();
        this.utils.message.success('PERS_SET_SUCCESS');
      } else {
        this.utils.message.error(res['message'] || 'PERS_SET_FAILED');
      }
    }, err => {
      this.utils.message.error('PERS_SET_FAILED');
    });
  }
}
