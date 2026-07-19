import { client } from "@/api/client"

interface PaymentDTO {
  id: number
  orderId: number
  gateway: "STRIPE" | "RAZORPAY"
  gatewayPaymentId: string | null
  amount: number
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED"
  clientSecret: string | null
}

export function payWithStripe(orderId: number) {
  return client
    .post<PaymentDTO>("/pagamentos/stripe", { orderId })
    .then((res) => res.data)
}
