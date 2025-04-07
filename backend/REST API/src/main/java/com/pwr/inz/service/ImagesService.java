package com.pwr.inz.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ImagesService {

    private final RestClient restClient;

    public ImagesService(RestClient restClient) {
        this.restClient = restClient;
    }


    public String saveImage(MultipartFile file, String uploadDir) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
    }
    public Resource predict(Path filename) throws IOException {
        Resource img = new UrlResource(filename.toUri());

        MultiValueMap<String , Object> parts = new LinkedMultiValueMap<>();
        parts.add("file", img);
        // Send http request to external API for prediction
        byte[] result = restClient.post()
                .uri("/predict")
                .body(parts)
                .retrieve()
                .body(byte[].class);

        System.out.println("we have result");
        Files.write(filename, result);
        Resource imgPrediction = new UrlResource(filename.toUri());
        return imgPrediction;
    }
}
