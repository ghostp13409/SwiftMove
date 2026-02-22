package com.swiftmove.clientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MoveReqPostDto {
    private LocalDate moveDate;
    private Long maxBudget;
    private Long clientId;
    private Long fromAddressId;
    private Long toAddressId;
    private String status;
}
