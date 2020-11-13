import { Pipe } from '@angular/core';

@Pipe({
	name: 'chargetype',
	pure: true
})

export class ChargeType {
	transform(value) {
		let result = value;
		switch (value) {
            case 1:
              result = 'PARK_CHARGETYPE_NORMAL';
              break;
            case 2:
              result = 'PARK_CHARGETYPE_FREETIME';
              break;
            case 3:
              result = 'PARK_CHARGETYPE_FREE';
              break;
            case 4:
              result = 'PARK_CHARGETYPE_MAX';
              break;
            case 5:
              result = 'PARK_EVENT_TIMEOUT';
              break;
        }
		return result;    
    }
}