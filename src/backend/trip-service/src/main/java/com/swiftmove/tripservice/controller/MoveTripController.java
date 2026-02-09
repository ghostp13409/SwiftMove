package com.swiftmove.tripservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/move-trips")
public class MoveTripController {

    @GetMapping("/test")
    public String test() {
        return "Move Trip Service is up and running!";
    }
}
