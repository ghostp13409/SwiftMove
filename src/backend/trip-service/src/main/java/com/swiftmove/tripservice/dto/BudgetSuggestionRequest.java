package com.swiftmove.tripservice.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetSuggestionRequest {
    private Long fromAddressId;
    private Long toAddressId;
    private Boolean hasFurniture;
}
