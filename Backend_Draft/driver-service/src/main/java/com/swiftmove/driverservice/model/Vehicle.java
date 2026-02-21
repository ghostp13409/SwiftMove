package com.swiftmove.driverservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "make", nullable = false)
    private String make;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "price_per_km", nullable = false)
    private Long pricePerKm;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "can_carry_furniture", nullable = false)
    private Boolean canCarryFurniture;

    @Column(name = "driver_id", nullable = false)
    private Long driverInfoId;

    @Column(name = "vehicle_type_id", nullable = false)
    private Long vehicleTypeId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private java.sql.Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;
}
