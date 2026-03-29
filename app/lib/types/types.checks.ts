export type CheckCardType = {
  id: string;
  title: string;
  created_at: Date;
  icon_url: string | null;

  total_amount: string;
  paid_amount: string;

  participants_count: number;
  paid_participants_count: number;
};
