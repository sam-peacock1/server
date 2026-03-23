const express = require("express");
const router = express.Router();
const cors = require("cors");
const { Resend } = require("resend");
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

// Render assigns a dynamic port, falls back to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/contact", async (req, res) => {
  const name = req.body.firstName + " " + req.body.lastName; 
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Resend's default testing address
      to: process.env.MY_EMAIL,
      reply_to: email,
      subject: `Portfolio Contact Form: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.json(error); // Triggers frontend "Something went wrong" message
    }
    
    // Triggers frontend "Message sent successfully" message
    res.json({ code: 200, status: "Message Sent" }); 

  } catch (err) {
    console.error("Server Error:", err);
    res.json(err);
  }
});