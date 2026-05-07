type Order = {
  id: string;
  customer_name: string;
  phone: string;
  amount: number;
  status: "paid" | "failed";
  payment_intent: string;
};

export const orders: Order[] = [];