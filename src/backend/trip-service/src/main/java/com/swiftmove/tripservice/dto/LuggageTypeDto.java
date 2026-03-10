package com.swiftmove.tripservice.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LuggageTypeDto {
    private Long id;
    private String type;
    private String name;
    private Double volume;
    private Double weight;
}
