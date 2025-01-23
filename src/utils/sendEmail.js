// Import necessary AWS SDK clients
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient"); // Assuming you have a separate SES client setup

// Function to create the SendEmailCommand
const createSendEmailCommand = (toAddress, fromAddress, Subject, body) => {
  // HTML formatted email body
  const htmlBody = `
    <html>
      <body>
        <h1>Hello,</h1>
        <p>This is an example email sent using AWS SES.</p>
        <p>Here is a <a href="http://example.com">link</a> to check out more information.</p>
        <p>Best regards,</p>
        <p>Your Company Name</p>
      </body>
    </html>
  `;

  // Plain-text formatted email body
  const textBody = `
    Hello,

    This is an example email sent using AWS SES.
    ${body}
    Here is a link to check out more information: http://example.com

    Best regards,
    DevTinder
  `;

  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress], // Email recipient(s)
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8", // Character encoding for HTML body
          Data: htmlBody, // HTML email body
        },
        Text: {
          Charset: "UTF-8", // Character encoding for plain-text body
          Data: textBody, // Plain-text email body
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: Subject, // Subject of the email
      },
    },
    Source: fromAddress, // Sender's email address
    ReplyToAddresses: [fromAddress], // Optional: specify reply-to address (can be the same as fromAddress)
  });
};

// Function to send the email using SES
const run = async (Subject, body) => {
  // Replace with actual email addresses
  const recipientEmail = "siddheshchavan02@gmail.com";
  const senderEmail = "sidkc1205@gmail.com";

  const sendEmailCommand = createSendEmailCommand(
    recipientEmail,
    senderEmail,
    Subject,
    body
  );

  try {
    // Send email using SES client
    const result = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", result);
  } catch (caught) {
    // Handle error if email is rejected or fails
    if (caught instanceof Error && caught.name === "MessageRejected") {
      console.error("Message was rejected:", caught);
      return caught; // Return the error
    }
    // Rethrow the error if it's not a message rejection
    throw caught;
  }
};

// Call the run function to send the email
module.exports = { run };
