const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const cors = require("cors");
// const fs = require("fs");

app.use(cors({ origin: ['https://www.kusheldigi.com', 'http://localhost:3000'] }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hlw");
});

app.post("/contact", async (req, res) => {
  const { name, email, phone } = req.body;

  console.log({ name, email, phone });

  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });

  // const htmlToSend = template(replacements);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: "info@kusheldigi.com",
    subject: "Contact Form",
    text: `
        <div>
            <div>Name: ${name}</div>
            <div>Phone:  ${phone}</div>
            <div>Email: ${email}</div>
        </div>
    `,
    html: `
            <div>
            <div>Name: ${name}</div>
            <div>Phone: ${phone}</div>
            <div>Email: ${email}</div>
            </div>
        `,
  });
  console.log(info);
  let info1 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: email,
    subject: "Contact Form",
    text: `
      Thank you
    `,
    html: `
            <div>
              <div>Dear ${name}, </div>
                <div>
                <br/>
Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
<br/>
Best regards,
<br/>
Shubham Gupta
<br/>
Kushel Digi Solutions Team</div>
            </div>
        `,
  });

  let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.TSQ83QJYU47JW4FU7JURI9T5KUG8LB&client_secret=ed7e36214a6904334234bf177081f4a4707008f35c&refresh_token=1000.4eab6e71eaaba27a388f70ee84e68ec1.6177b6e02f92adf73a7bfac070a4e9cd`, {
    method: 'POST'
  });


  let data1 = await resp1.json();



  let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data1.access_token}`
    },
    body: JSON.stringify({
      "data": [
        {

          "First_Name": name,
          "Email": email,
          "Phone": phone
        }
      ]
    })
  });
  let data2 = await resp2.json();

  const response = await fetch('https://chat.bol7.com/api/whatsapp/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: "919220784506",
      to: `${phone}`,
      type: "MARKETING",
      data: {
        name: "r12",
        language: {
          code: "en"
        },
        components: []
      }
    })
  });

  res.json({ success: true, message: "Thank You! we will get back you shortly" });
});





// ============route for contact us page==========
app.post("/contact11", async (req, res) => {
  const { name11, email11, phone11, service11, message11 } = req.body;

  console.log({ name11, email11, phone11, service11, message11 });

  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });

  // const htmlToSend = template(replacements);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: "info@kusheldigi.com",
    subject: "Contact Form",
    text: `
        <div>
            <div>Name: ${name11}</div>
            <div>Phone:  ${phone11}</div>
            <div>Email: ${email11}</div>
            <div>Service: ${service11}</div>
            <div>Message: ${message11}</div>
        </div>
    `,
    html: `
            <div>
            <div>Name: ${name11}</div>
            <div>Phone: ${phone11}</div>
            <div>Email: ${email11}</div>
            <div>Service: ${service11}</div>
            <div>Message: ${message11}</div>
            </div>
        `,
  });
  console.log(info);
  let hrms = await fetch(`https://amanbackend.kusheldigi.com/lead/createExternalLead?id=685e3eb91f7c9324729aa63c`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      FirstName: name11,
      Phone: phone11,
      Email: email11,
      DescriptionInfo: message11,
      LeadSource: "External Referral"
    })
  });


  // console.log("Server response:", response);

    let info1 = await transporter.sendMail({
      from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
      to: email11,
      subject: "Contact Form",
      text: `
        Thank you
      `,
      html: `
              <div>
                <div>Dear ${name11}, </div>
                  <div>
                  <br/>
  Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
  Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
  If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
  Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
  <br/>
  Best regards,
  <br/>
  Shubham Gupta
  <br/>
  Kushel Digi Solutions Team</div>
              </div>
          `,
    });

  let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.TSQ83QJYU47JW4FU7JURI9T5KUG8LB&client_secret=ed7e36214a6904334234bf177081f4a4707008f35c&refresh_token=1000.4eab6e71eaaba27a388f70ee84e68ec1.6177b6e02f92adf73a7bfac070a4e9cd`, {
    method: 'POST'
  });

  let data5 = await hrms.json()
  console.log(data5)

  let data1 = await resp1.json();



  let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data1.access_token}`
    },
    body: JSON.stringify({
      "data": [
        {
          "Department": service11,
          "First_Name": name11,
          // "Last_Name": lastName11, 
          "Email": email11,
          "Description": message11,
          "Phone": phone11
        }
      ]
    })
  });
  let data2 = await resp2.json();

  const response = await fetch('https://chat.bol7.com/api/whatsapp/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: "919220784506",
      to: `${phone11}`,
      type: "MARKETING",
      data: {
        name: "r12",
        language: {
          code: "en"
        },
        components: []
      }
    })
  });

  res.json({ success: true, message: "Thank You! we will get back you shortly" });
});
// ================route for contact us page end===========

app.post("/contact1", async (req, res) => {
  const { company1, name1, email1, phone1, service1, message1 } = req.body;
  // console.log({ company1, name1, email1, phone1, service1, message1 });

  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });

  // const htmlToSend = template(replacements);

  // send mail with defined transport object
  let info1 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: "info@kusheldigi.com",
    subject: "Contact Form",
    text: `
        <div>
            <div>Company: ${company1}</div>
            <div>Name: ${name1}</div>
            <div>Email: ${email1}</div>
            <div>Phone: ${phone1}</div>
            <div>Service: ${service1}</div>
            <div>Message: ${message1}</div>
        </div>
    `,
    html: `
    <div>
    <div>Company: ${company1}</div>
    <div>Name: ${name1}</div>
    <div>Email: ${email1}</div>
    <div>Phone: ${phone1}</div>
    <div>Service: ${service1}</div>
    <div>Message: ${message1}</div>
</div>
        `,
  });

  let info2 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: email1,
    subject: "Contact Form",
    text: `
      Thank you
    `,
    html: `
            <div>
              <div>Dear ${name1}, </div>
                <div>
                <br/>
Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
<br/>
Best regards,
<br/>
Shubham Gupta
<br/>
Kushel Digi Solutions Team</div>
            </div>
        `,
  });

  let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF&client_secret=e49d2b9e743e403ebba076fd28a05a80f6e5815833&refresh_token=1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432`, {
    method: 'POST'
  });
  let data1 = await resp1.json();
  // console.log(data1);
  let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data1.access_token}`
    },
    body: JSON.stringify({
      "data": [
        {
          "Company": company1,
          "First_Name": name1,
          "Last_Name": "-",
          "Email": email1,
          "Department": service1,
          "Phone": phone1
        }
      ]
    })
  });
  let data2 = await resp2.json();

  res.json({ success: true, message: "Thank You! we will get back you shortly" });
});

app.post("/contact2", async (req, res) => {
  const { name2, phone2, email2, message2 } = req.body;
  console.log({ name2, phone2, email2, message2 })
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });


  let info2 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: "info@kusheldigi.com",
    subject: "Contact Form",
    replyTo: `${email2}`,
    text: `
        <div>
            <div>Name: ${name2}</div>
            <div>phone: ${phone2}</div>
            <div>email: ${email2}</div>
            <div>Message: ${message2}</div>
        </div>
    `,
    html: `
    <div>
    <div>Name: ${name2}</div>
    <div>phone: ${phone2}</div>
    <div>email: ${email2}</div>
    <div>Message: ${message2}</div>
</div>
        `,
  });

  let info3 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: email2,
    subject: "Contact Form",
    text: `
      Thank you
    `,
    html: `
             <div>
              <div>Dear ${name2}, </div>
                <div>
                <br/>
Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
<br/>
Best regards,
<br/>
Shubham Gupta
<br/>
Kushel Digi Solutions Team</div>
            </div>
        `,
  });

  let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF&client_secret=e49d2b9e743e403ebba076fd28a05a80f6e5815833&refresh_token=1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432`, {
    method: 'POST'
  });
  let data1 = await resp1.json();
  console.log(data1);
  let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data1.access_token}`
    },
    body: JSON.stringify({
      "data": [
        {
          "First_Name": name2,
          "Last_Name": "-",
          "Email": email2,
          "Description": message2,
          "Phone": phone2
        }
      ]
    })
  });
  let data2 = await resp2.json();

  const response = await fetch('https://chat.bol7.com/api/whatsapp/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: "919220784506",
      to: `${phone2}`,
      type: "MARKETING",
      data: {
        name: "r12",
        language: {
          code: "en"
        },
        components: []
      }
    })
  });

  res.json({ success: true, message: "Thank You! we will get back you shortly" });
});

app.post("/contact3", async (req, res) => {
  const { name4, email4, requirement4 } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });

  // const htmlToSend = template(replacements);

  // send mail with defined transport object
  let info1 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: "info@kusheldigi.com",
    subject: "Contact Form",
    text: `
            Name: ${name4}, 
            Email: ${email4}, 
            Requirement: ${requirement4}, 
    `,
    html: `
    <div>
    <div>Name: ${name4}</div>
    <div>Email: ${email4}</div>
    <div>Requirement: ${requirement4}</div>
</div>
        `,
  });

  let info2 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: email4,
    subject: "Contact Form",
    text: `
      Thank you
    `,
    html: `
            <div>
              <div>Dear ${name4}, </div>
                <div>
                <br/>
Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
<br/>
Best regards,
<br/>
Shubham Gupta
<br/>
Kushel Digi Solutions Team</div>
            </div>
        `,
  });

  let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF&client_secret=e49d2b9e743e403ebba076fd28a05a80f6e5815833&refresh_token=1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432`, {
    method: 'POST'
  });
  let data1 = await resp1.json();
  console.log(data1);
  let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data1.access_token}`
    },
    body: JSON.stringify({
      "data": [
        {

          "First_Name": name4,
          "Last_Name": "-",
          "Email": email4,
          "Description": requirement4,
        }
      ]
    })
  });
  let data2 = await resp2.json();

  res.json({ success: true, message: "Thank You! we will get back you shortly" });

  // res.json({ success: true, message: "Thank You! we will get back you shortly" });
});

app.post("/contact4", async (req, res) => {
  const { first_name, last_name, email_address, city, date, time, additional_msg } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });

  // const htmlToSend = template(replacements);

  // send mail with defined transport object
  let info1 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: "info@kusheldigi.com",
    subject: "Contact Form",
    text: `
            FirstName: ${first_name}, 
            LastName: ${last_name}, 
            EmailAddress: ${email_address}, 
            City: ${city},
            Date: ${date},
            Time: ${time},
            AdditionalMessage: ${additional_msg}
    `,
    html: `
    <div>
    <div>FirstName: ${first_name}</div>
    <div>LastName: ${last_name}</div>
    <div>EmailAddress: ${email_address}</div>
    <div>City: ${city}</div>
    <div>Date: ${date}</div>
    <div>Time: ${time}</div>
    div>AdditionalMessage: ${additional_msg}</div>
</div>
        `,
  });

  let info2 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: email_address,
    subject: "Contact Form",
    text: `
      Thank you
    `,
    html: `
            <div>
              <div>Dear ${first_name}, </div>
                <div>
   <br/>
Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
<br/>
Best regards,
<br/>
Shubham Gupta
<br/>
Kushel Digi Solutions Team</div>
            </div>
        `,
  });

  res.json({ success: true, message: "Thank You! we will get back you shortly" });
});

app.post("/contact5", async (req, res) => {
  const { technology, products, Estore, name6, mobile6, email6 } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@kusheldigi.com",
      pass: "Infokushel@12345"
    },
    from: "info@kusheldigi.com",
    tls: {
      rejectUnauthorized: false,
    },
  });

  // const htmlToSend = template(replacements);

  // send mail with defined transport object
  let info1 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <webmaster.kushel@gmail.com>',
    to: "webmaster.kushel@gmail.com",
    subject: "Contact Form",
    text: `
            Technology: ${technology}, 
            Products: ${products}, 
            E-store: ${Estore}, 
            Name: ${name6},
            Mobile: ${mobile6},
            Email: ${email6},
    `,
    html: `
    <div>
    <div>Technology: ${technology}</div>
    <div>Products: ${products}</div>
    <div>E-store: ${Estore}</div>
    <div>Name: ${name6}</div>
    <div>Mobile: ${mobile6}</div>
    <div>Email: ${email6}</div>
</div>
        `,
  });

  let info2 = await transporter.sendMail({
    from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
    to: email6,
    subject: "Contact Form",
    text: `
      Thank you
    `,
    html: `
            <div>
              <div>Dear ${name6}, </div>
                <div>
                <br/>
Thank you for reaching out to Kushel Digi Solutions! We have received your message and are eager to learn more about how we can assist you in achieving your goals.
Our team is reviewing your submission and will contact you within 24 hours with further details. We are dedicated to understanding your needs and providing tailored solutions that deliver meaningful results.
If you have any additional information to share or further questions, please don’t hesitate to contact us directly at info@kusheldigi.com.
Thank you for choosing Kushel Digi Solutions. We look forward to making your journey with us smooth, productive, and successful.
<br/>
Best regards,
<br/>
Shubham Gupta
<br/>
Kushel Digi Solutions Team</div>
            </div>
        `,
  });

  // res.json({ success: true, message: "Thank You! we will get back you shortly" });
  let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF&client_secret=e49d2b9e743e403ebba076fd28a05a80f6e5815833&refresh_token=1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432`, {
    method: 'POST'
  });
  let data1 = await resp1.json();
  console.log(data1);
  let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Leads", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${data1.access_token}`
    },
    body: JSON.stringify({
      "data": [
        {
          "First_Name": name6,
          "Last_Name": "-",
          "Email": email6,
          "Phone": mobile6,
          "Department": technology,
          // "Website":products,
          // "Industry":Estore
        }
      ]
    })
  });
  let data2 = await resp2.json();

  res.json({ success: true, message: "Thank You! we will get back you shortly" });
});

// {
//   "access_token": "1000.3657f6fbd42dc38b5f06fbf321c9ecc8.bd3584c9403947deea1c1e68aab87f23",
//   "refresh_token": "1000.bf95506572bf39c5e65f0193282c49ae.27cc0b5446a600eec1e53b05b8c804e2",
//   "api_domain": "https://www.zohoapis.in",
//   "token_type": "Bearer",
//   "expires_in": 3600
// }
app.post('/test', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    let resp1 = await fetch(`https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&client_id=1000.FS0PE9O76Z2VG1XDJFGG49O4J77ZKF&client_secret=e49d2b9e743e403ebba076fd28a05a80f6e5815833&refresh_token=1000.7cabfb8e30f390c31275783a09f4b907.2aea28f36e7defada84b8e4dc38ce432`, {
      method: 'POST'
    });
    let data1 = await resp1.json();
    console.log(data1);
    let resp2 = await fetch("https://www.zohoapis.in/crm/v4/Contacts", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data1.access_token}`
      },
      body: JSON.stringify({
        "data": [
          {
            "Department": service,
            "First_Name": name,
            "Last_Name": "-",
            "Email": email,
            "Description": message,
            "Phone": phone
          }
        ]
      })
    });
    let data2 = await resp2.json();
    res.json({ success: true, data: data2, message: 'Form submitted successfully' });
  } catch (error) {
    console.log(error.message);
  }
})

app.listen(PORT, () => {
  console.log("server is runing on port", PORT);
});
