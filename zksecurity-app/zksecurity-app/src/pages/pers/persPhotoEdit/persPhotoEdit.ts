// ÈËÊÂ-- Í·Ïñ±à¼­
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../../providers/utils';
import { ImageUtils } from '../../../providers/image-utils';

@Component({
	selector: 'page-persPhotoEdit',
	templateUrl: 'persPhotoEdit.html' 
})

export class PersPhotoEditPage {
	
	
	@ViewChild('imgObj') img:ElementRef;
	@ViewChild('angle') angle:ElementRef;
	
	imgData:string = '';
	imageUtils:ImageUtils = new ImageUtils();
	
	left:number = 20;
	right:number = 20;
	top:number = 20;
	bottom:number = 20;

	imgTop:number = 0;
	imgLeft:number = 0;
	imgRight:number = 0;
	imgBottom:number = 0;
	
	lastTouch:Touch;

	historySets:Array<any> = [];

	/**
	 * 缩小
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	narrow(event) {
		this.historySets.push({data:this.imgData, position: [this.imgLeft, this.imgRight, this.imgTop, this.imgBottom]});
		let w = this.img.nativeElement.clientWidth * 0.15;
		let h = this.img.nativeElement.clientHeight * 0.15;
		this.imgLeft = this.imgLeft + w;
		this.imgRight = this.imgRight + w;
		this.imgTop = this.imgTop + h;
		this.imgBottom = this.imgBottom + h;
		let contW = document.documentElement.clientWidth;
		let contH = document.documentElement.clientHeight / 1280 * (1280 - 96);
		let _w = (contW - this.imgLeft - this.imgRight) * 0.8;
		let _h = (contH - this.imgTop - this.imgBottom) * 0.8;
		let aw = 2 * (this.angle.nativeElement.clientWidth + this.angle.nativeElement.clientLeft);
		if(aw > _w || aw > _h) {
			let position = this.historySets.pop().position;
			this.imgLeft = position[0];
			this.imgRight = position[1];
			this.imgTop = position[2];
			this.imgBottom = position[3];
		} 
		this.initOverlay();
	}

	/**
	 * 回退
	 * @return {[type]} [description]
	 */
	undo() {
		if(this.historySets.length > 0) {
			let data = this.historySets.pop();
			this.imgData = data.data;
			setTimeout(() => {
				this.initPosition();
				let position = data.position;
				this.imgLeft = position[0];
				this.imgRight = position[1];
				this.imgTop = position[2];
				this.imgBottom = position[3];
				this.initOverlay();
			}, 100);
		}
	}

	/**
	 * 放大
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	zoom(event) {
		this.historySets.push({data:this.imgData, position: [this.imgLeft, this.imgRight, this.imgTop, this.imgBottom]});
		let cont = <HTMLElement>document.querySelector('page-persPhotoEdit .scroll-content');
		let x = this.img.nativeElement.naturalWidth/this.img.nativeElement.clientWidth * (this.left-this.imgLeft);
		let y = this.img.nativeElement.naturalHeight/this.img.nativeElement.clientHeight * (this.top - this.imgTop);
		let _w = cont.clientWidth - this.left - this.right;
		let _h = cont.clientHeight - this.top - this.bottom;
		let w = this.img.nativeElement.naturalWidth/this.img.nativeElement.clientWidth * _w;
		let h = this.img.nativeElement.naturalHeight/this.img.nativeElement.clientHeight * _h;
		this.imageUtils.imageCut(this.img.nativeElement, x, y, w, h).then((data) => {
			this.imgData = data;
			setTimeout(() => {
				this.initPosition();
			}, 100);
		}).catch(err => {});
	}

	/**
	 * 保存
	 * @return {[type]} [description]
	 */
	save() {
		this.utils.message.loading(' ', -1,null,'loader-custom loader-bg-hidden');
		setTimeout(() => {
			let cont = <HTMLElement>document.querySelector('page-persPhotoEdit .scroll-content');
			let x = this.img.nativeElement.naturalWidth/this.img.nativeElement.clientWidth * (this.left-this.imgLeft);
			let y = this.img.nativeElement.naturalHeight/this.img.nativeElement.clientHeight * (this.top - this.imgTop);
			let _w = cont.clientWidth - this.left - this.right;
			let _h = cont.clientHeight - this.top - this.bottom;
			let w = this.img.nativeElement.naturalWidth/this.img.nativeElement.clientWidth * _w;
			let h = this.img.nativeElement.naturalHeight/this.img.nativeElement.clientHeight * _h;

			this.imageUtils.imageCut(this.img.nativeElement, x, y, w, h).then((data) => {
				this.imageUtils.imageZip(data, 500000).then((imgNewData) => {
					let parent = this.navCtrl.getByIndex(this.navCtrl.length() - 2).instance;
					parent.photoImg = imgNewData;
					parent.showButton = true;
					parent.setBgSize();
					this.utils.message.closeMessage();
					this.navCtrl.pop();
				}).catch(err => {});
			}).catch(err => {});
		}, 500);
	}

	ionViewDidLoad() {
		this.utils.message.closeMessage();
		this.initPosition();
	}

	/**
	 * 初始化图片位置
	 * @return {[type]} [description]
	 */
	initPosition() {
		if(typeof(this.img.nativeElement.naturalWidth) === 'undefined' || this.img.nativeElement.naturalWidth === 0) {
			setTimeout(() => {
				this.initPosition();
			}, 50);
		} else {
			let imgr = this.img.nativeElement.naturalWidth/this.img.nativeElement.naturalHeight;
			let contW = document.documentElement.clientWidth;
			let contH = document.documentElement.clientHeight / 1280 * (1280 - 96);
			let contr = contW/contH;
			if(imgr >= contr) {
				this.imgLeft = 0;
				this.imgRight = 0;
				let _h = (contH - contW/imgr)/2;
				this.imgTop = _h;
				this.imgBottom = _h;
			} else {
				this.imgTop = 0;
				this.imgBottom = 0;
				let _w = (contW - contH*imgr)/2;
				this.imgLeft = _w;
				this.imgRight = _w;
			}
			this.initOverlay();
		}
	}

	/**
	 * 初始化遮罩层位置
	 * @return {[type]} [description]
	 */
	initOverlay() {
		let contW = document.documentElement.clientWidth;
		let contH = document.documentElement.clientHeight / 1280 * (1280 - 96);
		let w = (contW - this.imgLeft - this.imgRight) * 0.1;
		let h = (contH - this.imgTop - this.imgBottom) * 0.1;
		this.left = this.imgLeft + w;
		this.right = this.imgRight + w;
		this.top = this.imgTop + h;
		this.bottom = this.imgBottom + h;
	}

	/**
	 * 选择框移动修改大小
	 * @param  {[type]} event [description]
	 * @param  {[type]} type  [description]
	 * @return {[type]}       [description]
	 */
	resizeMove(event, type) {
		let touch = event.changedTouches[0];
		let x = touch.pageX - this.lastTouch.pageX;
		let y = touch.pageY - this.lastTouch.pageY;
		let w = 0;
		let h = 0;
		let aw = 0;
		let cont = <HTMLElement>document.querySelector('page-persPhotoEdit .scroll-content');
		if(type === 'tl') {
			aw = 2 * (this.angle.nativeElement.clientWidth + this.angle.nativeElement.clientLeft);
			w = cont.clientWidth - this.right - aw;
			h = cont.clientHeight - this.bottom - aw;
			this.left = this.min(this.left + x, this.imgLeft);
			this.top = this.min(this.top + y, this.imgTop);
			this.left = this.left > w ? w : this.left;
			this.top = this.top > h ? h : this.top;
		} else if(type === 'tr') {
			aw = 2 * (this.angle.nativeElement.clientWidth + this.angle.nativeElement.clientLeft);
			w = cont.clientWidth - this.left - aw;
			h = cont.clientHeight - this.bottom - aw;
			this.right = this.min(this.right - x, this.imgRight);
			this.top = this.min(this.top + y, this.imgTop);
			this.right = this.right > w ? w : this.right;
			this.top = this.top > h ? h : this.top;
		} else if(type === 'bl') {
			aw = 2 * (this.angle.nativeElement.clientWidth + this.angle.nativeElement.clientLeft);
			w = cont.clientWidth - this.right - aw;
			h = cont.clientHeight - this.top - aw;
			this.left = this.min(this.left + x, this.imgLeft);
			this.bottom = this.min(this.bottom - y, this.imgBottom);
			this.left = this.left > w ? w : this.left;
			this.bottom = this.bottom > h ? h : this.bottom;

		} else if(type === 'br') {
			aw = 2 * (this.angle.nativeElement.clientWidth + this.angle.nativeElement.clientLeft);
			w = cont.clientWidth - this.left - aw;
			h = cont.clientHeight - this.top - aw;
			this.right = this.min(this.right - x, this.imgRight);
			this.bottom = this.min(this.bottom - y, this.imgBottom);
			this.right = this.right > w ? w : this.right;
			this.bottom = this.bottom > h ? h : this.bottom;
		}
		this.lastTouch = touch;
		event.stopPropagation()
	}

	/**
	 * 开始记录起点
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	start(event) {
		this.lastTouch = event.changedTouches[0];
	}

	/**
	 * 取较大值
	 * @param  {[type]} v:number [description]
	 * @param  {[type]} m:number [description]
	 * @return {[type]}          [description]
	 */
	min(v:number, m:number) {
		return v < m ? m : v;
	}

	/**
	 * 选择框移动
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	move(event) {
		let touch = event.changedTouches[0];
		let x = touch.pageX - this.lastTouch.pageX;
		let y = touch.pageY - this.lastTouch.pageY;
		let cont = <HTMLElement>document.querySelector('page-persPhotoEdit .scroll-content');
		let _x = cont.clientWidth - this.left - this.right;
		let _y = cont.clientHeight - this.top - this.bottom;
		if(x > 0) {//右移
			this.right = this.min(this.right - x, this.imgRight);
			if(this.right === this.imgRight) {
				this.left = cont.clientWidth - _x - this.imgRight;
			} else {
				this.left = this.left + x;
			}
		} else {//左移
			this.left = this.min(this.left + x, this.imgLeft);
			if(this.left === this.imgLeft) {
				this.right = cont.clientWidth - _x - this.imgLeft;
			} else {
				this.right = this.right - x;
			}
		}
		if(y > 0) {//下移
			this.bottom = this.min(this.bottom - y, this.imgBottom);
			if(this.bottom === this.imgBottom) {
				this.top = cont.clientHeight - _y - this.imgBottom;
			} else {
				this.top = this.top + y;
			}
		} else {//上移
			this.top = this.min(this.top + y, this.imgTop);
			if(this.top === this.imgTop) {
				this.bottom = cont.clientHeight - _y - this.imgTop;
			} else {
				this.bottom = this.bottom - y;
			}
		}
		this.lastTouch = touch;
	}


	goBack(){
	    if(this.platform.is('ios')) {
	        this.navCtrl.pop();
	    }
	  }

	constructor(public navCtrl:NavController, public navParams:NavParams, public utils:Utils,private platform: Platform) {
		this.imgData = this.navParams.data.img;
	}
}