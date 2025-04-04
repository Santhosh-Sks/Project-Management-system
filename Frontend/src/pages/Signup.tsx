
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { OTPInput } from '@/components/auth/OTPInput';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { signup } from '@/services/authService';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (formData: any) => {
    setIsLoading(true);
    
    try {
      // Call the actual backend signup API
      const response = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      console.log('Signup successful:', response);
      setUserData(formData);
      
      // For now, we'll simulate OTP verification since we don't have it in the backend yet
      setShowOTPVerification(true);
      
      toast({
        title: "Registration Successful!",
        description: `Please verify your account with the code sent to your email and phone.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Signup failed:', error);
      
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    setIsVerifying(true);
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { otp });
      if (response.data.success) {
        setIsSuccess(true);
        toast({ title: "Success!", description: "Account verified.", variant: "default" });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast({ title: "Invalid OTP", description: "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "OTP verification failed.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };
  

  const handleResendOTP = async () => {
    try {
      await axios.post(`${API_URL}/send-otp`, { email: userData.email });
      toast({ title: "OTP Resent!", description: "A new OTP has been sent to your email.", variant: "default" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to resend OTP.", variant: "destructive" });
    }
  };
  

  const handleGoBack = () => {
    setShowOTPVerification(false);
    setUserData(null);
  };

  return (
    <>
      <Navbar />
      <PageContainer className="flex items-center justify-center pt-10 pb-20">
        <Card className="w-full max-w-md p-6 shadow-lg dark:bg-gray-900 dark:border-gray-800">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2">Account Created!</h2>
              <p className="text-center text-muted-foreground mb-6">
                Your account has been successfully created. You will be redirected to login shortly.
              </p>
              <Button asChild>
                <Link to="/login">Go to Login</Link>
              </Button>
            </motion.div>
          ) : showOTPVerification ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="animate-fade-in"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Verify your account</h1>
                <p className="text-muted-foreground mt-2">
                  We've sent a 6-digit verification code to your email and phone.
                </p>
              </div>
              
              <OTPInput 
                length={6}
                onComplete={handleOTPVerification}
                onResend={handleResendOTP}
                isVerifying={isVerifying}
                className="my-8"
              />
              
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleGoBack}
                  className="w-full"
                  disabled={isVerifying}
                >
                  Go back
                </Button>
              </div>
            </motion.div>
          ) : (
            <AuthForm 
              type="signup" 
              onSubmit={handleSignup}
              isLoading={isLoading}
            />
          )}
        </Card>
      </PageContainer>
    </>
  );
};

export default Signup;
