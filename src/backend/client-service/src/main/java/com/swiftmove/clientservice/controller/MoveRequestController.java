package com.swiftmove.clientservice.controller;

@RestController
@RequestMapping("/api/move-requests")
public class MoveRequestController {

    @GetMapping("/test")
    public String test() {
        return "Move Request Service is up and running!";
    }
}
