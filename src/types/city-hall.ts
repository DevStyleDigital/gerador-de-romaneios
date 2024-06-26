export type Food = {
  id: number;
  name: string;
  type: 'kg' | 'ud' | 'mc';
  value: string | number | undefined;
  weight: Food['type'] extends 'kg' ? undefined : number | string;
}

export type CityHall = {
  id: string;
  emblem: string;
  cnpj: string;
  phone: string;
  name: string;
  address: string;
  user_id: string;
  search: string;
  foods: Food[];
};
