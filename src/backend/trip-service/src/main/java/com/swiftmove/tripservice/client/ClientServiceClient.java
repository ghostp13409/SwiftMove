package com.swiftmove.tripservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "client-service")
public interface ClientServiceClient {
    // Assuming we might need a way to get request IDs for a client
    // For now, let's just assume we can fetch move requests
}
