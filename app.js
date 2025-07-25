const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/connect");
const supplierRoutes = require("./routes/suppliers");
const contractRoutes = require("./routes/contracts");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const session = require("express-session");
const GithubStrategy = require("passport-github2").Strategy;
const app = express();
const port = process.env.PORT || 8080;

dotenv.config();

connectDB();

app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, OPTIONS DELETE"
    );
    next();
  })
  .use(cors({ methods: "GET, POST, PUT, PATCH, OPTIONS, DELETE" }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes/login.js"));

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Users.findOrCreate({ githubId: profile.id }, (err, user) => {return done(err, user);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged out"); });

app.get("/github/callback", passport.authenticate("github", { failureRedirect: '/api-docs', session: false }),
  (req, res) => {
    console.log("--- DEBUG AUTH CALLBACK ---");
    console.log("1. req.user (do Passport após autenticação):", req.user);
    req.session.user = req.user;
    console.log("2. req.session.user (após atribuição manual):", req.session.user);
    console.log("3. Sessão salva. Redirecionando.");
    res.redirect("/");
  }
);

// API Documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc)); // New

// Use API routes
app.use("/suppliers", supplierRoutes);
app.use("/contracts", contractRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }
  if (err.name === "ValidationError") {
    const errors = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    return res.status(400).json({ message: "Validation failed", errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key error: A record with this value already exists.",
    });
  }

  // Generic error for any other issues
  res.status(500).json({ message: "Something went wrong on the server." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(
    `API Documentation available at http://localhost:${port}/api-docs or https://cse341-project2-5tau.onrender.com/api-docs`
  );
});
