package com.swiftmove.clientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
