var database = require("../database/config");
var { gerarHash, compararSenhas } = require("../utils/senhaUtils");
const { obterIdPorNome } = require("./cargoModel");
var cargoModel = require("./cargoModel");

async function cadastrarUsuarioDiretor(id_instituicao, cpf, nome, email, senha) {
    if (await existeUsuarioPorEmail(email)) {
        throw "EMAIL_EXISTENTE";
    }

    if (await existeDiretorNaInstituicao(id_instituicao)) {
        throw "DIRETOR_EXISTENTE";
    }

    const hashSenha = gerarHash(senha);
    const resultado = await cargoModel.obterIdPorNome('diretor');
    const id_cargo = resultado[0].id_cargo

    const instrucao = `INSERT INTO usuario (id_instituicao, id_cargo, cpf, nome, email, senha) VALUES (?, ?, ?, ?, ?, ?)`;
    const parametros = [id_instituicao, id_cargo, cpf, nome, email, hashSenha];

    return database.executar(instrucao, parametros);
}

async function existeUsuarioPorEmail(email) {
    const instrucao = `SELECT 1 FROM usuario WHERE email = ?`;
    const resultado = await database.executar(instrucao, [email]);

    return resultado.length > 0;
}

async function existeDiretorNaInstituicao(id_instituicao) {
    const cargo = `diretor`;
    const instrucao = `
        SELECT 1
        FROM usuario u 
        JOIN cargo c ON u.id_cargo = c.id_cargo 
        WHERE c.nome = ? AND u.id_instituicao = ?;
    `;

    const parametros = [cargo, id_instituicao];
    const resultado = await database.executar(instrucao, parametros);

    console.log("Resultado" + resultado.length > 0);

    return resultado.length > 0;
}

module.exports = {
    cadastrarUsuarioDiretor
};