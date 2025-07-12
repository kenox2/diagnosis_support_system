package com.pwr.inz.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AppConfig {

    @Value("${python.backend-url}")
    private String pyBackEnd;

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(pyBackEnd)
                .build();
    }
}
