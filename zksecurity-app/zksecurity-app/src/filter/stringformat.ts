import { Pipe } from '@angular/core';

@Pipe({
	name: 'stringformat',
	pure: true
})
export class StringFormat {
	transform(value, ...params) {
		let result = value;
		if (params && params.length > 0) {
			if (params.length === 1 && typeof params[0] == 'object') {
	 			for (let key in params[0]) 
	            {
	                if(params[0][key] != undefined)
	                {
	                    let reg = new RegExp("({" + key + "})", "g");
	                    result = result.replace(reg, params[0][key]);
	                }
	            }
			} 
			else 
	        {
	            for (let i = 0; i < params.length; i++)
	            {
	                if (params[i] != undefined)
	                {
						let reg= new RegExp("({)" + i + "(})", "g");
	                    result = result.replace(reg, params[i]);
	                }
	            }
	        }
		}
		return result;    
    }
}