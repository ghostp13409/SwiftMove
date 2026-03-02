export interface Address {
  id: string | number;
  line1: string;
  line2?: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalOrZipCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressFormData {
  line1: string;
  line2?: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalOrZipCode: string;
}
