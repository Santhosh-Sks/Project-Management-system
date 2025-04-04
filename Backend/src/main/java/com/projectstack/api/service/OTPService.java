package com.projectstack.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    private EmailService emailService;

    private final Map<String, String> otpStorage = new HashMap<>(); // Stores OTPs per email

    public String generateOTP(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
        otpStorage.put(email, otp); // Store OTP in memory
        return otp;
    }

    public void sendOTPEmail(String email) {
        String otp = otpStorage.get(email); // Retrieve OTP
        if (otp != null) {
            emailService.sendEmail(email, "Your OTP Code", "Your OTP is: " + otp + "\nValid for 5 minutes.");
        } else {
            throw new IllegalStateException("OTP not generated for this email.");
        }
    }

    public boolean validateOTP(String inputOTP, String email) {
        return otpStorage.containsKey(email) && otpStorage.get(email).equals(inputOTP);
    }
}
