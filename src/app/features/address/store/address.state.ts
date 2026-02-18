import { Address } from 'src/app/shared/models/address.model';
import { City } from '../models/city.model';
import { State } from '../models/state.model';

export interface AddressState {
	address: Address | null;
	addressStates: State[];
	addressCities: City[];
}
