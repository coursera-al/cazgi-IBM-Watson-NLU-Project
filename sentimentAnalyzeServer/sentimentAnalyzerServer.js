const express = require('express');
const dotenv = require('dotenv');
const cors_app = require('cors');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

dotenv.config()

const app = new express();

app.use(express.static('client'))
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", async (req,res) => {
    const response = await getNLUInstance().analyze({
       url: req.query.url,
       features: {
           emotion: {
               document: true
           }
       }
    });
    return res.json(response.result.emotion.document.emotion);
});

app.get("/url/sentiment", async (req,res) => {
    const response = await getNLUInstance().analyze({
       url: req.query.url,
       features: {
           sentiment: {
               document: true
           }
       }
    });
    return res.send(response.result.sentiment.document.label);
});

app.get("/text/emotion", async (req,res) => {
    const response = await getNLUInstance().analyze({
       text: req.query.text,
       features: {
           emotion: {
               document: true
           }
       }
    });
    return res.json(response.result.emotion.document.emotion);
});

app.get("/text/sentiment", async (req,res) => {
    const response = await getNLUInstance().analyze({
       text: req.query.text,
       features: {
           sentiment: {
               document: true
           }
       }
    });
    return res.send(response.result.sentiment.document.label);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

function getNLUInstance () {
    return new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY
        }),
        serviceUrl: process.env.API_URL
    });
}