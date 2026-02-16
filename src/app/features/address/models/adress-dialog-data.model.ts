import { Address } from '../../../shared/models/address.model';

export interface AddressDialogData {
	title: string;
	address: Address | null;
}
