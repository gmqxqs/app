// 系统管理-- 箭头动画
import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'arrow-animation',
	templateUrl: 'arrowAnimation.html' 
})

export class ArrowAnimation implements OnInit{

	@Input() direction:string = 'top';
	@Input() time:string = 'infinite';
	@Input() cssClass:string = '';
	@Input() duration:string = '2s';
	@Input() autoplay:boolean = true;
	@Input() color:string='rgba(0,0,0,0.6)';
	@Input() initOnce:boolean;
	@Input() onlyOnce:string;

	showArrow:boolean;

	setShowArrow() {
		if(this.autoplay) {
			this.showArrow = false;
			let cont = this.elementRef.nativeElement.parentElement as HTMLElement;
			if(cont) {
				if((this.direction == 'top' || this.direction == 'bottom') && cont.scrollHeight- cont.scrollTop> cont.clientHeight+5){
					this.showArrow = true;
				} else if((this.direction == 'left' || this.direction == 'right') && cont.scrollWidth > cont.clientWidth+5){
					this.showArrow = true;
				} 	
			}
		} else {
			this.showArrow = true;
		}
		this.doDismiss();
	}

	ngOnInit() {
		if(this.onlyOnce) {
			this.showArrow = false;
			this.storage.get(this.onlyOnce).then(val => {
				if(!val) {
					this.showArrow = true;
					this.storage.set(this.onlyOnce, true);
					this.doDismiss();
				}
			})
		} else {
			this.setShowArrow();
			if(!this.initOnce) {
				this.navCtrl.viewDidEnter.subscribe(() => {
					this.setShowArrow();
				})
			}
		}
	}

	doDismiss() {
		if(/^[\d]+/.test(this.time)) {
			let t = parseFloat(this.duration);
			let cnt = parseInt(this.time);
			setTimeout(() => {
				this.showArrow = false;
			}, this.duration.indexOf('ms') == -1 ? t*1000*cnt : t*cnt);
		}
	}

	constructor(public navCtrl: NavController, public storage: Storage, public elementRef:ElementRef) {

	}
}