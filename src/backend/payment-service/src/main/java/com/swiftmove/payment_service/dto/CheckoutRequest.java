package com.swiftmove.payment_service.dto;

public class CheckoutRequest {
    private Long tripId;
    private Long amount;
    private String currency = "cad";
    private String successUrl;
    private String cancelUrl;

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    
    public String getCurrency() { return currency != null ? currency : "cad"; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getSuccessUrl() { return successUrl; }
    public void setSuccessUrl(String successUrl) { this.successUrl = successUrl; }
    
    public String getCancelUrl() { return cancelUrl; }
    public void setCancelUrl(String cancelUrl) { this.cancelUrl = cancelUrl; }

    @Override
    public String toString() {
        return "CheckoutRequest{" +
                "tripId=" + tripId +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", successUrl='" + successUrl + '\'' +
                ", cancelUrl='" + cancelUrl + '\'' +
                '}';
    }
}
