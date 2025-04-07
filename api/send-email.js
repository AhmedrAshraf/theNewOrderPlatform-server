require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/send-email", async (req, res) => {
    const order = req.body 
    console.log("🚀 ~ app.post ~ order:", order)
    const solution = order?.solution || {}
    const sellerName = solution.seller_name || "Marketplace Seller"
    const solutionTitle = solution.title || "Purchased Solution"
    const solutionDescription = solution.description || "Thank you for your purchase"

    const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
        
            // Format the price
            const formattedPrice = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order.amount / 100) // Assuming amount is in cents
    
            const transporter = nodemailer.createTransport({
           host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
            user: process.env.EMAIL_USER || "trustmuhammadimedical@gmail.com",
            pass: process.env.EMAIL_PASSWORD || "fxjqiyaquedqyyjj",
            },
        })
    

      const mailOptions = {
        from: `Your Marketplace <${process.env.EMAIL_USER || "trustmuhammadimedical@gmail.com"}>`,
        to:  order?.email, // In production, use customer's email
        subject: `Order Confirmation #${order.id}`,
        html: `
          <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
            </head>
            <body style="margin: 0; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #00d9c0; padding: 30px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmation</h1>
                        </td>
                    </tr>
                    
                    <!-- Order Confirmation Message -->
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; background-color: #f0f9ff;">
                            <div style="width: 60px; height: 60px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h2 style="margin: 0; color: #00d9c0; font-size: 22px; font-weight: 700;">Thank You for Your Purchase!</h2>
                            <p style="margin: 10px 0 0; font-size: 16px; color: #475569;">Your order has been confirmed and is now being processed.</p>
                            <p style="margin: 5px 0 0; font-size: 16px;">Order #${order.id} • ${orderDate}</p>
                        </td>
                    </tr>
                    
                    
                    <!-- Product Details -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td width="70%" style="vertical-align: top; padding-right: 15px;">
                                                    <h4 style="margin: 0 0 8px; font-size: 18px; color: #1e3a8a;">${solutionTitle}</h4>
                                                    <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">
                                                        ${solutionDescription}
                                                    </p>
                                                    <p style="margin: 0; font-size: 14px;">
                                                        <span style="color: #64748b;">Seller:</span> 
                                                        <span style="color: #334155; font-weight: 500;">${sellerName}</span>
                                                    </p>
                                                    <p style="margin: 8px 0 0; font-size: 14px;">
                                                        <span style="color: #64748b;">Order ID:</span> 
                                                        <span style="color: #334155; font-weight: 500;">${order.id}</span>
                                                    </p>
                                                    <p style="margin: 8px 0 0; font-size: 14px;">
                                                        <span style="color: #64748b;">Solution ID:</span> 
                                                        <span style="color: #334155; font-weight: 500;">${order.solution_id}</span>
                                                    </p>
                                                </td>
                                                <td width="30%" style="vertical-align: top; text-align: right;">
                                                    <p style="margin: 0 0 5px; font-size: 14px; color: #64748b;">Price</p>
                                                    <p style="margin: 0; font-size: 20px; font-weight: 700; color: #00d9c0;">${formattedPrice}</p>
                                                    <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">Quantity: 1</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Access Instructions -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f0f9ff; border-radius: 6px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <h3 style="margin: 0 0 10px; color: #00d9c0; font-size: 16px;">How to Access Your Purchase</h3>
                                        <p style="margin: 0 0 10px; font-size: 14px;">
                                            1. Log in to your account dashboard<br>
                                            2. Navigate to "My Purchases" section<br>
                                            3. Find your solution and click "Access"
                                        </p>
                                        <div style="margin-top: 15px; text-align: center;">
                                            <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #00d9c0; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">Go to Dashboard</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #00d9c0; padding: 20px; text-align: center; color: white;">
                            <p style="margin: 0; font-size: 14px;">Questions? Contact our support team</p>
                            <p style="margin: 5px 0 0; font-size: 14px;">support@yourmarketplace.com | (555) 123-4567</p>
                            <div style="margin-top: 15px;">
                                <a href="#" style="display: inline-block; margin: 0 5px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>
                                <a href="#" style="display: inline-block; margin: 0 5px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="#" style="display: inline-block; margin: 0 5px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                            </div>
                            <p style="margin: 15px 0 0; font-size: 12px;">© ${new Date().getFullYear()} Your Marketplace. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
      }
  
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ message: "Error sending email." });
    }
});

// Start server
app.listen(8200, () => {
    console.log(`Server running on http://localhost:82000`);
});


// require("dotenv").config()
// const express = require("express")
// const nodemailer = require("nodemailer")
// const cors = require("cors")
// const bodyParser = require("body-parser")

// const app = express()

// app.use(cors())
// app.use(bodyParser.json())

// app.post("/api/send-email", async (req, res) => {
//   console.log("🚀 ~ app.post ~ res:", res)
// //   console.log("📧 Order confirmation email request received")
//   const {bookingData} = req.body
//    await sendOrderConfirmationEmail(bookingData)
// })

// async function sendOrderConfirmationEmail(bookingData) {
//   try {
//     console.log("Processing order confirmation email for:", bookingData)
//     const order = bookingData // Get the first item from the array

//     // Get solution details
//     const solution = order?.solution || {}
//     const sellerName = solution.seller_name || "Marketplace Seller"
//     const solutionTitle = solution.title || "Purchased Solution"
//     const solutionDescription = solution.description || "Thank you for your purchase"

//     // Create transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER || "trustmuhammadimedical@gmail.com",
//         pass: process.env.EMAIL_PASSWORD || "fxjqiyaquedqyyjj",
//       },
//     })

//     // Format the date
//     const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })

//     // Format the price
//     const formattedPrice = new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(order.amount / 100) // Assuming amount is in cents

//     // Generate HTML email template
//     const htmlContent = `
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Order Confirmation</title>
//             </head>
//             <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333;">
//                 <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
//                     <!-- Header -->
//                     <tr>
//                         <td style="background-color: #1e40af; padding: 30px 20px; text-align: center;">
//                             <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmation</h1>
//                         </td>
//                     </tr>
                    
//                     <!-- Order Confirmation Message -->
//                     <tr>
//                         <td style="padding: 30px 20px; text-align: center; background-color: #f0f9ff;">
//                             <div style="width: 60px; height: 60px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//                                     <polyline points="22 4 12 14.01 9 11.01"></polyline>
//                                 </svg>
//                             </div>
//                             <h2 style="margin: 0; color: #1e40af; font-size: 22px; font-weight: 700;">Thank You for Your Purchase!</h2>
//                             <p style="margin: 10px 0 0; font-size: 16px; color: #475569;">Your order has been confirmed and is now being processed.</p>
//                             <p style="margin: 5px 0 0; font-size: 16px;">Order #${order.id} • ${orderDate}</p>
//                         </td>
//                     </tr>
                    
//                     <!-- Order Status -->
//                     <tr>
//                         <td style="padding: 20px;">
//                             <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//                                 <tr>
//                                     <td style="padding: 15px; background-color: ${order.payment_status === "complete" ? "#dcfce7" : "#fee2e2"}; border-radius: 6px; text-align: center;">
//                                         <p style="margin: 0; font-weight: 600; color: ${order.payment_status === "complete" ? "#166534" : "#b91c1c"};">
//                                             Payment Status: ${order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                                         </p>
//                                         <p style="margin: 5px 0 0; font-size: 14px; color: ${order.status === "pending" ? "#92400e" : "#166534"};">
//                                             Order Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                                         </p>
//                                     </td>
//                                 </tr>
//                             </table>
//                         </td>
//                     </tr>
                    
//                     <!-- Product Details -->
//                     <tr>
//                         <td style="padding: 0 20px 20px;">
//                             <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Product Details</h3>
//                             <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;">
//                                 <tr>
//                                     <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px;">
//                                         <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//                                             <tr>
//                                                 <td width="70%" style="vertical-align: top; padding-right: 15px;">
//                                                     <h4 style="margin: 0 0 8px; font-size: 18px; color: #1e3a8a;">${solutionTitle}</h4>
//                                                     <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">
//                                                         ${solutionDescription}
//                                                     </p>
//                                                     <p style="margin: 0; font-size: 14px;">
//                                                         <span style="color: #64748b;">Seller:</span> 
//                                                         <span style="color: #334155; font-weight: 500;">${sellerName}</span>
//                                                     </p>
//                                                     <p style="margin: 8px 0 0; font-size: 14px;">
//                                                         <span style="color: #64748b;">Order ID:</span> 
//                                                         <span style="color: #334155; font-weight: 500;">${order.id}</span>
//                                                     </p>
//                                                     <p style="margin: 8px 0 0; font-size: 14px;">
//                                                         <span style="color: #64748b;">Solution ID:</span> 
//                                                         <span style="color: #334155; font-weight: 500;">${order.solution_id}</span>
//                                                     </p>
//                                                 </td>
//                                                 <td width="30%" style="vertical-align: top; text-align: right;">
//                                                     <p style="margin: 0 0 5px; font-size: 14px; color: #64748b;">Price</p>
//                                                     <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1e40af;">${formattedPrice}</p>
//                                                     <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">Quantity: 1</p>
//                                                 </td>
//                                             </tr>
//                                         </table>
//                                     </td>
//                                 </tr>
//                             </table>
//                         </td>
//                     </tr>
                    
//                     <!-- Payment Summary -->
//                     <tr>
//                         <td style="padding: 0 20px 20px;">
//                             <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Payment Summary</h3>
//                             <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//                                 <tr>
//                                     <td style="padding: 8px 0; color: #64748b;">Subtotal</td>
//                                     <td style="padding: 8px 0; text-align: right; color: #334155;">${formattedPrice}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style="padding: 8px 0; color: #64748b;">Tax</td>
//                                     <td style="padding: 8px 0; text-align: right; color: #334155;">$0.00</td>
//                                 </tr>
//                                 <tr>
//                                     <td style="padding: 15px 0; font-weight: 700; color: #0f172a; font-size: 18px; border-top: 2px solid #e5e7eb;">Total</td>
//                                     <td style="padding: 15px 0; text-align: right; font-weight: 700; color: #1e40af; font-size: 18px; border-top: 2px solid #e5e7eb;">${formattedPrice}</td>
//                                 </tr>
//                             </table>
//                         </td>
//                     </tr>
                    
//                     <!-- Access Instructions -->
//                     <tr>
//                         <td style="padding: 0 20px 20px;">
//                             <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f0f9ff; border-radius: 6px; overflow: hidden;">
//                                 <tr>
//                                     <td style="padding: 15px;">
//                                         <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 16px;">How to Access Your Purchase</h3>
//                                         <p style="margin: 0 0 10px; font-size: 14px;">
//                                             1. Log in to your account dashboard<br>
//                                             2. Navigate to "My Purchases" section<br>
//                                             3. Find your solution and click "Access"
//                                         </p>
//                                         <div style="margin-top: 15px; text-align: center;">
//                                             <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">Go to Dashboard</a>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             </table>
//                         </td>
//                     </tr>
                    
//                     <!-- Footer -->
//                     <tr>
//                         <td style="background-color: #1e3a8a; padding: 20px; text-align: center; color: white;">
//                             <p style="margin: 0; font-size: 14px;">Questions? Contact our support team</p>
//                             <p style="margin: 5px 0 0; font-size: 14px;">support@yourmarketplace.com | (555) 123-4567</p>
//                             <div style="margin-top: 15px;">
//                                 <a href="#" style="display: inline-block; margin: 0 5px;">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
//                                     </svg>
//                                 </a>
//                                 <a href="#" style="display: inline-block; margin: 0 5px;">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                         <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
//                                         <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
//                                         <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
//                                     </svg>
//                                 </a>
//                                 <a href="#" style="display: inline-block; margin: 0 5px;">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                         <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
//                                     </svg>
//                                 </a>
//                             </div>
//                             <p style="margin: 15px 0 0; font-size: 12px;">© ${new Date().getFullYear()} Your Marketplace. All rights reserved.</p>
//                         </td>
//                     </tr>
//                 </table>
//             </body>
//             </html>
//         `

//     // Send email
//     const mailOptions = {
//       from: `Your Marketplace <${process.env.EMAIL_USER || "trustmuhammadimedical@gmail.com"}>`,
//       to: process.env.RECIPIENT_EMAIL || "ahmedr.0331@gmail.com", // In production, use customer's email
//       subject: `Order Confirmation #${order.id}`,
//       html: htmlContent,
//     }

//     await transporter.sendMail(mailOptions)
//     res.status(200).json({ message: "Order confirmation email sent successfully!" })
//   } catch (error) {
//     console.error("Error sending order confirmation email:", error)
//     res.status(500).json({ message: "Error sending order confirmation email." })
//   }
// }

// // async function sendContactFormEmail(formData, res) {
// //   try {
// //     const { name, email, telephone, subject, message, maisons } = formData

// //     const transporter = nodemailer.createTransport({
// //       host: "smtp.gmail.com",
// //       port: 465,
// //       secure: true,
// //       auth: {
// //         user: process.env.EMAIL_USER || "trustmuhammadimedical@gmail.com",
// //         pass: process.env.EMAIL_PASSWORD || "fxjqiyaquedqyyjj",
// //       },
// //     })

// //     const mailOptions = {
// //       from: `${name} <${process.env.EMAIL_USER || "trustmuhammadimedical@gmail.com"}>`,
// //       replyTo: email,
// //       to: process.env.RECIPIENT_EMAIL || "ahmedr.0331@gmail.com",
// //       subject: `Contact Site Maison Mélina de`,
// //       html: `
// //                 <!DOCTYPE html>
// //                 <html lang="en">
// //                 <head>
// //                     <meta charset="UTF-8">
// //                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //                     <title>Contact Form Notification</title>
// //                 </head>
// //                 <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333;">
// //                     <!-- Main Container -->
// //                     <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
// //                         <!-- Header -->
// //                         <div style="background-color: #1e40af; padding: 20px; text-align: center;">
// //                             <h1 style="color: #ffffff; margin: 0;">New Contact Form Submission</h1>
// //                         </div>
                        
// //                         <!-- Content -->
// //                         <div style="padding: 20px;">
// //                             <p style="margin-bottom: 20px; font-size: 16px;">You have received a new message from your website contact form:</p>
                            
// //                             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
// //                                 <tr>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; font-weight: bold; width: 30%;">Name:</td>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${name}</td>
// //                                 </tr>
// //                                 <tr>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; font-weight: bold;">Email:</td>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${email}</td>
// //                                 </tr>
// //                                 <tr>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; font-weight: bold;">Telephone:</td>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${telephone || "Not provided"}</td>
// //                                 </tr>
// //                                 <tr>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; font-weight: bold;">Subject:</td>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${subject || "Not provided"}</td>
// //                                 </tr>
// //                                 ${
// //                                   maisons
// //                                     ? `
// //                                 <tr>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; font-weight: bold;">Maisons:</td>
// //                                     <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${maisons}</td>
// //                                 </tr>
// //                                 `
// //                                     : ""
// //                                 }
// //                             </table>
                            
// //                             <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
// //                                 <h3 style="margin-top: 0; color: #1e40af;">Message:</h3>
// //                                 <p style="margin-bottom: 0; white-space: pre-wrap;">${message}</p>
// //                             </div>
                            
// //                             <p style="color: #666; font-size: 14px; margin-top: 30px;">This email was sent automatically from your website contact form.</p>
// //                         </div>
                        
// //                         <!-- Footer -->
// //                         <div style="background-color: #f0f9ff; padding: 15px; text-align: center; font-size: 14px; color: #666;">
// //                             <p style="margin: 0;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
// //                         </div>
// //                     </div>
// //                 </body>
// //                 </html>
// //             `,
// //     }

// //     await transporter.sendMail(mailOptions)
// //     res.status(200).json({ message: "Email sent successfully!" })
// //   } catch (error) {
// //     console.error("Email sending error:", error)
// //     res.status(500).json({ message: "Error sending email." })
// //   }
// // }

// // Start server

// app.listen(8200, () => {
//   console.log(`Server running on http://localhost:8200`)
// })

