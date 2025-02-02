const send = require("../services/nodemailer");

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>template_email</title>
  </head>
  <body style="margin: 0px; display: block; background-color: #fbe2e2">
    <header>
      <div
        style="
          background-color: #ffffff;
          margin: 0px;
          margin-left: auto;
          margin-right: auto;
          display: block;
          box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
          height: fit-content;
        "
      >
        <img
          style="
            width: 20%;
            height: auto;
            margin-left: auto;
            margin-right: auto;
            display: block;
          "
          src="../assets/images/petala_logo.png"
          alt="foto da logo Petála"
        />
      </div>
    </header>
    <div
      style="
        background-color: #ffffff;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 50%;
        height: fit-content;
        border-radius: 32px;
        padding: 10px 20px;
      "
    >
      <div>
        <p style="margin: 0px; font-size: calc(1vw + 10px); text-indent: 7%">
          Bem-vindo ao Pétala! Ficamos felizes em tê-lo conosco! O Pétala é mais
          do que uma plataforma de estudos, é o seu espaço para crescer,
          aprender e alcançar seus objetivos.
        </p>
        <p style="margin: 0px; font-size: calc(1vw + 10px); text-indent: 7%">
          Aqui, acreditamos que cada passo na sua jornada de aprendizado é como
          uma pétala que desabrocha, revelando novos conhecimentos e
          possibilidades. Explore nossos conteúdos, aproveite os recursos e faça
          do seu aprendizado uma experiência única. Juntos, vamos florescer no
          caminho do conhecimento!
        </p>
        <div style="margin-left: auto; margin-right: auto; display: block">
          <button
            style="
              color: #fafafa;
              background-color: #1f1717;
              justify-content: center;
              align-items: center;
              margin-left: auto;
              margin-right: auto;
              box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
              border: 0px;
              border-radius: 20px;
              width: 40%;
              height: fit-content;
              font-size: calc(1vw + 8px);
              padding: 15px 0px;
              margin-top: 25px;
              margin-bottom: 25px;
              display: block;
            "
          >
            <a
              href="../index.html"
              style="
                background-color: transparent;
                color: white;
                text-decoration: none;
              "
              >ir para o site</a
            >
          </button>
        </div>
      </div>
    </div>
  </body>
</html>

`;

const sendEmail = async (req, res) => {
  const { to, subject, body} = req.body;
  send(to, subject, html);
  return res.status(200).json({ message: "Email enviado com sucesso!" });
};

module.exports = sendEmail;
