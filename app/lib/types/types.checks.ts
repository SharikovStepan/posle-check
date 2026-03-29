export type CheckByUserCardType = {
  id: string;
  title: string;
  created_at: Date;
  icon_url: string | null;

  total_amount: string;
  paid_amount: string;

  participants_count: number;
  paid_participants_count: number;
};


export type CheckToUserCardType = {
	id: string;
	title: string;
	icon_url: string | null;
	created_at: Date;
 
	participated: boolean;
	is_paid: boolean;
 
	share_amount: string | null;
 };