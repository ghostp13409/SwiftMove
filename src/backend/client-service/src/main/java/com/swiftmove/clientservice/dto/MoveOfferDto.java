package com.swiftmove.clientservice.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MoveOfferDto {

    private Long id;
//    f_Name + l_Name (Driver:User)
    private String driverName;
//    Vehicle(Make + Model + Year + (VehicleType) )
    private String vehicleName;
    private Long price;
//    MoveOffer Status
    private String status;
    private Long moveRequestId;

}
