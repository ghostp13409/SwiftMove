package com.swiftmove.driverservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/move-offers")
public class MoveOfferController {

    @GetMapping("/test")
    public String test() {
        return "Move Offer Service is up and running!";
    }
}
