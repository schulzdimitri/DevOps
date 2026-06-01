const nodemailer = require('nodemailer');

const destinatario = process.env.EMAIL_DESTINO;
const remetente = process.env.EMAIL_REMETENTE;
const senha = process.env.EMAIL_SENHA;

if (!destinatario || !remetente || !senha) {
    console.error("❌ ERRO: Variáveis de ambiente do e-mail não configuradas no Jenkins.");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: remetente,
        pass: senha
    }
});

const mailOptions = {
    from: remetente,
    to: destinatario,
    subject: '🚀 Relatório de Pipeline: API PetStore - Grupo 02',
    text: `Olá!

O Jenkins finalizou a execução do pipeline de testes automatizados da API PetStore (S07).

O código foi baixado, as dependências instaladas e os testes do Newman rodaram com sucesso.
Por favor, acesse o painel de execução do Jenkins para baixar os artefatos gerados (Relatório HTML e Manifesto do Projeto).

Atenciosamente,
Equipe de Automação - Grupo 02`
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.error("❌ Erro ao enviar e-mail:", error);
        process.exit(1);
    } else {
        console.log('✅ E-mail enviado com sucesso: ' + info.response);
    }
});