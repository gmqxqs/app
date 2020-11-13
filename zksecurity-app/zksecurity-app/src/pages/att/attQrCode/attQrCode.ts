// 门禁-- 电子工牌
import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import QrCodeWithLogo from 'qr-code-with-logo';
import { HttpService } from '../../../providers/http-service';
import * as CryptoJS from 'crypto-js';
import { TranslateService } from '@ngx-translate/core';
import { Brightness } from '@ionic-native/brightness';
import { Inject,forwardRef} from '@angular/core';
declare let cordova: any;
@Component({
	selector: 'page-attQrCode',
	templateUrl: 'attQrCode.html',
})



export class AttQrCodePage {
	

	cardNo:string='';
	msg:string;
	month:any;
	day:any;
	year:any;
	pin:string;
	timer:any;
	timeout:any;
	userInfoTimer:any;
	canRefresh:boolean=true;
	oldBrightValue:any;
	brightValue:any;
	data:any;
	booleanShow:boolean;
	width:any;
	

	//创建二维码
	createCode(url:string){
		let myCanvas = document.getElementById('qrcode');
	
		 QrCodeWithLogo.toCanvas({
		  canvas: myCanvas,
		  content: url,
		  width: this.width
		});

		let showRefresh = <HTMLInputElement>document.getElementById('showRefresh');
		if(showRefresh != null){
			showRefresh.style.display='inline';
		}
		this.booleanShow = false;
		
	
	}



	//获取用户信息
	getUserInfo(){
		this.http.post('app/v1/getPersonByPin', {pin:this.pin},true).then(res=> {
	
			console.log("res:",res);
		},err=>{

			clearInterval(this.userInfoTimer);
			clearInterval(this.timer);
			this.timer=null;
			this.userInfoTimer = null;
		});
	}



	//将当前时间戳转换为日期
	getLocalTime(nS) {     
	   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
	}




	//手动刷新二维码
	manRefresh(){
		
		if(!this.canRefresh){
			return;

		}
		if(this.timeout != null){
			window.clearTimeout(this.timeout);
		}
		this.encryptQrCode();
		let span = <HTMLInputElement>document.getElementById('refreshWord');
		let zkRefresh = <HTMLInputElement>document.getElementById('refreshImg');
		let zkComplete = <HTMLInputElement>document.getElementById('completedImg');
		
		

		if(zkRefresh != null){
			zkRefresh.style.display='none';
		}
		if(zkRefresh != null){
			zkComplete.style.display='inline';
		}
		this.translate.get(["QR_MANNUAL_COMPLETED"]).subscribe(values => {
				if(values && values["QR_MANNUAL_COMPLETED"]) {
					if(span != null){
						span.innerHTML = values["QR_MANNUAL_COMPLETED"];
					}
				} 
		});
		clearInterval(this.timer);
		this.timer = setInterval(()=> {
	        let myCanvas = <HTMLInputElement>document.getElementById('qrcode'); 
		    if(myCanvas == null){
		    	  window.clearInterval(this.timer);
		    }else{
		    	this.encryptQrCode();
		    }
	    },30000);



		
		this.timeout = setTimeout(()=> {
			let myCanvas = <HTMLInputElement>document.getElementById('qrcode'); 
		    if(myCanvas == null){
		    	  window.clearInterval(this.timer);
		    }else{
		    	 this.reduction();
		    }
           
         }, 3000);




		this.canRefresh = false;
	}

	//还原
	reduction(){
		let span = <HTMLInputElement>document.getElementById('refreshWord');
		let zkRefresh = <HTMLInputElement>document.getElementById('refreshImg');
		let zkComplete = <HTMLInputElement>document.getElementById('completedImg');
		
		
		if(zkRefresh != null){
			zkRefresh.style.display='inline';
		}
		if(zkRefresh != null){
			zkComplete.style.display='none';
		}
		this.translate.get(["QR_MANNUAL_REFRESH"]).subscribe(values => {
				if(values && values["QR_MANNUAL_REFRESH"]) {

					if(span != null){
						span.innerHTML = values["QR_MANNUAL_REFRESH"];
					}
					
					
				} 
		});

		this.canRefresh = true;
	}




	goBack() {
		clearInterval(this.timer);
		clearInterval(this.userInfoTimer);
		
		this.timer=null;
		this.userInfoTimer = null;
		
		if(this.oldBrightValue != null){
		 	this.brightness.setBrightness(this.oldBrightValue.__zone_symbol__value);
		 }

		if(this.platform.is('ios')) {

		}else{
			cordova.plugins.BrightPlugin.cancelObserve("");
		}
		
		this.navCtrl.pop();
	}

	swipeGoBack() {
		if(this.platform.is('ios')) {
    		clearInterval(this.timer);
			clearInterval(this.userInfoTimer);
			
			this.timer=null;
			this.userInfoTimer = null;
			
			if(this.oldBrightValue != null){
			 	this.brightness.setBrightness(this.oldBrightValue.__zone_symbol__value);
			 }

			if(this.platform.is('ios')) {

			}else{
				cordova.plugins.BrightPlugin.cancelObserve("");
			}
			
			this.navCtrl.pop();
    	}
		
	}




 //为当前的日期进行MD5加密
    getMD5(){
    	
    	this.getNowFormatDate();
    	var  data = this.year * this.month * this.day;
    	console.log("md5加密前:",data);
    	var md5 = CryptoJS.MD5(data.toString()).toString(CryptoJS.enc.Hex);
        console.log("md5第一次加密后:",md5.toUpperCase());
      
       	var number = ((data-0)+(42-0));
        var md5Temp = md5.toUpperCase() + number;
        console.log("md5第二次要加载的数据:",md5Temp);
        var md5data = CryptoJS.MD5(md5Temp).toString(CryptoJS.enc.Hex).toUpperCase();
        console.log("md5两次加密后:",md5data);
        return md5data;

    }

   //加密二维码
	encryptQrCode(){
		this.getJsonData();
		var key = this.getMD5();
		var encryptedData = this.getAES(JSON.stringify(this.data),key);
		console.log("加密后数据:",encryptedData);
		this.createCode(encryptedData)

	}

	//AES加密
	getAES(data,key) {
		let iv = key.substring(0,8);
		console.log("iv:",iv);
        let cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
		       iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV 
		       padding: CryptoJS.pad.Pkcs7,
		       mode: CryptoJS.mode.CBC
		});
    	return cipher.toString();
    
    }


 

   



    //封装要加密的json数据
	getJsonData(){
		//获取当前时间的时间戳
		const dateTime = Date.now();
		var timestamp = Math.floor(dateTime / 1000);
		console.log("当前时间戳:",timestamp);
		console.log("将当前时间戳转换为日期:",this.getLocalTime(timestamp));
		console.log("this.cardNo:",this.cardNo);
		if(this.cardNo == ''){
			console.log("卡号为空");
			this.data = {"createTime":timestamp.toString(),"validTime":"30","pin":this.pin,"cardNo":""};
			console.log("无卡号data:",this.data);
		} else{
			console.log("卡号不为空");
			this.data = {"createTime":timestamp.toString(),"validTime":"30","pin":this.pin,"cardNo":this.cardNo};
			console.log("有卡号data:",this.data);
		}
	}



	//获取当前的年月日
	getNowFormatDate() {
        var date = new Date(new Date().getTime() + (new Date().getTimezoneOffset()* 60000));
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
      
    }

   

	

    //获取二维码
    getQrcode(){
    	 this.oldBrightValue=this.brightness.getBrightness();
     	let brightnessValue:number = 0.5;
		 this.brightness.setBrightness(brightnessValue);
		//this.oldBrightValue = this.brightness.getBrightness();
		if(this.platform.is('ios')) {

		}else{
			cordova.plugins.BrightPlugin.cancelBright("");
		}
		console.log("oldBrightValue:",this.oldBrightValue);
		this.encryptQrCode();
		this.timer = setInterval(()=> {
			let myCanvas = <HTMLInputElement>document.getElementById('qrcode'); 
		    if(myCanvas == null){
		    	  window.clearInterval(this.timer);
		    }else{
		    	this.encryptQrCode();
		    }
	    }, 30000);

	     this.userInfoTimer = setInterval(()=>{
		    	this.getUserInfo();
		 },15000);

		 
    }

	constructor(public navCtrl: NavController,public storage: Storage,public translate: TranslateService,private platform: Platform,public brightness: Brightness, @Inject(forwardRef(()=>HttpService))public  http: HttpService) {
		   
		   this.width = screen.width;
		   if(this.platform.is('ios')) {

			}else{
				 cordova.plugins.BrightPlugin.getPhoneScreenMode("");
			}
		   this.storage.get('USER').then((user) => {
				if(user){
					this.http.post('app/v1/getCardNoByPin', {username:user.pin},true).then(res=> {
						if(res["ret"] == "OK"){
							if(res["cardNo"]!=undefined){
								this.booleanShow = false;
								this.cardNo = res["cardNo"];
								this.pin = user.pin;
								this.getQrcode();
						    } else {
								this.booleanShow = false;
								this.pin = user.pin;
								this.getQrcode();
							}
						}
					},err=>{
						this.timer=null;
					});
					
				}
			});


	}





}