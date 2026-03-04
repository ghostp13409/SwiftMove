package com.swiftmove.driverservice.dto;

import com.swiftmove.driverservice.model.VehicleTypeEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleTypeDto {
    private Long id;
    private VehicleTypeEnum type;
    private Double maxWeight;
    private Double capacity;
}
