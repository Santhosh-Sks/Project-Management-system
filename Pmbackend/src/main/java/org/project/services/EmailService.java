package org.project.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendTaskAssignmentEmail(String toEmail, String taskTitle) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("New Task Assigned: " + taskTitle);

            String content = getTaskAssignmentEmailContent(taskTitle);
            helper.setText(content, true); // true enables HTML

            mailSender.send(message);
            System.out.println("Task assignment email sent to " + toEmail);
        } catch (MessagingException | MailException e) {
            System.err.println("Failed to send task assignment email to " + toEmail);
            e.printStackTrace();
        }
    }

    public void sendInvitationEmail(String toEmail, String projectId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("You're Invited to Collaborate on a Project!");

            String content = getInvitationEmailContent(projectId);
            helper.setText(content, true);

            mailSender.send(message);
            System.out.println("Invitation email sent successfully to " + toEmail);
        } catch (MessagingException | MailException e) {
            System.err.println("Failed to send invitation email to " + toEmail);
            e.printStackTrace();
        }
    }

    public String sendOTPEmail(String toEmail, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your One-Time Password (OTP)");

            String content = "<html><body>" +
                    "<h2 style='color:#2E86C1;'>Your OTP Code</h2>" +
                    "<p>Use the following OTP to verify your email:</p>" +
                    "<h3 style='color:#E74C3C;'>" + otpCode + "</h3>" +
                    "<p>This OTP is valid for 5 minutes.</p>" +
                    "</body></html>";

            helper.setText(content, true);
            mailSender.send(message);

            return "OTP sent successfully to " + toEmail;
        } catch (MessagingException | MailException e) {
            e.printStackTrace();
            return "Failed to send OTP to " + toEmail;
        }
    }

    private String getTaskAssignmentEmailContent(String taskTitle) {
        return "<html><body>" +
                "<h2 style='color:#28B463;'>New Task Assigned</h2>" +
                "<p>You’ve been assigned the task: <strong>" + taskTitle + "</strong>.</p>" +
                "<p>Log in to your dashboard to view the task details and start working.</p>" +
                "<hr><p style='font-size:12px; color:#888;'>If you weren't expecting this email, you can ignore it.</p>" +
                "</body></html>";
    }

    private String getInvitationEmailContent(String projectId) {
        String projectLink = "http://localhost:3000/projects/" + projectId;

        return "<html><body>" +
                "<h2 style='color:#2E86C1;'>You have been invited to a project!</h2>" +
                "<p>Click the link below to join:</p>" +
                "<p><a href='" + projectLink + "' style='color:#1ABC9C;'>Join Project</a></p>" +
                "<hr><p style='font-size:12px; color:#888;'>If this wasn't expected, ignore this email.</p>" +
                "</body></html>";
    }
    public void sendEmail(String toEmail, String subject, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(message, false); // false means plain text

            mailSender.send(mimeMessage);
            System.out.println("Email sent to " + toEmail);
        } catch (MessagingException | MailException e) {
            System.err.println("Failed to send email to " + toEmail);
            e.printStackTrace();
        }
    }

}
