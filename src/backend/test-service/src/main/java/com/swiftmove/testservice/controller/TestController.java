package com.swiftmove.testservice.controller;

import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@NoArgsConstructor
class TestController {


    @RequestMapping
    public String home() {
        return "Test Service is up and running!";
    }

    @GetMapping("/ping")
    public String ping() {
        return "ping joe mama";
    }
}
