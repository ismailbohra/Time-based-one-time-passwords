# TOTP-based 2FA Authentication System

This project demonstrates the integration of **Two-Factor Authentication (2FA)** using **TOTP (Time-based One-Time Password)** in a Node.js application. The project uses the **otplib** library to generate and verify TOTP codes, providing an additional layer of security during user authentication.

---

## Project Overview

In this project, we create a simple Express.js application where users can:

- Register with a username and password.
- Use TOTP as a second factor for login.
- Bind a TOTP secret to the user account and verify it.
- Scan a QR code with an authenticator app to generate the TOTP codes.
- Use the TOTP codes to complete the login process.

Once the user successfully logs in and binds TOTP, they will be asked to verify their TOTP code for every future login.

---

## Project Structure

```
/project-root
│
├── /node_modules                  # Project dependencies
├── /views                          # Views (HTML templates for rendering UI)
│   ├── dashboard.ejs               # Dashboard page after login
│   ├── login.ejs                   # Login page
│   ├── register.ejs                # Registration page
│   └── totp-setup.ejs              # TOTP setup page (with QR code)
├── .gitignore                      # Git ignore file
├── index.js                        # Entry point of the application
├── package.json                    # Project dependencies and scripts
└── README.md                       # Project documentation (this file)
```

---

## About `otplib` Library

[`otplib`](https://www.npmjs.com/package/otplib) is a Node.js library that provides **One-Time Password (OTP)** generation based on the TOTP (Time-based One-Time Password) and HOTP (HMAC-based One-Time Password) algorithms. The library follows standards set by RFC 6238 and RFC 4226, which are widely used for generating OTPs for two-factor authentication.

Key features of the `otplib` library:
- **TOTP**: Generates time-based one-time passwords.
- **HOTP**: Generates event-based one-time passwords.
- **Supports secret key generation**: The library can generate a secret key that is shared between the server and the user's device.
- **QR Code generation**: Can generate QR codes that can be scanned by authenticator apps like Google Authenticator or Microsoft Authenticator.

---

## Use Cases

### 1. **User Registration**
- Users can register with a username and password.
- The system generates a unique TOTP secret and returns a QR code.
- The user scans the QR code with their authenticator app to bind the TOTP to their account.

### 2. **Login with 2FA**
- After entering the username and password, the system checks whether TOTP is enabled for the user.
- If TOTP is not yet bound to the user, the system prompts the user to bind their TOTP by scanning a QR code.
- If TOTP is bound, the user is prompted to enter the TOTP code from their authenticator app.
- The TOTP code is verified by the server using the `otplib` library.

### 3. **Secure Logout**
- After successful login, the user can log out, which will destroy their session and clear any stored data.

### 4. **Session Management**
- Session management ensures that only authenticated users can access protected resources. The server uses a session store to cache user-specific data (e.g., `userId`, `totpSecret`, etc.).

---

## Installation and Setup

To run the project locally, follow these steps:

### Prerequisites

- **Node.js**: Ensure that you have Node.js installed. If not, you can download and install it from [here](https://nodejs.org/).
- **npm**: This comes bundled with Node.js. Use npm to install project dependencies.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

Install all required dependencies via npm:

```bash
npm install
```

### 3. Run the Application

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

---

## API Endpoints

### 1. **POST /sign-in**
- Authenticates the user with a username and password.
- If TOTP is not set up for the user, a QR code will be generated and returned.
- If TOTP is already bound, the user will be asked to provide the TOTP code.

### 2. **POST /verify-totp**
- Verifies the TOTP code entered by the user.
- If the code is correct, the user is successfully authenticated.
- If the code is incorrect, an error message is returned.

### 3. **GET /logout**
- Logs the user out by destroying the session.
- Redirects the user to the login page.

---

## How TOTP Works in This Project

### Step 1: **Binding the TOTP Secret to the User**
- When the user first logs in, if their account is not linked with TOTP, the system generates a new secret key using the `otplib` library and provides a QR code for the user to scan with an authenticator app.
- This QR code binds the TOTP secret to the user's account.

### Step 2: **Verifying the TOTP Code**
- On subsequent logins, the user must provide a TOTP code generated by their authenticator app.
- The server verifies the code using the `otplib.authenticator.check()` method to ensure the code matches the stored TOTP secret.

---

## Contributing

Feel free to fork the repository, create issues, and submit pull requests. We welcome contributions that improve the functionality or documentation of this project.

---

### Conclusion

This project provides a simple implementation of TOTP-based two-factor authentication in a Node.js environment using `otplib`. It demonstrates how to integrate 2FA into an application, securing user accounts with an additional layer of protection using an authenticator app.

---
