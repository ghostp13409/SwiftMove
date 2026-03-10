package com.swiftmove.tripservice.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LuggageEntryDto {
    private Long id;
    private Integer quantity;
    private Long moveRequestId;
    private Long luggageTypeId;
}
