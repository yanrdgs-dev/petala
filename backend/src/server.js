const app = require("./app");

const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'petala.donotrespond@gmail.com',
    pass: 'petalaroot'
  }
})
const carregartemplate = (templatepath, substuicoes) => {
  let html = fs.readFileSync(templatepath, 'utf8');
  for (const [chave, valor] of Object.entries(substuicoes)) {
    html = html.replace(`{{${chave}}}`, valor);
  }
  return html;
}
app.post('/api/enviar-email', async (req, res) => {
  const { nome, email} = req.body;

  try{
    const templatepath = path.join(_dirname, 'frontend', 'templates', 'email_boas-vindas.html');
    const html = carregartemplate(templatepath, { nome })
  
    const mailOptions = {
      from: 'petala.donotrespond@gmail.com',
      to: email,
      subject: 'Bem vindo ao Pétala!',
      html: html,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('E-mail enviado com sucesso!');
  } catch (error) {
    res.status(500).send('Error ao enviar E-mail')
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});