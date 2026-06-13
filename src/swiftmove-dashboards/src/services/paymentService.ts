import apiClient from "./apiClient";

export interface CheckoutRequest {
  tripId: number;
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export const paymentService = {
  createCheckoutSession: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await apiClient.post("/payments/create-checkout-session", data);
    return response.data.data || response.data;
  },

  confirmPaymentSuccess: async (tripId: number): Promise<void> => {
    await apiClient.post(`/payments/success/${tripId}`);
  }
};
