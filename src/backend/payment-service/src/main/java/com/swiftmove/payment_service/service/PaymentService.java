package com.swiftmove.payment_service.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.swiftmove.payment_service.dto.CheckoutRequest;
import com.swiftmove.payment_service.dto.CheckoutResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public CheckoutResponse createCheckoutSession(CheckoutRequest request) throws StripeException {
        System.out.println("Payment Request: " + request);
        
        String currency = request.getCurrency();
        if (currency == null || currency.trim().isEmpty()) {
            currency = "cad";
        } else {
            currency = currency.toLowerCase();
        }
        
        long amount = (request.getAmount() != null) ? request.getAmount() : 10L;
        long unitAmount = amount * 100;

        System.out.println("Final Stripe Params: tripId=" + request.getTripId() + ", amount=" + unitAmount + ", currency=" + currency);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.getSuccessUrl())
                .setCancelUrl(request.getCancelUrl())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(currency)
                                .setUnitAmount(unitAmount)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("SwiftMove Trip #" + request.getTripId())
                                        .build())
                                .build())
                        .build())
                .putMetadata("tripId", String.valueOf(request.getTripId()))
                .build();

        Session session = Session.create(params);
        return new CheckoutResponse(session.getId(), session.getUrl());
    }
}
