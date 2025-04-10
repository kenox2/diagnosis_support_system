package com.pwr.inz.service;

import com.pwr.inz.infrastructure.Repos.ImageRepository;
import com.pwr.inz.infrastructure.Repos.PatientRepository;
import com.pwr.inz.infrastructure.entities.Image;
import com.pwr.inz.infrastructure.entities.Patient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ImagesService {

    private final RestClient restClient;
    private final PatientRepository patientRepository;
    private final ImageRepository imageRepository;

    public ImagesService(RestClient restClient, PatientRepository patientRepository, ImageRepository imageRepository) {
        this.restClient = restClient;
        this.patientRepository = patientRepository;
        this.imageRepository = imageRepository;
    }

    private Path saveImg(MultipartFile file, String uploadDir) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }



        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filePath;
    }

     public String tempSaveImgForPred(MultipartFile file, String uploadDir) throws IOException {
        var filePath = saveImg(file, uploadDir);
        return filePath.getFileName().toString();
     }

    public String saveImage(MultipartFile file, String uploadDir, String name, String surname,String description, int age) throws IOException {
        var filePath = saveImg(file, uploadDir);
        System.out.println(filePath);
        System.out.println(name);
        System.out.println(surname);
        System.out.println(description);
        System.out.println(age);


        var patient_check = patientRepository.findByNameAndSurname(name, surname);
        Patient patient;
        if(!patient_check.isPresent()){
            patient = new Patient(name, surname, age);
            patient = patientRepository.save(patient);

        }else{
            patient = patient_check.get();
        }

        Image image = new Image(patient, description, filePath.toString());

        imageRepository.save(image);

        return filePath.toString();
    }


    public  Resource predictCustomModel(MultipartFile model, MultipartFile image, MultipartFile class_names ) throws IOException{
        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
        formData.add("model", model.getResource());
        formData.add("image", image.getResource());
        formData.add("class_names", class_names.getResource());
        byte[] result = restClient.post().
                uri("/predict/own_model")
                .body(formData)
                .retrieve()
                .body(byte[].class);
        Resource imgPred = new ByteArrayResource(result);
        return imgPred;
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


        Files.write(filename, result);
        Resource imgPrediction = new UrlResource(filename.toUri());
        return imgPrediction;
    }


}
