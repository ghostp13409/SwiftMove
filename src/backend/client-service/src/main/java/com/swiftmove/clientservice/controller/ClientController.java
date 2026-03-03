package com.swiftmove.clientservice.controller;

import com.swiftmove.clientservice.client.AuthClient;
import com.swiftmove.clientservice.dto.AuthUserResponseDto;
import com.swiftmove.clientservice.dto.MoveOfferDto;
import com.swiftmove.clientservice.model.MoveRequest;
import com.swiftmove.clientservice.service.MoveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final MoveRequestService moveRequestService;
    private final AuthClient authClient;

    @GetMapping("/test")
    public Object test(@RequestHeader (value = "Authorization", required = false) String authHeader) {
        Object authUser = authClient.getCurrentUser(authHeader);
        return authUser;
    }
}
