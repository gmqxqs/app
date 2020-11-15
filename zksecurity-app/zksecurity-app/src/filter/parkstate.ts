import { Pipe } from '@angular/core';

@Pipe({
	name: 'parkstate',
	pure: true
})

export class ParkState {
	transform(value) {
		let result = value;
		switch (value) {
            case 1:
              result = 'PARK_AREA_IN';
              break;
            case 2:
              result = 'PARK_AREA_OUT';
              break;
            case 3:
              result = 'PARK_AREA_SIN';
              break;
            case 4:
              result = 'PARK_AREA_SOUT';
              break;
            case 5:
              result = 'PARK_CHARGE_CENTER';
              break;
            case 6:
              result = 'PARK_CHARGE_CENTEROUT';
              break;
        }
		return result;    
    }
}