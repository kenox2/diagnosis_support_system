package com.pwr.inz.infrastructure.Repos;

import com.pwr.inz.infrastructure.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByNameAndSurname(String name, String surname);
}
