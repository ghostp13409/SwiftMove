package com.swiftmove.driverservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "driver_info")
public class DriverInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driving_experience", nullable = false)
    private int drivingExperience;

    @Column(name = "range_km", nullable = false)
    private float range;

    @Column(name = "driving_license", nullable = false, unique = true)
    private String drivingLicense;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private java.sql.Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;
}
