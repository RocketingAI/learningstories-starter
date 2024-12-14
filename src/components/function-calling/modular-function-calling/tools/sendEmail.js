// sendEmail.js
function send_email({ to, body }) {
    console.group('Function Called: send_email()');
    console.log(`Calling send_email with to: ${to} and body: ${body}`);
    console.groupEnd();

    return "Email sent successfully";
}

const function_send_email = {
    type: "function",
    function: {
        name: "send_email",
        description: "Send an email to a specified recipient",
        parameters: {
            type: "object",
            properties: {
                to: {
                    type: "string",
                    description: "The email address of the recipient",
                },
                body: {
                    type: "string",
                    description: "The body of the email",
                },
            },
            required: ["to", "body"],
        },
    },
};

export { send_email, function_send_email };