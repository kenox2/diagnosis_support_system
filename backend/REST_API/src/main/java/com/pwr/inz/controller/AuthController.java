package com.pwr.inz.controller;

import com.pwr.inz.service.AuthService;
import com.pwr.inz.service.ImagesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam("login") String login,
                                                  @RequestParam("password") String pass){
        if (login.isEmpty() || pass.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Username or password cannot be empty");
        }
        if(!authService.loginValidation(login, pass)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        String token = authService.generateToken(login);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam("login") String login,
                                           @RequestParam("password") String pass){
        if(authService.registerUser(login, pass)){
            return ResponseEntity.status(HttpStatus.CREATED).body("Account created successfully");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Login already in use");
    }

}
