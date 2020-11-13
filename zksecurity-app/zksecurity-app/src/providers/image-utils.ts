export class ImageUtils {

	/**
	 * 获取图片类型
	 * @type {[type]}
	 */
	getImageType(filePath:string): string {
		let type = 'image/jpeg';
		if(!filePath) {
			if(filePath.indexOf('image/jpeg;base64,') !== -1 || filePath.indexOf('.jpg') !== -1) {
				type = 'image/jpeg';
			} else if(filePath.indexOf('image/png;base64,') !== -1 || filePath.indexOf('.png') !== -1) {
				type = 'image/png';
			} else if(filePath.indexOf('image/gif;base64,') !== -1 || filePath.indexOf('.gif') !== -1) {
				type = 'image/gif';
			} 
		}
		return type;
	}

	/**
	 * 读取图片
	 * @type {[type]}
	 */
	readImage(filePath:string): Promise<any> {
		return new Promise((reslove, reject) => {
			if(filePath) {
				let img = document.createElement('img');
				img.onload = function() {
					reslove.apply(this, [img]);
				}
				img.src = filePath;
			} else {
				reject(new Error('filePath is empty'));
			}
		});
	}

	/**
	 * 读取图片数据
	 * @type {[type]}
	 */
	readImageData(imgObj:string|HTMLImageElement): Promise<any> {
		return new Promise((reslove, reject) => {
			if(imgObj) {
				if(imgObj instanceof HTMLImageElement) {
					let type = this.getImageType(imgObj.src);
					let cvs = document.createElement('canvas');
					cvs.width = imgObj.naturalWidth;
					cvs.height = imgObj.naturalHeight;
					let ctx = cvs.getContext('2d');
					ctx.drawImage(imgObj, 0, 0);
					reslove.apply(this, [cvs.toDataURL(type)]);
				} else if(this.isImageData(imgObj)) {
					reslove.apply(this, [imgObj]);
				} else {
					this.readImage(imgObj).then((img:HTMLImageElement) => { 
						let type = this.getImageType(imgObj);
						let cvs = document.createElement('canvas');
						cvs.width = img.naturalWidth;
						cvs.height = img.naturalHeight;
						let ctx = cvs.getContext('2d');
						ctx.drawImage(img, 0, 0);
						reslove.apply(this, [cvs.toDataURL(type)]);
					}).catch((err) => {
						reject(err);
					});
				}
			} else {
				reject(new Error('paramter is null'));
			}
		});
	}

	/**
	 * 判断是否图片数据
	 * @type {[type]}
	 */
	isImageData(img:string): boolean{
		if(img && img.indexOf(';base64,') !== -1) {
			return true;
		}
		return false;
	}

	/**
	 * 图片裁剪
	 */
	imageCut(srcImage, x, y, width, height): Promise<any> {
		return new Promise((reslove, reject) => {
			if(!srcImage || x < 0 || y < 0 || width < 0 || height < 0) {
				reject(new Error('paramter is error'));
			} else {
				let cvs = document.createElement('canvas');
				cvs.width = width;
				cvs.height = height;
				let ctx = cvs.getContext('2d');
				ctx.drawImage(srcImage, x, y, width, height, 0, 0, width, height);
				let mineType = this.getImageType(srcImage.src);
				reslove.apply(this, [cvs.toDataURL(mineType)]);
			}
		});
	}

	/**
	 * 图片压缩
	 * @type {[type]}
	 */
	imageZip(img:string|HTMLImageElement, maxSize:number): Promise<any> {
		return new Promise((reslove, reject) => {
			this.readImageData(img).then((imgData) => {
				if(imgData.length * 2 > maxSize) {
					let imgTmp = document.createElement('img');
					imgTmp.onload = () => {
						let rate = Math.sqrt(maxSize/2/imgData.length);
						let mineType = this.getImageType(imgData);
						let cvs = document.createElement('canvas');
						cvs.width = imgTmp.naturalWidth * rate;
						cvs.height = imgTmp.naturalHeight * rate;
						let ctx = cvs.getContext('2d');
						ctx.scale(rate, rate);
						ctx.drawImage(imgTmp, 0, 0);
						reslove.apply(this, [cvs.toDataURL(mineType)]);
					}
					imgTmp.src = imgData;	
				} else {
					reslove.apply(this, [imgData]);
				}
			}).catch( err => {
				reject(err);
			});
		});
	}

	contructor() {}
}