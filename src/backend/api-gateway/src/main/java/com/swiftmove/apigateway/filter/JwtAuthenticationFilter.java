package com.swiftmove.apigateway.filter;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.swiftmove.apigateway.util.JwtUtil;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GatewayFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        final List<String> publicEndpoints = List.of(
                "/auth/login", "/auth/register", "/auth/logout", "/auth/check",
                "/v1/auth/login", "/v1/auth/register", "/v1/auth/logout", "/v1/auth/check",
                "/eureka", "/payments"
        );

        // Check if request path matches any public endpoint
        boolean isPublicEndpoint = publicEndpoints.stream()
                .anyMatch(endpoint -> request.getURI().getPath().startsWith(endpoint));

        // If it's a public endpoint, skip JWT validation
        if (isPublicEndpoint) {
            return chain.filter(exchange);
        }

        // For secured endpoints, validate JWT token
        if (authMissing(request))
            return onError(exchange);

        String token = request.getHeaders().getOrEmpty("Authorization").get(0);

        if (token != null && token.startsWith("Bearer "))
            token = token.substring(7);

        try {
            jwtUtil.validateToken(token);
        } catch (Exception e) {
            return onError(exchange);
        }

        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }

    private boolean authMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsHeader("Authorization");
    }
}
