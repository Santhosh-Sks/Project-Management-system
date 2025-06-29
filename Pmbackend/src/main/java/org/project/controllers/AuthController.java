package org.project.controllers;

import org.project.models.User;
import org.project.requests.AuthRequest;
import org.project.response.JwtResponse;
import org.project.security.JwtTokenProvider;
import org.project.services.UserService;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

@RequestMapping("/api/auth")

public class AuthController {

    private final UserService userService;

    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider) {

        this.userService = userService;

        this.jwtTokenProvider = jwtTokenProvider;

    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        String token = jwtTokenProvider.generateToken(createdUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(token));
    }


    @PostMapping("/signin")

    public ResponseEntity signin(@RequestBody AuthRequest authRequest) {

        User user = userService.getUserByEmail(authRequest.getEmail());

        if (user != null && BCrypt.checkpw(authRequest.getPassword(), user.getPassword())) {

            String token = jwtTokenProvider.generateToken(user);

            return ResponseEntity.ok(token);

        } else {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        }

    }

}
