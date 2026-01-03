import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel, FormsModule } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string = '';
  password: string = '';
  errorMsg: string = '';
  googleSignInLoading: boolean = false;
  isLoggingIn: boolean = false; // Flag to hide component during navigation
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      console.log('User already logged in:', currentUser);
      this.isLoggingIn = true;
      this.router.navigate(['/games']);
      return;
    }
    
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn(): void {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: '1035680622930-6hkv4tvl97u1du9lacij63gqrikcl04q.apps.googleusercontent.com', // REPLACE WITH YOUR GOOGLE CLIENT ID
          callback: this.handleGoogleSignIn.bind(this)
        });

        // Render the Google Sign-In button
        const googleButton = document.getElementById('google-signin-btn');
        if (googleButton) {
          google.accounts.id.renderButton(
            googleButton,
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              locale: 'en'
            }
          );
        }
      }
    };
  }

  handleGoogleSignIn(response: any): void {
    console.log('handleGoogleSignIn called with response:', response);
    
    if (response.credential) {
      this.googleSignInLoading = true;
      
      try {
        // Decode the JWT token to get user info
        const decodedToken = this.parseJwt(response.credential);
        
        console.log('Google User:', decodedToken);
        
        if (!decodedToken) {
          this.errorMsg = 'Failed to decode token';
          return;
        }
        
        // Store user data in localStorage
        localStorage.setItem('googleUser', JSON.stringify({
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          token: response.credential
        }));
        
        localStorage.setItem('currentUser', decodedToken.email);
        console.log('User data saved to localStorage');
        console.log('Attempting to navigate to /games');
        
        // Set flag to hide login page
        this.isLoggingIn = true;
        
        // Navigate to games with a slight delay to ensure state is updated
        setTimeout(() => {
          this.router.navigate(['/games']).then(
            (success) => console.log('Navigation successful:', success),
            (error) => console.log('Navigation error:', error)
          );
        }, 100);
      } catch (error) {
        this.errorMsg = 'Failed to process Google Sign-In';
        console.error('Google Sign-In Error:', error);
        this.isLoggingIn = false;
      } finally {
        this.googleSignInLoading = false;
      }
    } else {
      console.log('No credential in response:', response);
      this.errorMsg = 'Authentication failed - no credential received';
    }
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  loginUser(): void {
    if (this.userName == 'admin' && this.password == 'admin') {
      console.log('Welcome');
      localStorage.setItem('currentUser', this.userName);
      this.isLoggingIn = true;
      this.router.navigate(['games']);
    } else {
      this.errorMsg = 'Invalid Login Details';
    }
  }

}
