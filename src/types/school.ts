export type Comments = {
  type: string;
  content: {
    type: string;
    content: {
      text: string;
      type: string;
    }[];
  }[];
};

export type School = {
  phone: string;
  name: string;
  address: string;
  id: number;
  search: string;
  cityhall_id: string;
  user_id: string;
  pos: number;
  csv_name: string;
  number: number;
  comments?: Comments;
};
