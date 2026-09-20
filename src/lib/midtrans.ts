import { envVar, IS_PRODUCTION } from "@/lib/env";

export interface MidtransTransaction {
  token: string;
  redirect_url: string;
}

const SERVER_KEY = envVar("MIDTRANS_SERVER_KEY");

async function api(path: string, body: unknown): Promise<unknown> {
  const base = IS_PRODUCTION
    ? "https://api.midtrans.com/v2"
    : "https://app.sandbox.midtrans.com/snap/v1";

  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(SERVER_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Midtrans API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export async function createSnapTransaction(params: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
}): Promise<MidtransTransaction> {
  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    item_details: [
      {
        id: "service-1",
        price: params.amount,
        quantity: 1,
        name: `Layanan Skripsi Mentor - ${params.orderId}`,
      },
    ],
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone ?? "",
    },
    finish_redirect_url: `${midtransAppUrl()}/dashboard`,
    unfinish_redirect_url: `${midtransAppUrl()}/dashboard`,
    error_redirect_url: `${midtransAppUrl()}/dashboard`,
  };

  const result = (await api("/transactions", payload)) as MidtransTransaction;
  return result;
}

export function midtransAppUrl() {
  return envVar("NEXTAUTH_URL");
}