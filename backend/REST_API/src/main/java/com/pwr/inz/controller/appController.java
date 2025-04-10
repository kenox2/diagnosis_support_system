package com.pwr.inz.controller.dto;


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

    public appController(ImagesService imagesService) {
        this.imagesService = imagesService;
    }


    @PostMapping("/images")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file,
                                              @RequestParam("name") String name,
                                              @RequestParam("surname") String surname,
                                              @RequestParam("description") String description,
                                              @RequestParam("age") int age) {

        try {
            // Save the file to the directory
            String filePath = imagesService.saveImage(file, uploadDir, name, surname,description, age);
            return ResponseEntity.ok("Image uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }

    @PostMapping("/images_temp")
    public ResponseEntity<String> uploadTempImage(@RequestParam("file") MultipartFile file){
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
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
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
    public ResponseEntity<Resource> predictCustomModel(@RequestParam("model") MultipartFile model,
                                                       @RequestParam("image") MultipartFile image,
                                                       @RequestParam("class_names") MultipartFile class_names){
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

