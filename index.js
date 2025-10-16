const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" })); // All domains support
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Reusable email transporter (created once)
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@kusheldigi.com",
    pass: "info@kusheldigi@321",
  },
  from: "info@kusheldigi.com",
  tls: {
    rejectUnauthorized: false,
  },
  pool: true, // Connection pooling for better performance
  maxConnections: 5,
  maxMessages: 100,
});

// Zoho config
const ZOHO_CONFIG = {
  client1: {
    id: "1000.TSQ83QJYU47JW4FU7JURI9T5KUG8LB",
    secret: "ed7e36214a6904334234bf177081f4a4707008f35c",
    refresh:
      "1000.4eab6e71eaaba27a388f70ee84e68ec1.6177b6e02f92adf73a7bfac070a4e9cd",
  },
  client2: {
    id: "1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF",
    secret: "e49d2b9e743e403ebba076fd28a05a80f6e5815833",
    refresh:
      "1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432",
  },
};

// Helper Functions
const getZohoToken = async (config) => {
  try {
    const resp = await fetch(
      `https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=${config.id}&client_secret=${config.secret}&refresh_token=${config.refresh}`,
      { method: "POST" }
    );
    const data = await resp.json();

    if (data.access_token) {
      console.log("✅ Zoho Token: Successfully refreshed");
      return data.access_token;
    } else {
      console.error(
        "❌ Zoho Token Error:",
        data.error || "No access token received"
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Zoho Token Exception:", error.message);
    return null;
  }
};

const createZohoLead = async (token, leadData) => {
  if (!token) {
    console.error("❌ Zoho Lead Error: No token provided");
    return null;
  }

  try {
    // Ensure Last_Name exists (required field)
    if (!leadData.Last_Name) {
      leadData.Last_Name = "-";
    }

    const resp = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [leadData] }),
    });

    const result = await resp.json();

    if (resp.ok && result.data && result.data[0]?.code === "SUCCESS") {
      const leadId = result.data[0]?.details?.id || "Unknown ID";
      console.log(
        `✅ Zoho Lead Created: ID=${leadId}, Name=${leadData.First_Name}, Email=${leadData.Email}`
      );
      return result;
    } else {
      const errorMsg =
        result.data?.[0]?.message || result.message || "Failed to create lead";
      console.error(`❌ Zoho Lead Error: ${errorMsg}`, {
        status: resp.status,
        leadData: leadData,
        response: result,
      });
      return null;
    }
  } catch (error) {
    console.error("❌ Zoho Lead Exception:", error.message);
    return null;
  }
};

const createExternalLead = async (leadData) => {
  try {
    const resp = await fetch(
      "https://prdbackend.kdscrm.com/lead/createExternalLead?id=685e3eb91f7c9324729aa63c",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }
    );

    if (resp.ok) {
      const result = await resp.json();
      if (result.status) {
        console.log(
          `✅ External Lead Created: ID=${
            result.data?._id || "Unknown"
          }, Name=${leadData.FirstName}, Phone=${leadData.Phone}`
        );
        return result;
      } else {
        console.error(
          `❌ External Lead Error: ${result.message || "Failed to create"}`,
          result
        );
        return null;
      }
    } else {
      const errorText = await resp.text();
      console.error(
        `❌ External Lead HTTP Error: Status=${resp.status}, Response=${errorText}`
      );
      return null;
    }
  } catch (error) {
    console.error("❌ External Lead Exception:", error.message);
    return null;
  }
};

const sendWhatsApp = async (phone) => {
  try {
    const resp = await fetch("https://chat.bol7.com/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "919220784506",
        to: phone,
        type: "MARKETING",
        data: {
          name: "r12",
          language: { code: "en" },
          components: [],
        },
      }),
    });

    if (resp.ok) {
      console.log(`✅ WhatsApp Sent: Phone=${phone}`);
      return true;
    } else {
      const errorText = await resp.text();
      console.error(
        `❌ WhatsApp Error: Phone=${phone}, Status=${resp.status}, Response=${errorText}`
      );
      return false;
    }
  } catch (error) {
    console.error(
      `❌ WhatsApp Exception: Phone=${phone}, Error=${error.message}`
    );
    return false;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email Sent: To=${to}, Subject="${subject}"`);
    return true;
  } catch (error) {
    console.error(`❌ Email Error: To=${to}, Error=${error.message}`);
    return false;
  }
};

const getThankYouEmail = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You - Kushel Digi Solutions</title>
</head>
<body style="margin:0; padding:0; background-color:#f6f9fc; font-family:'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f6f9fc; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg, #0073e6, #00bcd4); padding:25px 15px;">
              <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1759210988/logo_zckmvw_axxbcz.png"
                   alt="Kushel Digi Solutions"
                   width="180"
                   style="width:100%; max-width:180px; height:auto; display:block; margin:0 auto;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:25px 20px 20px 20px; color:#333333; font-size:16px; line-height:1.7; word-break:break-word;">
              <p style="margin:0 0 15px 0; font-size:18px; font-weight:bold;">Dear ${name},</p>
              <p style="margin:0 0 15px 0;">
                Thank you for reaching out to <strong>Kushel Digi Solutions</strong>!
                We’ve successfully received your message, and one of our team members will contact you within 
                <strong>24 hours</strong>.
              </p>
              <p style="margin:0 0 15px 0;">
                We’re thrilled to learn more about your goals and craft a digital solution that fits your vision. 
                Meanwhile, you can email us anytime at 
                <a href="mailto:info@kusheldigi.com" style="color:#0073e6; text-decoration:none;">info@kusheldigi.com</a>.
              </p>
              <p style="margin:0;">
                Warm regards,<br>
                <strong>Kushel Digi Team</strong>
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:25px 15px;">
              <a href="https://kusheldigi.com"
                 style="background:#0073e6; color:#ffffff; padding:14px 28px; border-radius:6px; font-weight:bold; text-decoration:none; display:inline-block; font-size:16px;">
                 Visit Our Website
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f0f4f8; padding:20px 10px; font-size:13px; color:#777777; line-height:1.6;">
              <p style="margin:0;">© ${new Date().getFullYear()} Kushel Digi Solutions. All rights reserved.</p>
              <p style="margin:8px 0 0 0;">
                Follow us:
                <a href="https://www.linkedin.com/company/kusheldigisolutions/posts/?feedView=all" style="color:#0073e6; text-decoration:none;">LinkedIn</a> •
                <a href="https://www.instagram.com/kusheldigi/?hl=en" style="color:#0073e6; text-decoration:none;">Instagram</a> •
                <a href="https://www.facebook.com/kusheldigisolutions/" style="color:#0073e6; text-decoration:none;">Facebook</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Routes
app.get("/", (req, res) => res.send("Server is running"));

// /contact - Simple form Popup Europe UK pages
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, page } = req.body;
    console.log(
      `\n📝 /contact - New Request: Name=${name}, Email=${email}, Phone=${phone}, Page=${page}`
    );

    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client1),
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div><div>Name: ${name}</div><div>Phone: ${phone}</div><div>Email: ${email}</div> ${
          page ? `<div>Page: ${page}</div>` : ""
        }</div>`
      ),
      sendEmail(
        email,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(name)
      ),
    ]);

    Promise.all([
      createZohoLead(token, {
        First_Name: name,
        Last_Name: "-",
        Email: email,
        Phone: phone,
      }),
      createExternalLead({
        FirstName: name,
        Phone: phone,
        Email: email,
        DescriptionInfo: `${page || "From Website Pages"}`,
        LeadSource: "website",
      }),
      sendWhatsApp(phone),
    ]).catch((err) =>
      console.error("Non-blocking operations error:", err.message)
    );

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact11 - Contact page with service contact us
app.post("/contact11", async (req, res) => {
  try {
    const { name11, email11, phone11, service11, message11, page } = req.body;
    console.log(
      `\n📝 /contact11 - New Request: Name=${name11}, Email=${email11}, Phone=${phone11}, Service=${service11}`
    );

    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client1),
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div><div>Name: ${name11}</div><div>Phone: ${phone11}</div><div>Email: ${email11}</div><div>Service: ${service11}</div><div>Message: ${message11}</div></div> ${
          page ? `<div>Page: ${page}</div>` : ""
        }`
      ),
      sendEmail(
        email11,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(name11)
      ),
      createExternalLead({
        FirstName: name11,
        Phone: phone11,
        Email: email11,
        DescriptionInfo: message11 + (page ? ` | Page: ${page}` : ""),
        LeadSource: "website",
      }),
    ]);

    Promise.all([
      createZohoLead(token, {
        Department: service11,
        First_Name: name11,
        Last_Name: "-",
        Email: email11,
        Description: message11,
        Phone: phone11,
      }),
      sendWhatsApp(phone11),
    ]).catch((err) =>
      console.error("Non-blocking operations error:", err.message)
    );

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact11 Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact1 - With company
app.post("/contact1", async (req, res) => {
  try {
    const { company1, name1, email1, phone1, service1, message1, page } =
      req.body;
    console.log(
      `\n📝 /contact1 - New Request: Company=${company1}, Name=${name1}, Email=${email1}`
    );

    // Step 1: Token + Email + External Lead parallel
    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div>
          <div>Company: ${company1 || "Individual"}</div>
          <div>Name: ${name1}</div>
          <div>Email: ${email1}</div>
          <div>Phone: ${phone1}</div>
          <div>Service: ${service1}</div>
          <div>Message: ${message1}</div>
        </div>
        ${page ? `<div>Page: ${page}</div>` : ""}`
      ),
      sendEmail(
        email1,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(name1)
      ),
      createExternalLead({
        FirstName: name1,
        Phone: phone1,
        Email: email1,
        DescriptionInfo: message1 + (page ? ` | Page: ${page}` : ""),
        LeadSource: "website",
      }),
    ]);

    // Step 2: Non-blocking Zoho Lead create
    Promise.all([
      createZohoLead(token, {
        Company: company1 || "Individual",
        First_Name: name1,
        Last_Name: "-",
        Email: email1,
        Department: service1,
        Phone: phone1,
      }),
    ]).catch((err) => console.error("Zoho lead error:", err.message));

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact1 Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact2 - With message India usa uae pages
app.post("/contact2", async (req, res) => {
  try {
    const { name2, phone2, email2, message2, page } = req.body;
    console.log(
      `\n📝 /contact2 - New Request: Name=${name2}, Email=${email2}, Phone=${phone2}`
    );

    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div><div>Name: ${name2}</div><div>phone: ${phone2}</div><div>email: ${email2}</div><div>Message: ${message2}</div></div> ${
          page ? `<div>Page: ${page}</div>` : ""
        }`
      ),
      sendEmail(
        email2,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(name2)
      ),
      createExternalLead({
        FirstName: name2,
        Phone: phone2,
        Email: email2,
        DescriptionInfo: message2 + (page ? ` | Page: ${page}` : ""), // ✅ String me diya
        LeadSource: "website",
      }),
    ]);

    Promise.all([
      createZohoLead(token, {
        First_Name: name2,
        Last_Name: "-",
        Email: email2,
        Description: message2,
        Phone: phone2,
      }),

      sendWhatsApp(phone2),
    ]).catch((err) =>
      console.error("Non-blocking operations error:", err.message)
    );

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact2 Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact3 - Requirement form. Hire Page
app.post("/contact3", async (req, res) => {
  try {
    const { name4, email4, requirement4, page } = req.body;
    console.log(`\n📝 /contact3 - New Request: Name=${name4}, Email=${email4}`);

    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div><div>Name: ${name4}</div><div>Email: ${email4}</div><div>Requirement: ${requirement4}</div></div> ${
          page ? `<div>Page: ${page}</div>` : ""
        }`
      ),
      sendEmail(
        email4,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(name4)
      ),
    ]);
    createExternalLead({
      FirstName: name4,
      Phone: '',
      Email: email4,
      DescriptionInfo: { page: page || "From Website Pages" }, // ❌ Object bhej rahe ho
      LeadSource: "website",
    }),
      createZohoLead(token, {
        First_Name: name4,
        Last_Name: "-",
        Email: email4,
        Description: requirement4,
      }).catch((err) => console.error("Zoho lead error:", err.message));

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact3 Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact4 - Appointment form
app.post("/contact4", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email_address,
      city,
      date,
      time,
      additional_msg,
      page,
    } = req.body;
    console.log(
      `\n📝 /contact4 - New Request: Name=${first_name} ${last_name}, Email=${email_address}`
    );

    await Promise.all([
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div><div>FirstName: ${first_name}</div><div>LastName: ${last_name}</div><div>EmailAddress: ${email_address}</div><div>City: ${city}</div><div>Date: ${date}</div><div>Time: ${time}</div><div>AdditionalMessage: ${additional_msg}</div></div> ${
          page ? `<div>Page: ${page}</div>` : ""
        }`
      ),
      sendEmail(
        email_address,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(first_name)
      ),
      createExternalLead({
        FirstName: first_name,
        Email: email_address,
        DescriptionInfo: { page: page || "From Website Pages" },
        LeadSource: "website",
      }),
    ]);

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact4 Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /contact5 - Technology form
app.post("/contact5", async (req, res) => {
  try {
    const { technology, products, Estore, name6, mobile6, email6, page } =
      req.body;
    console.log(
      `\n📝 /contact5 - New Request: Name=${name6}, Email=${email6}, Tech=${technology}`
    );

    const [token] = await Promise.all([
      getZohoToken(ZOHO_CONFIG.client2),
      sendEmail(
        "info@kusheldigi.com",
        "Contact Form",
        `<div><div>Technology: ${technology}</div><div>Products: ${products}</div><div>E-store: ${Estore}</div><div>Name: ${name6}</div><div>Mobile: ${mobile6}</div><div>Email: ${email6}</div></div> ${
          page ? `<div>Page: ${page}</div>` : ""
        }`
      ),
      sendEmail(
        email6,
        "Thanks for Reaching Out to Kushel Digi Solutions",
        getThankYouEmail(name6)
      ),
      createExternalLead({
        FirstName: name6,
        Phone: mobile6,
        Email: email6,
        DescriptionInfo: { page: page || "From Website Pages" },
        LeadSource: "website",
      }),
    ]);

    createZohoLead(token, {
      First_Name: name6,
      Last_Name: "-",
      Email: email6,
      Phone: mobile6,
      Department: technology,
    }).catch((err) => console.error("Zoho lead error:", err.message));

    res.json({
      success: true,
      message: "Thank You! we will get back you shortly",
    });
  } catch (error) {
    console.error("❌ /contact5 Error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

// /test - Test endpoint
app.post("/test", async (req, res) => {
  try {
    const { name, email, phone, service, message, page } = req.body;
    console.log(`\n📝 /test - New Request: Name=${name}, Email=${email}`);

    const token = await getZohoToken(ZOHO_CONFIG.client2);

    const resp = await fetch("https://www.zohoapis.in/crm/v4/Contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            Department: service,
            First_Name: name,
            Last_Name: "-",
            Email: email,
            Description: message,
            Phone: phone,
          },
        ],
      }),
    });

    const data = await resp.json();

    if (resp.ok && data.data?.[0]?.code === "SUCCESS") {
      console.log(`✅ Zoho Contact Created: ID=${data.data[0]?.details?.id}`);
    } else {
      console.error(`❌ Zoho Contact Error:`, data);
    }

    res.json({ success: true, data, message: "Form submitted successfully" });
  } catch (error) {
    console.error("❌ /test Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📊 Logging enabled for all operations\n`);
});
