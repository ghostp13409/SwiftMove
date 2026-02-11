package com.swiftMove.user_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "address")
public class Address {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "line1")
    private String line1;

    @Column(name = "line2")
    private String line2;
    @Column(name = "city")
    private String city;
    @Column(name = "state_or_province")
    private String province;
    @Column(name = "country")
    private String country;
    @Column(name = "postal_or_zip_code")
    private String postalCode;

    @Column(name = "created_at")
    private LocalDate createdDate;
    @Column(name = "updated_at")
    private LocalDate updatedDate;



}
