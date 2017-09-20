// smtp.js
const {SMTPServer} = require('smtp-server');
const { simpleParser } = require('mailparser');
const request = require('request');

function onError(err) {
    console.error("ERROR !");
    console.error(err);
}

const server = new SMTPServer({
    logger: true,

    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: ['AUTH', 'STARTTLS'],

    // By default only PLAIN and LOGIN are enabled
    authMethods: ['PLAIN', 'LOGIN', 'CRAM-MD5'],

    onRcptTo({ address }, session, callback) {

        if (-1 == address.indexOf('@pix.beta.gouv.fr')) {
            return callback(new Error('invalid RcpTo !'));
        }

        return callback();
    },

    onData(stream, session, callback){

        stream.on('error', onError);
        stream.on('end', callback);
        stream.pipe(process.stdout); // print message to console

        let mailPromised = simpleParser(stream);
        mailPromised.then((mail) => {

            console.log(mail);

            let headers = {};
            mail.headers.forEach((val, key) => headers[key] = val);

            return request.post('http://localhost:8080/email', {
                json: {
                    mail, headers
                }
            }).on('error', onError);
        }).catch(onError);
    },
});

server.listen(2525);
