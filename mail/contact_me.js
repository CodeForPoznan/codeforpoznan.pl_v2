const querystring = require("querystring");
const AWS = require("aws-sdk");

const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const stripTags = (text) =>  text.replace(/(<([^>]+)>)/ig,"");

exports.handler = async (event) => {
  AWS.config.update({ region: "eu-west-1" });

  const post = querystring.parse(event.body);
  if (
    !post.name ||
    !post.email ||
    !post.phone ||
    !post.message ||
    !validateEmail(post.email)
  ) {
    return {
      statusCode: 400,
      body: "No arguments Provided!",
    }
  }

  const name = stripTags(escapeHtml(post.name));
  const email = stripTags(escapeHtml(post.email));
  const phone = stripTags(escapeHtml(post.phone));
  const message = stripTags(escapeHtml(post.message));

  const email_body = `Otrzymałeś nową wiadomość z formularza kontaktowego codeforpoznan.pl.

  Oto szczegóły:
  Imię: ${name}
  Email: ${email}
  Telefon: ${phone}
  Message: ${message}`;

  const params = {
    Destination: { ToAddresses: [ "hello@codeforpoznan.pl" ] },
    Message: {
      Body: { Text: {
        Charset: "UTF-8",
        Data: email_body
      }},
     Subject: {
      Charset: "UTF-8",
      Data: `Formularz kontaktowy Code For Poznan: ${name}`
     }
    },
    ReplyToAddresses: [email],
    Source: "noreply@codeforpoznan.pl",
  };

  try {
    await new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(params)
      .promise();
  }
  catch(err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }

  return {
    statusCode: 200
  };
};
