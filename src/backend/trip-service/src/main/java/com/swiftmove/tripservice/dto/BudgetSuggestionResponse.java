package com.swiftmove.tripservice.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetSuggestionResponse {
    private Double distance;
    private Double suggestedMaxBudget;
    private Double averagePricePerKm;
}
