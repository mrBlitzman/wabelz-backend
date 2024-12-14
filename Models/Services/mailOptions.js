const logo = "https://wabelzapi.fly.dev/Assets/Icons/wabelz-logo.png";

const confirmationCodeOptions = (formData, validateOrderData, token) => {

    return {
        from: process.env.TRANSPORTER_MAIL,
        to: formData.email,
        subject: "Order Confirmation",
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Wabelz Order Confirmation</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #000010;
                  color: #fff;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                .container {
                  width: 100%;
                  background-color: #1b2b4d;
                  border-radius: 8px;
                }
                .container .content {
                  padding: 20px;
                  max-width: 600px;
                  margin: 0 auto;
                }
                h1 {
                  color: #dec4ff;
                  text-align: center;
                }
                p {
                  color: #fff;
                  line-height: 1.6;
                }
                .order-details {
                  background-color: #222;
                  padding: 15px;
                  border-radius: 8px;
                  margin-top: 20px;
                }
                .order-details p {
                  margin: 5px 0;
                }
                .total {
                  margin-top: 20px;
                  font-size: 1.2em;
                  font-weight: bold;
                  color: #ffd700;
                  text-align: center;
                }
                .verification-code {
                  margin: 40px 60px;
                  padding: 10px;
                  background-color: #8c8cec;
                  text-align: center;
                  font-size: 1.1em;
                  border-radius: 5px;
                  color: #000010;
                }
                .verification-code p {
                  margin-bottom: 0;
                }
                .verification-code h2 {
                  margin-top: 1rem;
                  font-size: 3rem;
                }
                .footer {
                  margin-top: 40px;
                  text-align: center;
                  color: #8c8cec;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table th,
                table td {
                  padding: 8px;
                  border: 1px solid #8c8cec;
                  text-align: center;
                  color: #fff;
                }

                @media (max-width: 768px) {
                  .verification-code h2{
                  font-size: 2rem;
                  }

                  .verification-code {
                    margin: 40px 20px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="content">
                  <h1>Order Confirmation</h1>
                  <p>Dear ${formData.name},</p>
                  <p>
                    Thank you for your order with Wabelz! We are excited to confirm that
                    your order has been successfully placed.
                  </p>
                  <div class="verification-code">
                    <p>Here is your verification code:</p>
                    <h2>${token}</h2>
                  </div>
                  <div class="order-details">
                    <p>
                      <strong>Your Products:</strong>
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th style="text-align: left">Title</th>
                          <th>Unit Price</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${validateOrderData.order.orderDetails
                          .map(
                            (item) => `
                          <tr>
                            <td style="text-align: left">${item.invoiceTitle}</td>
                            <td>$${item.price}</td>
                            <td>${item.quantity}</td>
                          </tr>
                        `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                  <p class="total">Total: $${validateOrderData.order.totalPrice}</p>
                  <div class="footer">
                    <p>
                      Thank you for choosing Wabelz. We hope you enjoy your purchase!
                    </p>
                    <img
                      src="${logo}"
                      alt="Wabelz Logo"
                      style="
                        display: block;
                        margin: 4rem auto;
                        max-width: 100px;
                        height: auto;
                      "
                    />
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      };

}

const orderDetailsOptions = (formData, validateOrderData) => {
    return {
        from: process.env.TRANSPORTER_MAIL,
        to: formData.email,
        subject: "Order Recieved - Wabelz",
        html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Order Received</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #000010;
                      color: #fff;
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }

                      .container {
                        width: 100%;
                        background-color: #1b2b4d;
                        border-radius: 8px;
                      }
                      .container .content {
                        padding: 20px;
                        max-width: 600px;
                        margin: 0 auto;
                      }

                    h1 {
                      color: #dec4ff;
                      text-align: center;
                    }

                    p {
                      color: #fff;
                      line-height: 1.6;
                    }

                    .order-details {
                      background-color: #222;
                      padding: 15px;
                      border-radius: 8px;
                      margin-top: 20px;
                    }

                    .order-details p {
                      margin: 5px 0;
                    }

                    .footer {
                      margin-top: 40px;
                      text-align: center;
                      color: #8c8cec;
                    }

                    .total {
                        margin-top: 20px;
                        font-size: 1.2em;
                        font-weight: bold;
                        color: #ffd700;
                        text-align: center;
                      }

                      table {
                        width: 100%;
                        border-collapse: collapse;
                      }
                      table th,
                      table td {
                        padding: 8px;
                        border: 1px solid #8c8cec;
                        text-align: center;
                        color: #fff;
                      }
                        
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="content">
                      <h1>Order Received</h1>
                      <p>Dear ${validateOrderData.safeForm.name},</p>
                      <p>We have successfully received your order. Our team will contact you shortly to schedule a live meeting where we will discuss the details and design of your project.</p>
                      <p>Please note that payment will be made via bank transfer (IBAN) after the meeting.</p>
                      <div class="order-details">
                        <p>
                          <strong>Your Products:</strong>
                        </p> 
                        <table>
                              <thead>
                                <tr>
                                  <th style="text-align: left">Title</th>
                                  <th>Unit Price</th>
                                  <th>Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${validateOrderData.order.orderDetails
                                  .map(
                                    (item) => `
                                  <tr>
                                    <td style="text-align: left">${item.invoiceTitle}</td>
                                    <td>$${item.price}</td>
                                    <td>${item.quantity}</td>
                                  </tr>
                                `
                                  )
                                  .join('')}
                              </tbody>
                            </table>
                      </div>
                      <p class="total">Total: $${validateOrderData.order.totalPrice}</p>
                      <div class="footer">
                        <p>Thank you for choosing Wabelz. We look forward to working with you!</p>
                        <img src="${logo}" alt="Wabelz Logo"
                        style="
                          display: block;
                          margin: 4rem auto;
                          max-width: 100px;
                          height: auto;
                        ">
                      </div>
                    </div>
                  </div>
                </body>
              </html>

              `};
}

const newOrderRecievedOptions = (validateOrderData) => {
    const recipients = process.env.TEAM_MAILS.split(',');
    return {
        from: process.env.TRANSPORTER_MAIL,
        to: recipients.map(email => email.trim()).join(','),
        subject: "New Order - Wabelz",
        html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>New Order</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #000010;
                      color: #fff;
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }

                    .container {
                        width: 100%;
                        background-color: #1b2b4d;
                        border-radius: 8px;
                      }
                      .container .content {
                        padding: 20px;
                        max-width: 600px;
                        margin: 0 auto;
                      }

                    h1 {
                      color: #dec4ff;
                      text-align: center;
                    }

                    p {
                      color: #fff;
                      line-height: 1.6;
                    }

                    .section-title {
                      font-weight: bold;
                      margin-top: 20px;
                    }

                    .order-details,
                    .customer-info {
                      background-color: #222;
                      padding: 15px;
                      border-radius: 8px;
                      margin-top: 20px;
                    }

                    .order-details p,
                    .customer-info p {
                      margin: 5px 0;
                    }

                    .footer {
                      margin-top: 40px;
                      text-align: center;
                      color: #8c8cec;
                    }

                    .total {
                      margin-top: 20px;
                      font-size: 1.2em;
                      font-weight: bold;
                      color: #ffd700;
                      text-align: center;
                    }

                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    table th,
                    table td {
                      padding: 8px;
                      border: 1px solid #8c8cec;
                      text-align: center;
                      color: #fff;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="content">
                      <h1>New Order Received</h1>
                      <p>A new order has been received from Wabelz. Please review the customer and order details below:</p>
                      <div class="customer-info">
                        <p class="section-title">Customer Information:</p>
                        <p>
                          <strong>Name:</strong> ${validateOrderData.safeForm.name}
                        </p>
                        <p>
                          <strong>Email:</strong> ${validateOrderData.safeForm.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> ${validateOrderData.safeForm.phone}
                        </p>
                        <p>
                          <strong>Country:</strong> ${validateOrderData.safeForm.country}
                        </p>
                        <p>
                          <strong>Industry:</strong> ${validateOrderData.safeForm.industry}
                        </p>
                      </div>
                      <div class="order-details">
                        <p class="section-title">Order Information:</p>
                        <p>
                          <strong>Website Type:</strong> ${validateOrderData.safeForm.websiteType}
                        </p>
                        <p>
                          <strong>Goal:</strong> ${validateOrderData.safeForm.goal}
                        </p>
                        <p>
                          <strong>Description:</strong> ${validateOrderData.safeForm.description}
                        </p>
                        ${validateOrderData.safeForm.additionalNote &&
                          `<p>
                            <strong>Additional Notes:</strong> ${validateOrderData.safeForm.additionalNote}
                          </p>`
                        }
                      </div>
                      <div class="order-details">
                        <p>
                          <strong>Your Products:</strong>
                        </p> 
                        <table>
                            <thead>
                              <tr>
                                <th style="text-align: left">Title</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${validateOrderData.order.orderDetails
                                .map(
                                  (item) => `
                                <tr>
                                  <td style="text-align: left">${item.invoiceTitle}</td>
                                  <td>$${item.price}</td>
                                  <td>${item.quantity}</td>
                                </tr>
                              `
                                )
                                .join('')}
                            </tbody>
                        </table>
                      </div>
                      <p class="total">Total: $${validateOrderData.order.totalPrice}</p>
                      <div class="footer">
                        <p>Thank you for your attention. Please process the order accordingly.</p>
                        <img src="${logo}" alt="Wabelz Logo"
                        style="
                          display: block;
                          margin: 4rem auto;
                          max-width: 100px;
                          height: auto;
                        "
                        >
                      </div>
                    </div>
                  </div>
                </body>
              </html>
              `};
}

export default function returnMailOptions(mailType, {validateOrderData, formData = "", token}) {
    switch(mailType){
        case "confirmationCode":
            return confirmationCodeOptions(formData, validateOrderData, token);
        case "orderDetails":
            return orderDetailsOptions(formData, validateOrderData);
        case "newOrderRecieved":
            return newOrderRecievedOptions(validateOrderData);
    }
}