package com.swiftmove.clientservice.dto;

import com.swiftmove.clientservice.model.LuggageTypeEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LuggageTypeDto {
    private Long id;
    private LuggageTypeEnum type;
    private LuggageTypeEnum luggageTypeEnum;
    private String name;
    private Double volume;
    private Double weight;
}
