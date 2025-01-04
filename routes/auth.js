const express = require('express');
const qrcode = require('qrcode');
const { authenticator } = require('otplib');
const router = express.Router();

// In-memory storage
const users = {};
const sessions = {};

// Middleware to check session
function checkSession(req, res, next) {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');
  req.user = users[userId];
  next();
}

// Default route redirects to login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle user registration
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  const existingUser = Object.values(users).find(u => u.username === username);
  if (existingUser) {
    return res.status(400).send('User already exists');
  }
  const id = Date.now().toString();
  users[id] = { id, username, password };
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      res.redirect('/login');
    });
  });

// Sign-in logic
router.post('/sign-in', (req, res) => {
  const { username, password } = req.body;
  const user = Object.values(users).find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send('Invalid credentials');
  req.session.userId = user.id;

  if (!user.totpSecret) {
    const secret = authenticator.generateSecret();
    user.pendingTotpSecret = secret;
    const keyUri = authenticator.keyuri(username, 'Time-based one-time passwords', secret);

    qrcode.toDataURL(keyUri, (err, qrCode) => {
      if (err) return res.status(500).send('Error generating QR code');
      res.render('totp-setup', { qrCode });
    });
  } else {
    res.render('dashboard', { user });
  }
});

// Verify TOTP
router.get('/verify-totp', checkSession, (req, res) => {
  res.render('verify-totp');
});

router.post('/verify-totp', checkSession, (req, res) => {
  const { totpCode } = req.body;
  const user = req.user;

  const secret = user.totpSecret || user.pendingTotpSecret;
  if (!authenticator.check(totpCode, secret)) {
    return res.status(400).send('Invalid TOTP code');
  }

  if (user.pendingTotpSecret) {
    user.totpSecret = user.pendingTotpSecret;
    delete user.pendingTotpSecret;
  }

  res.render('dashboard', { user });
});

module.exports = router;
