import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

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
  
  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef, 
    private userService: UserService, 
    private ngZone: NgZone,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Reset logging in flag when component initializes
    this.isLoggingIn = false;
    this.cdr.detectChanges();
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      console.log('User already logged in:', currentUser);
      this.isLoggingIn = true;
      this.cdr.detectChanges();
      this.ngZone.run(() => {
        this.router.navigate(['/games']);
      });
      return;
    }
    
    console.log('No current user found, showing login page');
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
          console.error('Failed to decode token');
          this.googleSignInLoading = false;
          return;
        }
        
        // Send Google login data to backend
        // This will create the user in database if they don't exist
        // and update lastLogin if they do
        this.http.post<any>('/api/auth/google-login', {
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture
        }).subscribe(
          (response: any) => {
            if (response.success) {
              // Store user data in localStorage
              const googleUserData = {
                email: decodedToken.email,
                name: decodedToken.name,
                picture: decodedToken.picture,
                token: response.token
              };
              localStorage.setItem('googleUser', JSON.stringify(googleUserData));
              
              // Store user object from backend response
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              localStorage.setItem('authToken', response.token);
              
              // Also set it in the UserService
              this.userService.setUserProfile({
                email: decodedToken.email,
                name: decodedToken.name,
                picture: decodedToken.picture
              });
              
              console.log('User authenticated and saved to database');
              console.log('User data saved to localStorage');
              console.log('Setting isLoggingIn to true');
              
              // Set flag to hide login page IMMEDIATELY
              this.isLoggingIn = true;
              console.log('isLoggingIn is now:', this.isLoggingIn);
              
              // Force change detection to update DOM immediately
              this.cdr.detectChanges();
              console.log('Change detection triggered');
              
              // Navigate to games within Angular zone
              console.log('Attempting to navigate to /games');
              this.ngZone.run(() => {
                this.router.navigate(['/games']).then(
                  (success) => {
                    console.log('Navigation successful:', success);
                    if (!success) {
                      console.error('Navigation failed - check if user is not authenticated');
                    }
                  },
                  (error) => console.error('Navigation error:', error)
                );
              });
            } else {
              this.errorMsg = response.error || 'Google authentication failed';
              console.error('Google login error:', response);
              this.isLoggingIn = false;
            }
            this.googleSignInLoading = false;
          },
          (error) => {
            this.errorMsg = 'Failed to authenticate with server';
            console.error('Google login server error:', error);
            this.isLoggingIn = false;
            this.googleSignInLoading = false;
          }
        );
      } catch (error) {
        this.errorMsg = 'Failed to process Google Sign-In';
        console.error('Google Sign-In Error:', error);
        this.isLoggingIn = false;
        this.googleSignInLoading = false;
      }
    } else {
      console.log('No credential in response:', response);
      this.errorMsg = 'Authentication failed - no credential received';
      this.googleSignInLoading = false;
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
    if (!this.userName || !this.password) {
      this.errorMsg = 'Email and password are required';
      return;
    }

    this.isLoggingIn = true;
    this.errorMsg = '';

    const loginData = {
      email: this.userName, // Use email field from form
      password: this.password
    };

    this.http.post<any>('/api/auth/login', loginData).subscribe(
      (response: any) => {
        if (response.success) {
          // Store user data and token
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('authToken', response.token);
          
          // Set user profile in UserService
          this.userService.setUserProfile({
            email: response.user.email,
            name: response.user.firstName + ' ' + response.user.lastName,
            picture: 'assets/default-avatar.svg'
          });
          
          console.log('Login successful');
          this.cdr.detectChanges();
          this.ngZone.run(() => {
            this.router.navigate(['games']);
          });
        } else {
          this.errorMsg = response.error || response.message || 'Login failed';
          this.isLoggingIn = false;
        }
      },
      (error: any) => {
        console.error('Login error:', error);
        this.errorMsg = error.error?.error || 'Invalid login details. Please check your email and password.';
        this.isLoggingIn = false;
      }
    );
  }

}
