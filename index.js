const multipart = require("parse-multipart");
const AWS = require("aws-sdk");
const S3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const userId = event.params.querystring.userid;
    const bodyBuffer = new Buffer(event["body-json"].toString(), "base64");
    const boundary = multipart.getBoundary(event.params.header["content-type"]);

    const parts = multipart.Parse(bodyBuffer, boundary);

    const fileExtention = parts[0].filename.split(".")[1];
    const filename = `${Math.random().toString()}.${fileExtention}`;
    const filepath = `${userId}/${filename}`;

    // uploading to S3
    const uploadParams = {
      // i usually use proccess.env to securely hide the bucket name
      Bucket: "makinchzhar",
      Key: filepath,
      Body: parts[0].data,
    };

    await S3.putObject(uploadParams).promise();

    const response = {
      statusCode: 200,
      body: { msg: "success", data: filename },
    };
    return response;
  } catch (err) {
    return err.message;
  }
};
