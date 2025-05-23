const GoogleImages = require('google-images');

const client = new GoogleImages(
  'b99ad2dddfcac4813',
  'AIzaSyAmFfu2RsIuY7DoarLaK-GNoMQAkXoq4sQ'
);

const axios = require('axios').default;

const htmlDocx = require('html-docx-js');

var fs = require('fs');

var pdf = require('html-pdf');

/**
 * controller function which converts html to docx.
 * It first converts html to a blob and store it in the
 * constant docx. then it sets all the necessary headers
 * which are used to send files and content as a response
 * to the client.
 */
exports.convertHtmlToDocx = async (req, res, next) => {
  const docx = htmlDocx.asBlob(req.body.htmlString);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-disposition', 'attachment; filename=muzamil.docx');
  res.setHeader('Content-Length', docx.length);

  fs.writeFile('myword.docx', docx, function (err) {
    if (err) return console.log(err);
    console.log('done');
  });
  res.send(docx);
};

/**
 * controller function which converts html to PDF.
 * It first creates a pdf and converts it to the file
 * and upon doing this the function is executed
 * as a callback in which response.download is used
 * to send back the converted file to the client.
 */
exports.convertHtmlToPDF = (req, response, next) => {
  var html = req.body.htmlString;
  //setting PDF format as a letter
  var options = { format: 'Letter' };

  pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
    if (err) return console.log(err);
    response.download(res.filename, `${req.body.title}.pdf`);
    console.log(res);
  });
};

/**
 * controller function which makes use of google
 * image API to search images and send back json response
 * to the client
 */
exports.SearchImages = (req, res, next) => {
  const keyword = req.params.keyword;

  const url =
    'https://www.googleapis.com/customsearch/v1?key=AIzaSyAmFfu2RsIuY7DoarLaK-GNoMQAkXoq4sQ&cx=b99ad2dddfcac4813&searchType=image&q=tom';
  axios
    .get(url)
    .then((response) => {
      console.log(response.data.items);
    })
    .catch((err) => {
      console.log(err);
    });
};
