package com.pwr.inz.infrastructure.Repos;

import com.pwr.inz.infrastructure.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
