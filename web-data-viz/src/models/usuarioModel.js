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

// info da conta
async function buscarDadosConta(idUsuario) {
    const instrucao = `
        SELECT 
            u.nome,
            u.email,
            u.cpf,
            i.nome AS instituicao
        FROM usuario u
        JOIN instituicao i ON u.id_instituicao = i.id_instituicao
        WHERE u.id_usuario = ?;
    `;

    return database.executar(instrucao, [idUsuario]);
}

// info da conta - parte da senha 
async function atualizarSenha(idUsuario, senhaAtual, novaSenha) {
    const instrucao = `SELECT senha FROM usuario WHERE id_usuario = ?`;
    const resultado = await database.executar(instrucao, [idUsuario]);

    if (resultado.length === 0) {
        throw "USUARIO_NAO_ENCONTRADO";
    }

    const senhaBanco = resultado[0].senha;

    if (senhaAtual !== senhaBanco) {
        throw "SENHA_INVALIDA";
    }

    const update = `UPDATE usuario SET senha = ? WHERE id_usuario = ?`;
    return database.executar(update, [novaSenha, idUsuario]);
}

//info da conta - atualizar email e senha
async function atualizarDados(idUsuario, nome, email) {
    const instrucao = `
        UPDATE usuario 
        SET nome = ?, email = ?
        WHERE id_usuario = ?
    `;

    const parametros = [nome, email, idUsuario];

    return database.executar(instrucao, parametros);
}

module.exports = {
    cadastrarUsuarioDiretor,
    buscarDadosConta,
    atualizarSenha,
    atualizarDados
};