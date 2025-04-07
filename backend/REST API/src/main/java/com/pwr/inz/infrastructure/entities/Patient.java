package com.pwr.inz.infrastructure.entities;


import jakarta.persistence.*;

@Entity
@Table(name="patients", schema="inz")
public class Patient {
    @Id
    private Long id;

    @Basic
    private String name;

    @Basic
    private String surname;

    @Basic
    private int age;

    @Basic
    private String description;

    @Basic
    @Column(unique = true)
    private String img_path;

    @Basic
    private String classification;
    
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
