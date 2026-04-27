var database = require("../database/config");
var { gerarHash, compararSenhas } = require("../utils/senhaUtils");
var cargoModel = require("./cargoModel");

async function login(email, senha) {
    const instrucao = `
    SELECT
        u.id_usuario,
        c.nome as cargo,
        u.nome,
        u.email,
        u.senha,
        u.ativo,
        i.id_instituicao    
    FROM usuario u
    JOIN cargo c ON u.id_cargo = c.id_cargo
    LEFT JOIN curso cu ON (
        cu.id_administrador = u.id_usuario OR 
        cu.id_diretor       = u.id_usuario OR 
        cu.id_coordenador   = u.id_usuario      
    )
    LEFT JOIN instituicao i ON i.id_instituicao = cu.id_instituicao
    WHERE u.email = ?
    LIMIT 1
    `
    ;

    const parametros = [email];
    const resultado = await database.executar(instrucao, parametros);

    const usuario = resultado[0];

    const hashFake = "abc:abc";

    const hashParaComparar = usuario ? usuario.senha : hashFake;

    const senhaValida = await compararSenhas(senha, hashParaComparar);
    
    if (!usuario || !senhaValida) {
        throw "CREDENCIAIS_INVALIDAS";
    }
    
    if (!usuario.ativo) {
        throw "USUARIO_INATIVO";
    }
    
    delete usuario.senha;
    delete usuario.ativo;

    return usuario;
}

async function cadastrarUsuarioDiretor(id_instituicao, cpf, nome, email, senha) {
    if (await existeUsuarioPorEmail(email)) {
        throw "EMAIL_EXISTENTE";
    }

    if (await existeDiretorNaInstituicao(id_instituicao)) {
        throw "DIRETOR_EXISTENTE";
    }

    const hashSenha = await gerarHash(senha);

    const resultadoCargo = await cargoModel.obterIdPorNome('diretor');
    const id_cargo = resultadoCargo[0].id_cargo

    const instrucao = `INSERT INTO usuario (id_cargo, cpf, nome, email, senha) VALUES (?, ?, ?, ?, ?)`;
    const parametros = [id_cargo, cpf, nome, email, hashSenha];

    const resultado = await database.executar(instrucao, parametros);

    const id_usuario = resultado.insertId;

    await atualizarDiretorCursos(id_usuario, id_instituicao)

    return resultado;
}

async function atualizarDiretorCursos(id_diretor, id_instituicao) {
    const instrucao = `
        UPDATE curso
        SET id_diretor = ?
        WHERE id_instituicao = ?;
    `;

    const parametros = [id_diretor, id_instituicao];

    return await database.executar(instrucao, parametros);
}

async function existeUsuarioPorEmail(email) {
    const instrucao = `SELECT 1 FROM usuario WHERE email = ?`;
    const resultado = await database.executar(instrucao, [email]);

    return resultado.length > 0;
}

async function existeDiretorNaInstituicao(id_instituicao) {
    const instrucao = `
        SELECT 1
        FROM curso
        WHERE id_instituicao = ?
        AND id_diretor IS NOT NULL
        LIMIT 1;
    `;

    const resultado = await database.executar(instrucao, [id_instituicao]);

    console.log("Resultado:", resultado.length > 0);

    return resultado.length > 0;
}

// info da conta
async function buscarDadosConta(idUsuario) {
    const instrucao = `
        SELECT 
            u.nome, 
            u.email, 
            u.cpf, 
            i.nome as instituicao
        FROM usuario u
        LEFT JOIN curso c ON c.id_diretor = u.id_usuario
        LEFT JOIN instituicao i ON i.id_instituicao = c.id_instituicao
        WHERE u.id_usuario = ?
        LIMIT 1;
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

    const senhaValida = await compararSenhas(senhaAtual, senhaBanco);

    if (!senhaValida) {
        throw "SENHA_INVALIDA";
    }

    const hashNovaSenha = await gerarHash(novaSenha);
    const update = `UPDATE usuario SET senha = ? WHERE id_usuario = ?`;
    return database.executar(update, [hashNovaSenha, idUsuario]);
}

//info da conta - atualizar email e senha
async function atualizarDados(idUsuario, nome, email) {
    const instrucao = `
        UPDATE usuario 
        SET nome = ?, email = ? 
        WHERE id_usuario = ?
    `;
    return database.executar(instrucao, [nome, email, idUsuario]);
}

async function deletarUsuario(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL PARA DELETAR ID: ", idUsuario);
        
    const instrucao = `
        DELETE FROM usuario WHERE id_usuario = ?;
    `;

    return database.executar(instrucao, [idUsuario]);
}

module.exports = {
    cadastrarUsuarioDiretor,
    buscarDadosConta,
    atualizarSenha,
    atualizarDados,
    login,
    deletarUsuario 
}