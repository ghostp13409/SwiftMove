package com.swiftmove.driverservice.model;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "driver_info")
public class DriverInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driving_experience", nullable = false)
    private Integer drivingExperience;

    @Column(name = "range", nullable = false)
    private Float range;

    @Column(name = "driving_license", nullable = false, unique = true)
    private String drivingLicense;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public DriverInfo() {}

    public DriverInfo(Long id, Integer drivingExperience, Float range, String drivingLicense, Long userId, Timestamp createdAt, Timestamp updatedAt) {
        this.id = id;
        this.drivingExperience = drivingExperience;
        this.range = range;
        this.drivingLicense = drivingLicense;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDrivingExperience() {
        return drivingExperience;
    }

    public void setDrivingExperience(Integer drivingExperience) {
        this.drivingExperience = drivingExperience;
    }

    public Float getRange() {
        return range;
    }

    public void setRange(Float range) {
        this.range = range;
    }

    public String getDrivingLicense() {
        return drivingLicense;
    }

    public void setDrivingLicense(String drivingLicense) {
        this.drivingLicense = drivingLicense;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }
}
