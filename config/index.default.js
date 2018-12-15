module.exports = {
  // 邮箱服务器配置
  mail: {
    host: "smtp.163.com",
    port: 465,
    secureConnection: true,
    auth: {
      user: "username@163.com",
      pass: "password"
    }
  },

  // 收件人的邮箱
  send: {
    to: 'mail'
  }
}