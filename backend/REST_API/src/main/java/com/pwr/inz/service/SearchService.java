package com.pwr.inz.service;

import com.pwr.inz.infrastructure.Repos.ImageRepository;
import com.pwr.inz.infrastructure.Repos.PatientRepository;
import com.pwr.inz.infrastructure.entities.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class SearchService {
    private final PatientRepository patientRepository;
    private final ImageRepository imageRepository;

    @Autowired
    public SearchService(PatientRepository patientRepository, ImageRepository imageRepository) {
        this.patientRepository = patientRepository;
        this.imageRepository = imageRepository;
    }

    public String[] tokenize(String query){
        return query.split(" ");
    }

     public Optional<List<Patient>> findMatches(String[] tokens) {
        Optional<List<Patient>> patientsOptional = Optional.empty();
        if (tokens.length == 1) {
            patientsOptional = patientRepository.findByNameContainingIgnoreCase(tokens[0]);
        } else if (tokens.length == 2) {
            patientsOptional = patientRepository.findByNameAndSurnameAllIgnoreCase(tokens[0], tokens[1]);
        }
        // If the Optional is present but empty, return Optional.empty()
        if (patientsOptional.isPresent() && patientsOptional.get().isEmpty()) {
            return Optional.empty();
        }
        return patientsOptional;
    }
}

