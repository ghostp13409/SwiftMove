export type LuggageType = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE' | 'EXTRA_EXTRA_LARGE';

export interface LuggageTypeInfo {
  id?: string | number;
  type: LuggageType;
  name: string;
  volume: number; // cubic feet
  weight: number; // lbs
}

export interface LuggageEntry {
  id?: string | number;
  quantity: number;
  luggageTypeId: string | number;
  luggageType?: LuggageTypeInfo;
}

export interface LuggageFormData {
  quantity: number;
  luggageTypeId: string | number;
}
