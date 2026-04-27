var database = require("../database/config");
var { gerarHash } = require("../utils/senhaUtils.js");

async function buscarInstituicoes() {

    const instrucao = `
        SELECT 
            i.id_instituicao AS id,
            i.nome,
            COUNT(DISTINCT u.id_usuario) AS qtdPessoas,
            COUNT(DISTINCT IF(u.ativo = 1, u.id_usuario, NULL)) AS ativos
        FROM instituicao i
        LEFT JOIN curso c 
            ON c.id_instituicao = i.id_instituicao
        LEFT JOIN usuario u 
            ON u.id_usuario = c.id_administrador
            OR u.id_usuario = c.id_coordenador
            OR u.id_usuario = c.id_diretor
        GROUP BY i.id_instituicao, i.nome
        ORDER BY i.nome;
    `;

    return await database.executar(instrucao, []);
}

async function buscarPorId(id) {
    const instrucao = `
        SELECT 
            i.id_instituicao,
            i.nome AS instituicaoNome,
            u.id_usuario,
            u.nome AS nomePessoa,
            u.email AS emailPessoa,
            u.ativo AS usuarioAtivo,
            c.nome AS cargoNome
        FROM instituicao i
        LEFT JOIN curso cu 
            ON cu.id_instituicao = i.id_instituicao
        LEFT JOIN usuario u 
            ON u.id_usuario = cu.id_administrador
            OR u.id_usuario = cu.id_coordenador
            OR u.id_usuario = cu.id_diretor
        LEFT JOIN cargo c 
            ON c.id_cargo = u.id_cargo
        WHERE i.id_instituicao = ?
        GROUP BY u.id_usuario, u.nome, u.email, c.nome, i.id_instituicao, i.nome;
    `;

    return await database.executar(instrucao, [id]);
}

async function pesquisarInstituicoes(termo) {
    const instrucao = `
        SELECT 
            i.id_instituicao AS id,
            i.nome,
            COUNT(DISTINCT u.id_usuario) AS qtdPessoas,
            COUNT(DISTINCT IF(u.ativo = 1, u.id_usuario, NULL)) AS ativos
        FROM instituicao i
        LEFT JOIN curso c 
            ON c.id_instituicao = i.id_instituicao
        LEFT JOIN usuario u 
            ON u.id_usuario = c.id_usuario
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

async function buscarKPIs(idInstituicao) {
    const instrucao = `
        SELECT
            COUNT(u.id_usuario) AS totalPessoas,
            SUM(u.ativo = 1) AS totalAtivo,
            SUM(c.nome = 'diretor') AS totalDiretor
        FROM usuario u
        JOIN cargo c ON u.id_cargo = c.id_cargo
        LEFT JOIN curso cu ON (
            cu.id_administrador = u.id_usuario OR
            cu.id_diretor = u.id_usuario OR
            cu.id_coordenador = u.id_usuario
        )
        WHERE cu.id_instituicao = ?
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
    buscarKPIs
};