package com.pwr.inz.infrastructure.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "imgs")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long img_id;

    @ManyToOne
    @JoinColumn(referencedColumnName = "patient_id")
    private Patient patient;

    @Basic
    private String description;

    @Basic
    @Column(unique = true)
    private String img_path;

    @Basic
    private String classification;

    public Image() {}

    public Image(Patient patient, String description, String img_path) {
        this.patient = patient;
        this.description = description;
        this.img_path = img_path;
    }

    public Long getImg_id() {
        return img_id;
    }

    public void setImg_id(Long img_id) {
        this.img_id = img_id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImg_path() {
        return img_path;
    }

    public void setImg_path(String img_path) {
        this.img_path = img_path;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }
}
