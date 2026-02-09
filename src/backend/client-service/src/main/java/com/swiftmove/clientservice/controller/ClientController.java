package com.swiftmove.clientservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @GetMapping("/test")
    public String test() {
        return "Client Service is up and running!";
    }
}
