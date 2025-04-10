package com.pwr.inz.service;

import com.pwr.inz.infrastructure.Repos.UserRepository;
import com.pwr.inz.infrastructure.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean loginValidation(String login, String pass){
        var user = userRepository.findByLogin(login);
        if (user.isEmpty()) return false;

        return passwordEncoder.matches(pass, user.get().getPassword());
    }

    public boolean registerUser(String username, String pass){


        if (userRepository.findByLogin(username).isPresent()){
            return false;
        }
        String hashedPassword = passwordEncoder.encode(pass);
        User user = new User();
        user.setLogin(username);
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return true;
    }

    public String generateToken(String login){
        return login;
    }
}
