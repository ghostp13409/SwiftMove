package com.swiftmove.driverservice.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "move_offer")
public class MoveOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price", nullable = false)
    private Long price;

    @Column(name = "offered_date", nullable = false)
    private LocalDateTime offeredDate;

    @Column(name = "move_request_id", nullable = false)
    private Long moveRequestId;

    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "status", nullable = false)
    private Long statusId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public MoveOffer() {}

    public MoveOffer(Long id, Long price, LocalDateTime offeredDate, Long moveRequestId, Long driverId, Long vehicleId, Long statusId, Timestamp createdAt, Timestamp updatedAt) {
        this.id = id;
        this.price = price;
        this.offeredDate = offeredDate;
        this.moveRequestId = moveRequestId;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.statusId = statusId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPrice() { return price; }
    public void setPrice(Long price) { this.price = price; }

    public LocalDateTime getOfferedDate() { return offeredDate; }
    public void setOfferedDate(LocalDateTime offeredDate) { this.offeredDate = offeredDate; }

    public Long getMoveRequestId() { return moveRequestId; }
    public void setMoveRequestId(Long moveRequestId) { this.moveRequestId = moveRequestId; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public Long getStatusId() { return statusId; }
    public void setStatusId(Long statusId) { this.statusId = statusId; }

    public Timestamp getCreatedAt() { return createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
}
