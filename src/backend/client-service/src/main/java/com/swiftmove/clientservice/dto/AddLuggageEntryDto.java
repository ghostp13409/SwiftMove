package com.swiftmove.clientservice.dto;

import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.model.LuggageTypeEnum;
import com.swiftmove.clientservice.model.MoveRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AddLuggageEntryDto {
    private Long id;
    private Integer quantity;
    private Long moveRequestId;
    private LuggageTypeEnum luggageType;
}
