package org.project.controllers;


import jakarta.validation.Valid;
import org.project.requests.OTPRequest;
import org.project.services.OTPService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
public class OTPController {
    private final OTPService otpService;
    public OTPController(OTPService otpService) {
        this.otpService = otpService;
    }
    @PostMapping("/send")
    public ResponseEntity<Void> sendOTP(@RequestBody OTPRequest request) {
        System.out.println("=== OTP SEND REQUEST ===");
        System.out.println("Email: " + request.getEmail());

        try {
            otpService.generateAndSendOTP(request.getEmail());
            System.out.println("OTP sent successfully to: " + request.getEmail());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error sending OTP: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/verify")
    public ResponseEntity<Void> verifyOTP(@Valid @RequestBody OTPRequest request) {
        boolean isValid = otpService.verifyOTP(request.getEmail(), request.getCode());
        if (isValid) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
