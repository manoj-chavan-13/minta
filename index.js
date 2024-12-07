const express = require("express");
const QRCode = require("qrcode");
const app = express();
const port = 3000;
const path = require("path");

// Simulated database of certificates
const certificates = [
  {
    id: "MN_21Nov2113",
    name: "Nikita Wagh",
    course: "Frontend Developer Intern",
    duration: "August 2024 to November 2024",
    description:
      "Contributed to developing and optimizing user interfaces, collaborating with design teams, and gaining hands-on experience with frontend technologies.",
  },
];

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Serve static files (for CSS and JS)
app.use(express.static("public"));

// Middleware to parse query parameters from the URL
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Homepage route (Welcome page)
app.get("/", (req, res) => {
  res.render("index");
});

// QR Code generation route
app.get("/generate-qr/:certificateId", (req, res) => {
  const certificateId = req.params.certificateId;
  const url = `https://minta.in/intern/verify?certificate_id=${certificateId}`; // URL to be encoded in QR code

  QRCode.toDataURL(url, (err, qrCodeDataUrl) => {
    if (err) {
      res.status(500).send("Error generating QR code");
    } else {
      res.send(`<img src="${qrCodeDataUrl}" alt="QR Code" />`);
    }
  });
});

// Verify certificate route (Validation)
app.get("/intern/verify", (req, res) => {
  const certificateId =
    req.query.certificate_id || req.query.certificate_id_from_form; // Get the certificate ID either from the QR code or the form
  let certificate = null;
  let error = null;

  if (!certificateId) {
    // If no certificate ID is entered, show an error
    error = "Please enter a valid certificate ID.";
  } else {
    // Try to find the certificate
    certificate = certificates.find((cert) => cert.id === certificateId);

    if (!certificate) {
      // If no certificate found, show an error
      error = "Certificate ID not found.";
    }
  }

  // Render the page with the certificate data or error
  res.render("verify.ejs", { certificate, error });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
