import { City } from '../models/city.model';
import { State } from '../models/state.model';

export interface AddressState {
	addressStates: State[];
	addressCities: City[];
}
