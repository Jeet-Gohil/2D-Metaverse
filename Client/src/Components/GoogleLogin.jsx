import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';


const GoogleLoginButton = () => {
  // Decode the JWT token
  const navigate = useNavigate();
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Handle successful login
  const handleSuccess = async (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    navigate('/VirtualOffice');

    // Decode the JWT token to get user information
    const decodedToken = parseJwt(credentialResponse.credential);
    console.log('Decoded Token:', decodedToken);

    // Extract user data
    const userData = {
      googleId: decodedToken.sub, // Unique Google ID
      email: decodedToken.email, // User's email
      name: decodedToken.name, // User's full name
      picture: decodedToken.picture, // Profile picture URL
      emailVerified: decodedToken.email_verified, // Email verification status
    };

    

    // Send user data to the backend
    try {
      const response = await fetch ("http://localhost:5000/api/auth/google" ,{
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log(data);
      
        // const response = await ApiIndex.post(`/auth/google`, userData);
        // console.log('User saved:', response.data);
        // message.success('Google login successful!');
      } catch (error) {
        console.error('Error saving user:', error);
        message.error('Failed to save user data.');
      }
    
  };

  // Handle login failure
  const handleError = () => {
    console.log('Login Failed');
    message.error('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId="374831140183-4aai95qv8bili87uecdt6t4do026h437.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap // Enable one-tap sign-in
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;