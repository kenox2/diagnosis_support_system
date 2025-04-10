package com.pwr.inz.controller;

import com.pwr.inz.service.AuthService;
import com.pwr.inz.service.ImagesService;
import com.pwr.inz.service.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    public AuthController(AuthService authService, TokenService tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam("login") String login,
                                                  @RequestParam("password") String pass){
        if (login.isEmpty() || pass.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Username or password cannot be empty");
        }
        String token = authService.loginValidation(login,pass);
        if(token == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
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
