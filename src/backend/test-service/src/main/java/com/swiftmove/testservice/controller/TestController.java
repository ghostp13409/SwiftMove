package com.swiftmove.testservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/test")
class TestController {

    @GetMapping("/")
    public String home() {
        return "Test Service is up and running!";
    }

    @GetMapping("/ping")
    public String ping() {
        return "ping joe mama";
    }
}
