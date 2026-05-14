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

async function cadastrarAdministrador(idInstituicao, cpf, nome, email, senha) {
    const hashSenha = await gerarHash(senha); 
    
    const instrucaoUsuario = `
        INSERT INTO usuario (id_cargo, cpf, nome, email, senha, ativo) 
        VALUES (4, ?, ?, ?, ?, 1);
    `;
    const resultado = await database.executar(instrucaoUsuario, [cpf, nome, email, hashSenha]);
    const novoIdUsuario = resultado.insertId;

    const [{ proximoId }] = await database.executar(
        `SELECT COALESCE(MAX(id_curso), 0) + 1 AS proximoId FROM curso`
    );

    const instrucaoVinculo = `
        INSERT INTO curso (id_curso, id_instituicao, id_administrador, nome, modalidade) 
        VALUES (?, ?, ?, "Administração Institucional", "PRESENCIAL");
    `;
    return await database.executar(instrucaoVinculo, [proximoId, idInstituicao, novoIdUsuario]);
}

async function cadastrarCoordenador(idInstituicao, cpf, nome, email, senha) {
    const hashSenha = await gerarHash(senha); 
    
    const instrucaoUsuario = `
        INSERT INTO usuario (id_cargo, cpf, nome, email, senha, ativo) 
        VALUES (3, ?, ?, ?, ?, 1);
    `;
    const resultado = await database.executar(instrucaoUsuario, [cpf, nome, email, hashSenha]);
    const novoIdUsuario = resultado.insertId;

    const [{ proximoId }] = await database.executar(
        `SELECT COALESCE(MAX(id_curso), 0) + 1 AS proximoId FROM curso`
    );

    const instrucaoVinculo = `
        INSERT INTO curso (id_curso, id_instituicao, id_coordenador, nome, modalidade) 
        VALUES (?, ?, ?, "Coordenação", "PRESENCIAL");
    `;
    return await database.executar(instrucaoVinculo, [proximoId, idInstituicao, novoIdUsuario]);
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
        JOIN cargo c ON u.id_cargo = c.id_cargo
        LEFT JOIN instituicao i ON u.id_instituicao = i.id_instituicao
        WHERE i.id_instituicao = ?
    `;

    const resultado = await database.executar(instrucao, [idInstituicao]);
    return resultado[0];
}

module.exports = {
    buscarInstituicoes,
    buscarPorId,
    pesquisarInstituicoes,
    alterarStatusUsuario, 
    cadastrarAdministrador,
    cadastrarCoordenador,
    buscarKPIs
};