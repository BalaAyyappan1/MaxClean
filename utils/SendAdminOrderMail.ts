import nodemailer from "nodemailer";

export const sendAdminOrderMail = async (
  name: string,
  email: string,
  phoneNumber: string,
  address: string,
  service: string,
  price: number,
  addOn: { title: string; price: number }[],
  tips: number,
  date: string,
  timeSlot: string,
  razorpayOrderId: string | undefined
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_ID,
      pass: process.env.NODE_MAILER_SECRET, // Use environment variables for production
    },
  });

  // Calculate the total price (Price + Add-ons + Tips)
  const totalAmount =
    price + addOn.reduce((sum, addon) => sum + addon.price, 0) + tips;

  const addOnHTML = addOn.length
    ? `<p><strong>Add-ons:</strong></p>
       <ul>
         ${addOn
           .map((addon) => `<li>${addon.title} - ₹${addon.price}</li>`)
           .join("")}
       </ul>`
    : `<p><strong>Add-ons:</strong> None</p>`;

  const mailOptions = {
    from: process.env.NODE_MAILER_ID, // Sender email
    to: [email, "maxcleanbusiness@gmail.com", "renuka.vvss@gmail.com"], // Recipient email
    subject: "New Order Received - Order Confirmation",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: black;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content h2 {
      color: #D70006;
      font-size: 22px;
    }
    .content p {
      line-height: 1.6;
      margin: 10px 0;
    }
    .details {
      margin-top: 20px;
      border: 1px solid #dddddd;
      border-radius: 8px;
      padding: 15px;
      background-color: #f9f9f9;
    }
    .details h3 {
      margin-top: 0;
      color: #333333;
    }
    .details p {
      margin: 5px 0;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777777;
      background-color: #f1f1f1;
    }
    .footer a {
      color: #D70006;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>MAX<span style="color: red;">CLEAN</span></h1>
      <h1>New Order Received</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Dear Team,</h2>
      <p>We have received a new order from <strong>${name}</strong>. Below are the details of the order:</p>

      <div class="details">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${razorpayOrderId}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Price:</strong> ₹${price}</p>
        ${addOnHTML} <!-- Injecting formatted Add-ons -->
        <p><strong>Tips:</strong> ₹${tips}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p> <!-- Added Total Amount -->
      </div>

      <p>If you need any additional details, feel free to contact the customer directly or reach out to us.</p>
      <p>Best regards,<br>Team MaxClean</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2024 MaxClean. All rights reserved.</p>
      <p>Need help? <a href="mailto:maxcleanbusiness@gmail.com">Contact Us</a></p>
    </div>
  </div>
</body>
</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("New order email sent successfully.");
  } catch (error) {
    console.error("Error sending new order email:", error);
  }
};
