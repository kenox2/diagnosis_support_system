package com.pwr.inz.infrastructure.Repos;

import com.pwr.inz.infrastructure.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface patientRepository extends JpaRepository<Patient, Long> {

}
