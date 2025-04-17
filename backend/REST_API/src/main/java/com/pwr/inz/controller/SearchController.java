package com.pwr.inz.controller;

import com.pwr.inz.controller.dto.PatientImageDTO;
import com.pwr.inz.infrastructure.Repos.ImageRepository;
import com.pwr.inz.infrastructure.entities.Image;
import com.pwr.inz.infrastructure.entities.Patient;
import com.pwr.inz.service.AuthService;
import com.pwr.inz.service.SearchService;
import org.springframework.core.io.Resource;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;
    private final ImageRepository imageRepository;
    private final AuthService authService;

    @Autowired
    public SearchController(SearchService searchService, ImageRepository imageRepository, AuthService authService) {
        this.searchService = searchService;
        this.imageRepository = imageRepository;
        this.authService = authService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<PatientImageDTO>> getItems(@RequestHeader("Authorization") String authHeader,
            @RequestParam("query") String queryString) {
        if(!authService.request_filter(authHeader)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        System.out.println("getting into function");
        String[] tokens = searchService.tokenize(queryString);
        if (tokens.length == 0) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("sa tokeny: " + tokens[0]);
        Optional<List<Patient>> optionalPatients = searchService.findMatches(tokens);
        if (optionalPatients.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("sa pacjenci");

        List<Patient> patients = optionalPatients.get();
        List<PatientImageDTO> dtos = new ArrayList<>();

        // For each patient, iterate over the images and build the DTO
        for (Patient patient : patients) {
            System.out.println("weszlismy do loopy");
            Optional<List<Image>> optionalImages = imageRepository.findByPatient(patient);
            if (optionalImages.isEmpty()) {
                continue;
            }
            var images = optionalImages.get();
            long i = 0;
            for (Image image : images) {
                // Build the URL to fetch the actual image (use image id)
                String imageUrl = "/api/search/images/" + image.getImg_id();
                dtos.add(new PatientImageDTO(
                        i,
                        patient.getName() + " " + patient.getSurname(),
                        image.getDescription(),
                        imageUrl
                ));
                i++;
            }
        }
        System.out.println("Returning correct value");
        return ResponseEntity.ok(dtos);
    }

    /**
     * Endpoint to serve an image as a Resource.
     */
    @GetMapping("/images/{id}")
    public ResponseEntity<Resource> getImage(//@RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        //if(!authService.request_filter(authHeader)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Optional<Image> imageOpt = imageRepository.findById(id);
        if (imageOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try{
            Image image = imageOpt.get();
            Path imagePath = Paths.get(image.getImg_path());
            Resource resource = new UrlResource(imagePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
        catch (MalformedURLException e){
            return ResponseEntity.internalServerError().build();
        }
    }



}
