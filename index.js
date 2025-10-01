const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // All domains support
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Reusable email transporter (created once)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kevin.digitalgrowthus@gmail.com",
    pass: "peusxrjgwmkocsus"
  },
  from: "kevin.digitalgrowthus@gmail.com",
  tls: {
    rejectUnauthorized: false,
  },
  pool: true, // Connection pooling for better performance
  maxConnections: 5,
  maxMessages: 100
});

// Zoho config
const ZOHO_CONFIG = {
  client1: {
    id: "1000.TSQ83QJYU47JW4FU7JURI9T5KUG8LB",
    secret: "ed7e36214a6904334234bf177081f4a4707008f35c",
    refresh: "1000.4eab6e71eaaba27a388f70ee84e68ec1.6177b6e02f92adf73a7bfac070a4e9cd"
  },
  client2: {
    id: "1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF",
    secret: "e49d2b9e743e403ebba076fd28a05a80f6e5815833",
    refresh: "1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432"
  }
};

// Helper Functions
const getZohoToken = async (config) => {
  try {
    const resp = await fetch(
      `https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=${config.id}&client_secret=${config.secret}&refresh_token=${config.refresh}`,
      { method: 'POST' }
    );
    const data = await resp.json();
    return data.access_token;
  } catch (error) {
    console.error("Zoho token error:", error.message);
    return null;
  }
};

const createZohoLead = async (token, leadData) => {
  if (!token) return null;
  try {
    const resp = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [leadData] })
    });
    return await resp.json();
  } catch (error) {
    console.error("Zoho lead error:", error.message);
    return null;
  }
};

const sendWhatsApp = async (phone) => {
  try {
    await fetch('https://chat.bol7.com/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: "919220784506",
        to: phone,
        type: "MARKETING",
        data: {
          name: "r12",
          language: { code: "en" },
          components: []
        }
      })
    });
  } catch (error) {
    console.error("WhatsApp error:", error.message);
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Kushel Digi Solutions" <kevin.digitalgrowthus@gmail.com>',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

const getThankYouEmail = (name) => `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
    <p>Dear ${name},</p>
    <p>
      Thank you for contacting <strong>Kushel Digi Solutions</strong>! We’ve received your message 
      and one of our team members will reach out within 24 hours.
    </p>
    <p>
      We’re excited to understand your needs and help you achieve your goals. 
      Meanwhile, feel free to share any additional details at 
      <a href="mailto:info@kusheldigi.com" style="color: #0073e6;">info@kusheldigi.com</a>.
    </p>
    <p>
      Best regards,<br/>
      <strong>Shubham Gupta</strong><br/>
      Kushel Digi Solutions
    </p>
  </div>
`;


// Routes
app.get("/", (req, res) => res.send("Server is running"));

// /contact - Simple form
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Parallel operations for better performance
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client1),
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>Name: ${name}</div><div>Phone: ${phone}</div><div>Email: ${email}</div></div>`),
      sendEmail(email, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(name))
    ]);
    
    // Non-blocking operations
    Promise.all([
      createZohoLead(token, { First_Name: name, Email: email, Phone: phone }),
      sendWhatsApp(phone)
    ]);
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact11 - Contact page with service
app.post("/contact11", async (req, res) => {
  try {
    const { name11, email11, phone11, service11, message11 } = req.body;
    
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client1),
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>Name: ${name11}</div><div>Phone: ${phone11}</div><div>Email: ${email11}</div><div>Service: ${service11}</div><div>Message: ${message11}</div></div>`),
      sendEmail(email11, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(name11)),
      fetch("https://prdbackend.kdscrm.com/lead/createExternalLead?id=685e3eb91f7c9324729aa63c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: name11,
          Phone: phone11,
          Email: email11,
          DescriptionInfo: message11,
          LeadSource: "External Referral"
        })
      })
    ]);
    
    Promise.all([
      createZohoLead(token, {
        Department: service11,
        First_Name: name11,
        Email: email11,
        Description: message11,
        Phone: phone11
      }),
      sendWhatsApp(phone11)
    ]);
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact11 error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact1 - With company
app.post("/contact1", async (req, res) => {
  try {
    const { company1, name1, email1, phone1, service1, message1 } = req.body;
    
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>Company: ${company1}</div><div>Name: ${name1}</div><div>Email: ${email1}</div><div>Phone: ${phone1}</div><div>Service: ${service1}</div><div>Message: ${message1}</div></div>`),
      sendEmail(email1, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(name1))
    ]);
    
    createZohoLead(token, {
      Company: company1,
      First_Name: name1,
      Last_Name: "-",
      Email: email1,
      Department: service1,
      Phone: phone1
    });
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact1 error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact2 - With message
app.post("/contact2", async (req, res) => {
  try {
    const { name2, phone2, email2, message2 } = req.body;
    
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>Name: ${name2}</div><div>phone: ${phone2}</div><div>email: ${email2}</div><div>Message: ${message2}</div></div>`),
      sendEmail(email2, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(name2))
    ]);
    
    Promise.all([
      createZohoLead(token, {
        First_Name: name2,
        Last_Name: "-",
        Email: email2,
        Description: message2,
        Phone: phone2
      }),
      sendWhatsApp(phone2)
    ]);
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact2 error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact3 - Requirement form
app.post("/contact3", async (req, res) => {
  try {
    const { name4, email4, requirement4 } = req.body;
    
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>Name: ${name4}</div><div>Email: ${email4}</div><div>Requirement: ${requirement4}</div></div>`),
      sendEmail(email4, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(name4))
    ]);
    
    createZohoLead(token, {
      First_Name: name4,
      Last_Name: "-",
      Email: email4,
      Description: requirement4
    });
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact3 error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact4 - Appointment form
app.post("/contact4", async (req, res) => {
  try {
    const { first_name, last_name, email_address, city, date, time, additional_msg } = req.body;
    
    await Promise.all([
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>FirstName: ${first_name}</div><div>LastName: ${last_name}</div><div>EmailAddress: ${email_address}</div><div>City: ${city}</div><div>Date: ${date}</div><div>Time: ${time}</div><div>AdditionalMessage: ${additional_msg}</div></div>`),
      sendEmail(email_address, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(first_name))
    ]);
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact4 error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact5 - Technology form
app.post("/contact5", async (req, res) => {
  try {
    const { technology, products, Estore, name6, mobile6, email6 } = req.body;
    
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail("aman.kusheldigi@gmail.com", "Contact Form", 
        `<div><div>Technology: ${technology}</div><div>Products: ${products}</div><div>E-store: ${Estore}</div><div>Name: ${name6}</div><div>Mobile: ${mobile6}</div><div>Email: ${email6}</div></div>`),
      sendEmail(email6, "Thanks for Reaching Out to Kushel Digi Solutions", getThankYouEmail(name6))
    ]);
    
    createZohoLead(token, {
      First_Name: name6,
      Last_Name: "-",
      Email: email6,
      Phone: mobile6,
      Department: technology
    });
    
    res.json({ success: true, message: "Thank You! we will get back you shortly" });
  } catch (error) {
    console.error("Contact5 error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /test - Test endpoint
app.post('/test', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    const token = await getZohoToken(ZOHO_CONFIG.client2);
    
    const data = await fetch("https://www.zohoapis.in/crm/v4/Contacts", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{
          Department: service,
          First_Name: name,
          Last_Name: "-",
          Email: email,
          Description: message,
          Phone: phone
        }]
      })
    }).then(r => r.json());
    
    res.json({ success: true, data, message: 'Form submitted successfully' });
  } catch (error) {
    console.error("Test error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});