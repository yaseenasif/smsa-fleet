export interface Region {
  id: number | null | undefined;
  name: string | null | undefined;
  country: string | null | undefined;
  cities: string | null | undefined| string[];
  status: boolean | null | undefined;
  [key: string]: any;
}
