import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../../../providers/http-service';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'zk-tree',
	templateUrl: 'zkTree.html' 
})

/**************************************************************************************************
 * 自定义树控件
 *
 * ###【 属性 】###
 * data: 数据源，数组类型，如[{id:1,text:'',children:[]},{id:2,text:''}]
 * props: 属性字段转换，针对数据源里的id,text,children属性名称转换如{id:'code'}取id时则转换去取code
 * radio: 是否单选， 默认单选
 * cascadeCheck: 是否级联复选， 默认false
 * radioIcon： 自定义单选图标
 * checkedIcon：自定义复选图标
 * closeIcon： 自定义节点关闭图标
 * openIcon：自定义节点展开图标
 * parentTree： 父节点对象，根节点为null
 * hideNodeIcon: 是否隐藏左侧节点展开/关闭图标
 * hideCheckedIcon: 是否隐藏右侧单选复选按钮
 * cssClass: 自定义样式
 * 
 * ###【 数据源单项属性 】###
 * id: 节点表示的值，可通过配置props指定节点对应的属性名称
 * text: 节点表示的文本， 可通过配置props指定节点对应的属性名称
 * children: 子节点数组， 可通过配置props指定节点对应的属性名称
 * checked: 节点是否选中
 * selected: 鼠标是否选中该节点
 * isOpen: 是否打开节点
 * icon: 节点文本前显示的自定义图标
 * 
 * ###【 事件 】###
 * onSelected: 节点单击事件，参数:[item, ZkTree, event]
 * onChecked: 节点选中事件, 参数:[item, ZkTree, event]
 *
 * ###【 方法 】###
 * getRoot(): 获取根节点对象
 * getCheckedItems()： 获取选中项
 * getSubChecked(): 获取当前节点的选中项
 * cascade(func): 级联处理
 * getSelectedItem(): 获取鼠标单击的节点
 * getSelectedId(): 获取鼠标选中项的值
 * getCheckedIds(): 获取选中项的id数组
 * getCheckedTexts():获取选中项的文本数组
 * setChecked(item|id|items,isChecked): 设置选中项
 *
 * ### 【 示例 】###
 * html:
 * <zk-tree
 *   [data]="items"
 *   [props]="{id:'code',text:'deptName'}"
 *   [cascadeCheck]="true"
 *   [radio]="false"
 *   [hideNodeIcon]="true"
 *   [cssClass]="'zktree-custom'"
 *   (onChecked)="checkedClick()"
 *   (onSelected)="selectedClick()"
 * >
 * </zk-tree>
 * script:
 * this.items=[{
 * 				code:'1',
 * 				deptName:'部门名称',
 * 				children:[{
 * 					code:'2',
 * 					icon:'card',
 * 					deptName:'研发部'
 * 				}, {
 * 					code:'3',
 * 					deptName:'财务部'
 * 				}]
 * 			}]
 * 
 * @author chenPF
 * @created 2017-08-07
 * 
 ***************************************************************************************************/
export class ZkTree implements OnInit {
	
	/**
	 * 数据源
	 * @type {Array}
	 */
	@Input('data') items: Array<any> = [];

	@Input() item:any;

	/**
	 * 是否单选，默认true
	 * @type {boolean}
	 */
	@Input() radio: boolean = true;

	@Input() dataUrl:string;

	@Input() httpParams:any;

	@Input() num:number = 0;

	/**
	 * 是否级联复选
	 * @type {boolean}
	 */
	@Input() cascadeCheck: boolean;

	/**
	 * 单选图标
	 * @type {string}
	 */
	@Input() radioIcon: string;

	/**
	 * 复选图标
	 * @type {string}
	 */
	@Input() checkedIcon: string;

	/**
	 * 关闭节点图标
	 * @type {string}
	 */
	@Input() closeIcon: string;

	/**
	 * 打开节点图标
	 * @type {string}
	 */
	@Input() openIcon: string;

	/**
	 * 父树组件
	 * @type {ZkTree}
	 */
	@Input() parentTree: ZkTree;

	/**
	 * 是否隐藏打开关闭图标
	 * @type {boolean}
	 */
	@Input() hideNodeIcon: boolean;

	/**
	 * 是否隐藏单选/复选按钮
	 * @type {boolean}
	 */
	@Input() hideCheckedIcon: boolean;

	/**
	 * 自定义样式
	 * @type {string}
	 */
	@Input() cssClass: string = '';

	@Input() value:FormControl;

	@Input() isChild:boolean;

	@Input() displayLines:boolean;

	/**
	 * 属性字段转换
	 * @type {Object}
	 */
	@Input() props: {id?: string, text?: string, children?: string} = {id: 'id', text: 'text', children: 'children'};

	/**
	 * 鼠标选中事件
	 * @type {EventEmitter}
	 */
	@Output() onSelected: EventEmitter<any> = new EventEmitter();

	/**
	 * 节点选中事件
	 * @type {EventEmitter}
	 */
	@Output() onChecked: EventEmitter<any> = new EventEmitter();

	autoOpen:boolean=true;

	/**
	 * 通过属性字段转换对象获取属性值
	 * @type {[type]}
	 */
	_getProp(item: any, propName: string) :any {
		if(!item) {
			return null;
		}
		if(this.props[propName]) {
			return item[this.props[propName]];
		} else {
			return item[propName]
		}
	}

	ngOnInit() {
		if(this.value) {
			this.value.valueChanges.subscribe(val => {
				if(val) {
					this.setChecked(val, true);
					this.setSelected(val);
				}
			})
		}
    	if(this.dataUrl) {
			this.http.post(this.dataUrl, this.httpParams || {}).then(resp => {
				if(resp['data']) {
					this.items = resp['data'];
					if(this.value && this.value.value) {
						this.setChecked(this.value.value,true);
						this.setSelected(this.value.value);
					}
				}
			}, err => {})
		} else {
			if(this.value && this.value.value) {
				this.setChecked(this.value.value,true);
				this.setSelected(this.value.value);
			}
		}
		this.num = this.num + 1;
    }

    

	/**
	 * 获取根节点
	 * @return {ZkTree} 
	 */
	getRoot() :ZkTree {
		if(!this.parentTree) {
			return this;
		}
		return this.parentTree.getRoot();
	}

	/**
	 * 获取复选选中项
	 * @return {Array} 
	 */
	getCheckedItems() :Array<any> {
		return this._getSubChecked(this.getRoot().items);
	}

	/**
	 * 获取当前节点下的选中项
	 * @return {Array}
	 */
	getSubChecked() :Array<any> {
		return this._getSubChecked(this.items);
	}

	/**
	 * 获取当前节点下的选中项,私有
	 * @type {[type]}
	 */
	private _getSubChecked(_items: Array<any>) :Array<any> {
		let _checkedItems = [];
		this._cascade(_items, (item,key) => {
			if(item.checked) {
				_checkedItems.push(item);
			}
		});
		return _checkedItems;
	}

	/**
	 * 级联处理节点数据，私有
	 * @param  {Array} _items 根节点数组
	 * @param  {Function} func: 处理函数          
	 * @return {[type]}   处理函数返回true则终止级联，并返回最后节点
	 */
	private _cascade(_items: Array<any>, func: Function) :any {
		for(let key in _items) {
			if(func.apply(this,[_items[key], key])){
				return _items[key];
			};
			if(this._getProp(_items[key],'children') && this._getProp(_items[key],'children').length > 0) {
				let ret = this._cascade(this._getProp(_items[key],'children'), func);
				if(ret != null) {
					return ret;
				}
			}
		}
		return null;
	}

	/**
	 * 从根节点级联处理节点数据
	 * @param  {Function} func: 处理函数     
	 * @return {[type]}   处理函数返回true则终止级联，并返回最后节点
	 */
	cascade(func: Function) :any {
		return this._cascade(this.getRoot().items, func);
	}

	/**
	 * 获取鼠标选中项
	 * @return {[type]} 
	 */
	getSelectedItem() :any {
		return this.cascade((item, key) => {
			if(item.selected) {
				return true;
			}
			return false;
		});
	}

	/**
	 * 获取鼠标选中项的值
	 * @return {[type]} [description]
	 */
	getSelectedId() :number|string {
		return this._getProp(this.getSelectedItem(),'id');
	}

	/**
	 * 获取节点选中项id
	 * @return {[type]} [description]
	 */
	getCheckedIds() :Array<any> {
		let ids: Array<any> = [];
		this.cascade((item,key) => {
			if(item.checked) {
				ids.push(this._getProp(item,'id'));
			}
		})
		return ids;
	}

	/**
	 * 获取节点选中项文本
	 * @return {[type]} [description]
	 */
	getCheckedTexts() :Array<any> {
		let txts:Array<any> = [];
		this.cascade((item,key) => {
			if(item.checked) {
				txts.push(this._getProp(item,'text'));
			}
		})
		return txts;
	}

	/**
	 * 节点单击事件
	 * @param  {[type]} evt   事件对象
	 * @param  {[type]} item: any   节点数据
	 * @return {[type]}       [description]
	 */
	_nodeClick(evt: any, item: any) {
		this.cascade((_item,key)=> {
			if(_item.selected) {
				_item.selected = false;
			}
		});
		item.selected = true;
		if(!this._getProp(item,'children') || this._getProp(item,'children').length === 0) {
			this.setChecked(item, !item.checked);
			this.getRoot().onChecked.emit([item,this, evt]);
		} else {
			item.isOpen = !item.isOpen;
		}
		this.autoOpen = false;
		this.getRoot().onSelected.emit([item, this, evt]);
	}

	/**
	 * 设置鼠标选中项
	 * @param {[type]} _item:any|string|number 项节点数据或id
	 */
	setSelected(_item:any|string|number) {
		this.cascade((item,key)=> {
			if(item.selected) {
				item.selected = false;
			}
			if(typeof _item === 'string' || typeof _item === 'number') {
				if(this._getProp(item, 'id') === _item) {
					item.selected = true;
				}
			} else if(this._getProp(item, 'id') === this._getProp(_item, 'id')) {
				item.selected = true;
			}
		});
	}

	/**
	 * 设置选中项
	 * @param {[type]}  item:any                 [description]
	 * @param {Boolean} isChecked:boolean|number [description]
	 */
	setChecked(item:any, isChecked:boolean|number) {
		if(isChecked) {
			this.autoOpen = true;
		}
		if(this.radio) {
			this.cascade((_item,key) => {
				if(_item.checked) {
					_item.checked = false;
				}
			});
		}
		if(Array.isArray(item)) {
			this._setCheckeds(item, isChecked);
		} else {
			if(typeof item === 'string' || typeof item === 'number') {
				this.cascade((_item,key) => {
					if(this._getProp(_item,'id') === item) {
						_item.checked = isChecked;
						if(!this.radio && this.cascadeCheck) {
							this._cascade(this._getProp(_item,'children'), (__item,key) => {
								__item.checked = isChecked;
							});
						}
						return true;
					}
				});
			} else if(typeof item !== 'undefined'){
				item.checked = isChecked;
				if(!this.radio && this.cascadeCheck) {
					this._cascade(this._getProp(item,'children'), (_item,key) => {
						_item.checked = item.checked;
					});
				}
			}
		}
	}

	getOpenFlag(item:any) {
		if(!item.isOpen && this.autoOpen) {
			this._cascade(this._getProp(item,'children'), (_item,key) => {
				if(item.isOpen) {
					return null;
				}
				if(_item.checked) {
					item.isOpen = true;
				}
			})
		}
		return item.isOpen;
	}

	/**
	 * 设置选中项
	 * @param {Array}  items:
	 * @param {Boolean} isChecked:boolean|number [description]
	 */
	private _setCheckeds(items: Array<any>, isChecked:boolean|number) {
		this.cascade((item, key) => {
			for(let i=0; i<items.length; i++) {
				if(typeof (items[i]) === 'number' || typeof (items[i]) === 'string') {
					if(this._getProp(item,'id') === items[i]) {
						item.checked = isChecked;
						break;
					} 
				} else {
					if(this._getProp(item,'id') === this._getProp(items[i],'id')) {
						item.checked = isChecked;
						break;
					}
				}
			}
		})
	}

	_checkedClick(evt,item){
		this.setChecked(item, !item.checked);
		this.autoOpen = false;
		this.setSelected(item);
		this.getRoot().onSelected.emit([item,this, evt]);
		this.getRoot().onChecked.emit([item,this, evt]);
		evt.stopPropagation();
	}

	constructor(public http:HttpService) {
	}
}