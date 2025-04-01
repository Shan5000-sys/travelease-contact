const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "All fields are required." }),
      };
    }

    // Store in DynamoDB
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: Date.now().toString(),
        name,
        email,
        message,
        submittedAt: new Date().toISOString(),
      },
    };

    await dynamodb.put(params).promise();

    // Send email via SES
    const emailParams = {
      Source: process.env.SES_EMAIL_FROM,
      Destination: {
        ToAddresses: [process.env.SES_EMAIL_FROM],
      },
      Message: {
        Subject: { Data: "New Contact Form Submission" },
        Body: {
          Text: {
            Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Form submitted successfully!" }),
    };
  } catch (error) {
    console.error("Error processing form submission:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};

// Reusable CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}