var database = require("../database/config");
var { gerarHash } = require("../utils/senhaUtils.js");

async function buscarInstituicoes() {

    const instrucao = `
        SELECT 
            i.id_instituicao,
            i.nome,
            COUNT(DISTINCT u.id_usuario) AS total_usuarios,
            COUNT(
                DISTINCT CASE 
                    WHEN u.ativo = 1 
                    THEN u.id_usuario 
                END
            ) AS usuarios_ativos
        FROM instituicao i
        LEFT JOIN usuario u 
            ON (
                u.id_instituicao = i.id_instituicao
                OR u.id_curso IN (
                    SELECT c.id_curso
                    FROM curso c
                    WHERE c.id_instituicao = i.id_instituicao
                )
            )
        GROUP BY i.id_instituicao, i.nome;
    `;

    return await database.executar(instrucao, []);
}

async function buscarPorId(id) {
    const instrucao = `
        SELECT
            i.id_instituicao AS id,
            i.nome AS nomeInstituicao,
            COUNT(DISTINCT u.id_usuario) AS total_usuarios,
            COUNT(
                DISTINCT CASE 
                WHEN u.ativo = 1 
                THEN u.id_usuario 
                END
            ) AS usuarios_ativos,
            u.id_usuario,
            u.nome AS nomePessoa,
            u.email AS emailPessoa,
            c.nome AS cargoNome,
            u.ativo AS usuarioAtivo
        FROM instituicao i
        LEFT JOIN usuario u 
            ON (
                u.id_instituicao = i.id_instituicao
            OR u.id_curso IN (
                SELECT cu.id_curso
                FROM curso cu
                WHERE cu.id_instituicao = i.id_instituicao
            )
            )
        LEFT JOIN cargo c
            ON c.id_cargo = u.id_cargo
        WHERE i.id_instituicao = ?
        GROUP BY 
        i.id_instituicao,
        i.nome,
        u.id_usuario,
        u.nome,
        u.email,
        c.nome,
        u.ativo;
    `;

    return await database.executar(instrucao, [id]);
}

async function pesquisarInstituicoes(termo) {
    const instrucao = `
        SELECT 
            i.id_instituicao AS id,
            i.nome,
            COUNT(DISTINCT u.id_usuario) AS total_usuarios,
            COUNT(
                DISTINCT CASE 
                    WHEN u.ativo = 1 
                    THEN u.id_usuario 
                END
            ) AS usuarios_ativos
        FROM instituicao i
        LEFT JOIN usuario u 
            ON u.id_instituicao = i.id_instituicao
        WHERE i.nome LIKE CONCAT('%', ?, '%')
        GROUP BY i.id_instituicao, i.nome
        ORDER BY i.nome;
    `;

    return await database.executar(instrucao, [termo]);
}

async function alterarStatusUsuario(idUsuario, ativo) {
    const instrucao = `
        UPDATE usuario
        SET ativo = ?
        WHERE id_usuario = ?;
    `;

    return await database.executar(instrucao, [ativo, idUsuario]);
}

async function cadastrarDiretor(idInstituicao, cpf, nome, email, senha, idUsuarioCriador = null) {
    const hashSenha = await gerarHash(senha);
    const instrucaoUsuario = `
        INSERT INTO usuario (id_cargo, id_instituicao, id_curso, id_usuario_criador, cpf, nome, email, senha, ativo)
        VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?);
    `;
    return await database.executar(instrucaoUsuario, [2, idInstituicao, idUsuarioCriador, cpf, nome, email, hashSenha, 1]);
}

async function cadastrarAdministrador(idInstituicao, cpf, nome, email, senha, idUsuarioCriador = null) {
    const hashSenha = await gerarHash(senha);

    const instrucaoUsuario = `
        INSERT INTO usuario (id_cargo, id_instituicao, id_curso, id_usuario_criador, cpf, nome, email, senha, ativo)
        VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?);
    `;
    return await database.executar(instrucaoUsuario, [4, idInstituicao, idUsuarioCriador, cpf, nome, email, hashSenha, 1]);
}

async function cadastrarCoordenador(id_curso, cpf, nome, email, senha) {
    const hashSenha = await gerarHash(senha);

    const instrucao = `
        INSERT INTO usuario (id_cargo, id_instituicao, id_curso, cpf, nome, email, senha, ativo) 
        VALUES (3, NULL, ?, ?, ?, ?, ?, 1);
    `;

    return await database.executar(instrucao, [id_curso, cpf, nome, email, hashSenha]);
}

async function listarCursos(idInstituicao) {
    const instrucao = `
        SELECT id_curso, id_instituicao, nome, modalidade FROM curso WHERE id_instituicao = ?;
    `

    return await database.executar(instrucao, [idInstituicao])
}

async function buscarKPIs(idInstituicao) {
    const instrucao = `
    SELECT
        COUNT(u.id_usuario) AS total_usuarios,
        COUNT(
            DISTINCT CASE 
                WHEN u.ativo = 1 
            THEN u.id_usuario 
        END
        ) AS usuarios_ativos,
        SUM(c.nome = 'diretor') AS total_diretores
    FROM usuario u
        INNER JOIN cargo c ON u.id_cargo = c.id_cargo
        LEFT JOIN instituicao i ON u.id_instituicao = i.id_instituicao
        LEFT JOIN curso cur ON u.id_curso = cur.id_curso
        LEFT JOIN instituicao i_curso ON cur.id_instituicao = i_curso.id_instituicao
    WHERE 
        i.id_instituicao = 1001      
        OR i_curso.id_instituicao = 1001; 
    `;

    const resultado = await database.executar(instrucao, [idInstituicao]);
    return resultado[0];
}

module.exports = {
    buscarInstituicoes,
    buscarPorId,
    pesquisarInstituicoes,
    alterarStatusUsuario,
    cadastrarDiretor,
    cadastrarAdministrador,
    cadastrarCoordenador,
    listarCursos,
    buscarKPIs
};