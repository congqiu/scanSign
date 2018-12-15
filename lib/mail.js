const nodemailer = require('nodemailer');
const moment = require('moment');
const config = require('../config');

const transporter = nodemailer.createTransport(config.mail);

function sendMailForHtml(title, text, attachments) {
	let options = {
		from: `"扫描登录👻" ${config.mail.auth.user}`,
		to: config.send.to,
		subject: `${moment().format('YYYY-MM-D')}` + title,
		html: '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' + text,
		attachments: attachments
	};

	transporter.sendMail(options, function(error) {
		if(error) {
			return console.log(error);
		}
	});
}


module.exports = {
	mailSender: sendMailForHtml
};