package com.swiftmove.clientservice.service;

import com.swiftmove.clientservice.client.AuthClient;
import com.swiftmove.clientservice.client.UserClient;
import com.swiftmove.clientservice.dto.AuthUserResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final AuthClient authClient;


}
