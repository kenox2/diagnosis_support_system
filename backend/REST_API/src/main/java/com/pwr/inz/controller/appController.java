package com.pwr.inz.controller.dto;


import com.pwr.inz.service.AuthService;
import com.pwr.inz.service.ImagesService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Controller
@RequestMapping("/api/uploads")
public class appController {
    @Value("${file.upload-dir}")
    private String uploadDir;


    private final ImagesService imagesService;
    private final AuthService authService;

    @Autowired
    public appController(ImagesService imagesService, AuthService authService) {
        this.imagesService = imagesService;
        this.authService = authService;
    }


    @PostMapping("/images")
    public ResponseEntity<String> uploadImage(@RequestHeader("Authorization") String authHeader,
                                              @RequestParam("file") MultipartFile file,
                                              @RequestParam("name") String name,
                                              @RequestParam("surname") String surname,
                                              @RequestParam("description") String description,
                                              @RequestParam("age") int age) {
        if(!authService.request_filter(authHeader)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            // Save the file to the directory
            String filePath = imagesService.saveImage(file, uploadDir, name, surname,description, age);
            return ResponseEntity.ok("Image uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }

    @PostMapping("/images_temp")
    public ResponseEntity<String> uploadTempImage(@RequestHeader("Authorization") String authHeader,
                                                  @RequestParam("file") MultipartFile file){
        if(!authService.request_filter(authHeader)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
             //Save the file to the directory
            System.out.println("going into function");
            String filePath = imagesService.tempSaveImgForPred(file, uploadDir+"/temp");
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }


    }


    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@RequestHeader("Authorization") String authHeader,
                                             @PathVariable String filename) {
        if(!authService.request_filter(authHeader)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            Path filePath = Paths.get(uploadDir + "/temp").resolve(filename);
            System.out.println("File paths is: " + filePath.toString());
            Resource resource = imagesService.predict(filePath);
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/predict/own_model")
    public ResponseEntity<Resource> predictCustomModel(@RequestHeader("Authorization") String authHeader,
                                                       @RequestParam("model") MultipartFile model,
                                                       @RequestParam("image") MultipartFile image,
                                                       @RequestParam("class_names") MultipartFile class_names){
        if(!authService.request_filter(authHeader)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try{
            Resource resource = imagesService.predictCustomModel(model, image, class_names);
            return ResponseEntity.ok().
                    contentType(MediaType.IMAGE_JPEG).
                    body(resource);
        }catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }


}

