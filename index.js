
const express = require("express");
const msal = require('@azure/msal-node');

const SERVER_PORT = process.env.PORT || 5000;
const REDIRECT_URI = "http://localhost:3000/register";

// Before running the sample, you will need to replace the values in the config, 
// including the clientSecret
const config = {
    auth: {
        clientId: "3bfebebe-9bb6-4757-adef-04f4ebc10efc",
        authority: "https://login.microsoftonline.com/7653af48-8d24-4c43-bbaa-b8547139c0f5",
        clientSecret: "17y8Q~l8Wlvv3FwUIg-4rARVBK1eHH0OTMRrKaE4"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const pca = new msal.ConfidentialClientApplication(config);

// Create Express App and Routes
const app = express();

app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "https://aravinth1207.github.io/register",
    };

    // get url to sign user in and consent to scopes needed for application
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/register', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };

    // get url to sign user in and consent to scopes needed for application
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };

    // pca.acquireTokenByCode(tokenRequest).then((response) => {
    //     console.log("\nResponse: \n:", response);
    //     res.sendStatus(200);
    // }).catch((error) => {
    //     console.log(error);
    //     res.status(500).send(error);
    // });

});


app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))
