package com.swiftmove.clientservice.controller;

import com.swiftmove.clientservice.model.LuggageType;
import com.swiftmove.clientservice.repo.LuggageTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/luggage-types")
@RequiredArgsConstructor
public class LuggageTypeController {

    private final LuggageTypeRepository luggageTypeRepository;

    @GetMapping
    public List<LuggageType> getAllLuggageTypes() {
        return luggageTypeRepository.findAll();
    }
}
