package com.swiftMove.address_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@org.springframework.context.annotation.Configuration
public class Configuration {

    //By injecting bean to into spring Container, we are getting the
    //access to the rest template through the application ( DI)
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
