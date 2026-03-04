package com.swiftmove.clientservice.dto;

import com.swiftmove.clientservice.model.Client;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

// THIS IS A SUPER DTO!!!!!!!!!!
// and Annlin is Gay.
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MoveTripDto {
    private Long id;
    private Long moveRequestId;
    private Long moveOfferId;
    private String status;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
