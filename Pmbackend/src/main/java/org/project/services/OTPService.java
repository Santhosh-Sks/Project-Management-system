package org.project.services;

import org.project.models.OTP;
import org.project.models.User;
import org.project.repositories.OTPRepository;
import org.project.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {
    private final OTPRepository otpRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public OTPService(OTPRepository otpRepository, EmailService emailService, UserRepository userRepository) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public void generateAndSendOTP(String email) {
        String otpCode = generateOTPCode();
        OTP otp = new OTP();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpirationTime(getExpirationTime());
        otpRepository.save(otp);
        emailService.sendOTPEmail(email, otpCode);
    }

    public boolean verifyOTP(String email, String code) {
        Optional<OTP> optionalOTP = otpRepository.findByEmailAndCode(email, code);

        if (optionalOTP.isPresent() && !isOTPExpired(optionalOTP.get())) {
            otpRepository.deleteByEmail(email);

            userRepository.findByEmail(email).ifPresent(user -> {
                user.setVerified(true);
                userRepository.save(user);
            });

            return true;
        }

        return false;
    }

    private String generateOTPCode() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private Date getExpirationTime() {
        return new Date(System.currentTimeMillis() + 5 * 60 * 1000);
    }

    private boolean isOTPExpired(OTP otp) {
        return otp.getExpirationTime().before(new Date());
    }
}
