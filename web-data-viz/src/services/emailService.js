const provedorSMTP = require("../email");

await provedorSMTP.enviar({
    para: user.email,
    assunto: "Reset de senha",
    html: "<p>Link para reset...</p>"
});