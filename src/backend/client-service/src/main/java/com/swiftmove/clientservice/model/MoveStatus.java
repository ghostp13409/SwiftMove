package com.swiftmove.clientservice.model;

public enum MoveStatus {
    CREATED,
    OFFER_SENT,
    OFFER_AVAILABLE,
    ACCEPTED,
    REJECTED,
    CANCELLED,
    SCHEDULED,
    IN_PROGRESS,
    DRIVER_COMPLETED,
    COMPLETED_BY_DRIVER, // Keep for backward compatibility if used, but we'll use DRIVER_COMPLETED mostly
    COMPLETED,
    PENDING,
    CONFIRMED,
    PAYMENT_COMPLETED,
    PAYMENT_PENDING,
    REFUNDED
}
