import express from "express";
import { toDataURL } from "qrcode";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;

// Get the current directory using ES module-specific method
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simulated database of certificates
const certificates = [
  {
    id: "MN_21Nov2113",
    name: "Nikita Wagh",
    course: "Mobile Developer Intern",
    duration: "October 2024 to November 2024",
    description:
      "Contributed to developing and optimizing mobile applications, collaborating with design teams, and gaining hands-on experience with mobile development technologies.",
  },
  {
    id: "FD_21Nov2101",
    name: "Janhavi Mahajan",
    course: "Frontend Developer Intern",
    duration: "October 2024 to November 2024",
    description:
      "Contributed to developing and optimizing user interfaces, collaborating with design teams, and gaining hands-on experience with frontend technologies.",
  },
  {
    id: "FD_21Nov2102",
    name: "Hetal Patil",
    course: "Frontend Developer Intern",
    duration: "October 2024 to November 2024",
    description:
      "Contributed to developing and optimizing user interfaces, collaborating with design teams, and gaining hands-on experience with frontend technologies.",
  },
  {
    id: "FD_21Nov2103",
    name: "Diksha Patil",
    course: "Frontend Developer Intern",
    duration: "October 2024 to November 2024",
    description:
      "Contributed to developing and optimizing user interfaces, collaborating with design teams, and gaining hands-on experience with frontend technologies.",
  },
  {
    id: "FD_21Nov2104",
    name: "Priyanka Chaudhari",
    course: "Frontend Developer Intern",
    duration: "October 2024 to November 2024",
    description:
      "Contributed to developing and optimizing user interfaces, collaborating with design teams, and gaining hands-on experience with frontend technologies.",
  },
];

// Set up the static files and view engine (Assuming EJS is used)
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));
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

  generateQRCode(url)
    .then((qrCodeDataUrl) => {
      res.send(`<img src="${qrCodeDataUrl}" alt="QR Code" />`);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error generating QR code", details: err });
    });
});

// Verify certificate route (Validation)
app.get("/intern/verify", (req, res) => {
  res.sendFile(join(__dirname, "public", "verify.html"));
});

// Certificate validation
app.get("/intern/verify/certificate", (req, res) => {
  const certificateId = req.query.certificate_id;

  let certificate = null;
  let error = null;

  if (!certificateId) {
    error = "Please enter a valid certificate ID.";
  } else {
    certificate = certificates.find((cert) => cert.id === certificateId);
    if (!certificate) {
      error = "Certificate ID not found.";
    }
  }

  if (error) {
    return res.status(400).json({ error });
  } else {
    return res.json({ certificate });
  }
});

// QR Code generation helper function
function generateQRCode(url) {
  return new Promise((resolve, reject) => {
    toDataURL(url, (err, qrCodeDataUrl) => {
      if (err) {
        reject(err);
      } else {
        resolve(qrCodeDataUrl);
      }
    });
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
