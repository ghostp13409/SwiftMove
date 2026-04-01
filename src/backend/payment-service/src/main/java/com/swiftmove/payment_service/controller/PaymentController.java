package com.swiftmove.payment_service.controller;

import com.stripe.exception.StripeException;
import com.swiftmove.payment_service.client.TripServiceClient;
import com.swiftmove.payment_service.dto.CheckoutRequest;
import com.swiftmove.payment_service.dto.CheckoutResponse;
import com.swiftmove.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final TripServiceClient tripServiceClient;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<CheckoutResponse> createCheckoutSession(@RequestBody CheckoutRequest request) throws StripeException {
        CheckoutResponse response = paymentService.createCheckoutSession(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/success/{tripId}")
    public ResponseEntity<Void> paymentSuccess(@PathVariable Long tripId) {
        // In a real app, you'd verify the Stripe session status here.
        // For the demo, we assume success if this endpoint is called.
        tripServiceClient.updateStatus(tripId, "SCHEDULED");
        return ResponseEntity.ok().build();
    }
}
