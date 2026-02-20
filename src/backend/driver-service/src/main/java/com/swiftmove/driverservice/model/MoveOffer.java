package com.swiftmove.driverservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "move_offer")
public class MoveOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "price", nullable = false)
    private long price;

    @Column(name = "offered_date", nullable = false)
    private LocalDateTime offeredDate;

    @Column(name = "move_request_id", nullable = false)
    private Long moveRequestId;

    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "vehicle_id", nullable = false)
    private Long vehicleId;

    @Column(name = "status_id", nullable = false)
    private Long statusId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private java.sql.Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;
}
