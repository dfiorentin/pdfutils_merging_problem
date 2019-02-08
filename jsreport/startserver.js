//Start file to create a token for communication with link and then start Jsreport

const DDP = require('ddp');
const login = require('ddp-login');
const cron = require('node-cron');
const jsreport = require('jsreport')();
const startupTimeout = 120000;

const linkhost = process.env.LINK_SERVICE || 'link';
const linkport = process.env.LINK_PORT || '8080';
const checktokenexp = process.env.TOKEN_CHECK || "0 */1 * * *";

console.log('Connection to: ' + linkhost + ' on port: ' + linkport);
console.log("Check token cron expression: " + checktokenexp);

let ddpClient = new DDP({ host: linkhost, port: linkport });
let createToken = function () {
    ddpClient.connect(function (err) {
        if (err) {
          console.log("error connecting to link for release token: "+linkhost+":"+linkport);
          ddpClient.close();
        }
        else {
            login(ddpClient,
                {  // Options below are the defaults
                    env: 'METEOR_TOKEN',  // Name of an environment variable to check for a
                    // token. If a token is found and is good,
                    // authentication will require no user interaction.
                    method: 'account',    // Login method: account, email, username or token
                    account: "linkprint", // Prompt for account info by default
                    pass: "linkprint",    // Prompt for password by default
                    retry: 1,             // Number of login attempts to make
                    plaintext: false      // Do not fallback to plaintext password compatibility
                    // for older non-bcrypt accounts
                },
                function (error, userInfo) {
                    if (error) {
                        // Something went wrong...
                        console.log('error releasing token')
                    } else {
                        // We are now logged in, with userInfo.token as our session auth token.
                        token = userInfo.token;
                        process.env.METEOR_TOKEN = token;
                        console.log('token released: ' + token)
                    }
                    ddpClient.close();
                }
            );
        }


    });
}

//wait for startup then check token
setTimeout(createToken,startupTimeout);

//schedule next token check
cron.schedule(checktokenexp, () => {
    console.log('check token validity');
    createToken();
});


//starts jsreport
jsreport.init(function () {
    // running
}).catch(function (e) {
    // error during startup
    console.error(e.stack)
    throw e
});
