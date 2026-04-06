const crypto = require("crypto");

async function gerarHash(senha) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(senha, salt, 64).toString("hex");
    
    return `${salt}:${hash}`;
}

async function compararSenhas(senhaDigitada, hashArmazenado) {
    const [salt, hashOriginal] = hashArmazenado.split(":");
    const hashSenhaDigitada = crypto.scryptSync(senhaDigitada, salt, 64).toString("hex");

    return hashSenhaDigitada === hashOriginal;
}

module.exports = {
    gerarHash,
    compararSenhas
};
