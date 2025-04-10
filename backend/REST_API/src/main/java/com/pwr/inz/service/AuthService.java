package com.pwr.inz.service;

import com.pwr.inz.infrastructure.Repos.UserRepository;
import com.pwr.inz.infrastructure.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public String loginValidation(String login, String pass){
        var user = userRepository.findByLogin(login);
        if (user.isEmpty()) return null;
        if(passwordEncoder.matches(pass, user.get().getPassword())){
            return tokenService.generateToken(login);
        }
        return null;
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

    public boolean request_filter(String authHeader){
         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        try{
            tokenService.validateToken(token);  // Validate the token
            return true;  // Valid token, status 200
        }catch(Exception e){
            return false;
        }
    }

}
