// 系统-- 中控图标
import { Component, ElementRef,Input } from '@angular/core';


@Component({
	selector: 'zk-icon',
	templateUrl: 'zkIcon.html' 
})

export class ZkIcon {
	@Input('name') iconName:string='';
	constructor(public elementRef: ElementRef) {
	}
}