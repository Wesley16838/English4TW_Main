export type NItem = {
  word: string;
  index: number;
  id: number
};

export type SItem = {
  title: string;
  subtitle?: string;
  speech?: string;
  detail: string;
  buttons: any;
  OnClick:()=>void;
  OnCompare?:()=>void;
};
