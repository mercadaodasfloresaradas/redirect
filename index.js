import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 80;
const commonHeaders = {
  "Access-Control-Allow-Origin": '*',
}
const configAxios = {
  headers: commonHeaders,
};

app.use(cors());


app.use(express.raw({
  inflate: true,
  limit: '50mb',
  type: () => true, // this matches all content types
}));

app.use(bodyParser.json({limit: '50mb'})); 

/* 
redirect example
app.post("*", function (req, res) {
  //res.send(req.url + " : " + process.env.API_TO_REDIRECT);

  res.redirect(307, `${process.env.API_TO_REDIRECT}${req.url}`);
}); 
*/

app.get("*", function (req, res) {

  try {
    axios.get(`${process.env.API_TO_REDIRECT}${req.url}`, configAxios)
    .then( (response) => {
      res.send(response.data);
    }).catch((err)=>{
      res.status(500);
      res.send({error: "Internal Error"});
    });
  } catch (error) {
    res.status(500);
    res.send({error: "Internal Error"});
  }

});

app.post("*", function (req, res) {

  try {
    const payload =  JSON.parse(req.body || {});

    axios.post(`${process.env.API_TO_REDIRECT}${req.url}`,
    payload, configAxios)
    .then( (response) => {
      res.send(response.data);
    }).catch((err)=>{
      res.status(500);
      res.send({error: "Internal Error"});
    });
  } catch (error) {
    res.status(500);
    res.send({error: "Internal Error"});
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
