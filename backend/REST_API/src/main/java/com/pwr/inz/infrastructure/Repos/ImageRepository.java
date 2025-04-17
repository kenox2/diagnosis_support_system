package com.pwr.inz.infrastructure.Repos;

import com.pwr.inz.infrastructure.entities.Image;
import com.pwr.inz.infrastructure.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<List<Image>> findByPatient(Patient patient);
}
