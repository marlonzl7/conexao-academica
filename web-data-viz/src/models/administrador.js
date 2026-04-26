var database = require("../database/config");

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
    const instrucaoUsuario = `
        INSERT INTO usuario (id_cargo, cpf, nome, email, senha, ativo) 
        VALUES (1, ?, ?, ?, ?, 1);
    `;

    const resultado = await database.executar(instrucaoUsuario, [cpf, nome, email, senha]);

    const novoIdUsuario = resultado.insertId;

    const instrucaoVinculo = `
        INSERT INTO curso (id_instituicao, id_administrador, nome, modalidade) 
        VALUES (?, ?, "Administração Institucional", "PRESENCIAL");
    `;

    return await database.executar(instrucaoVinculo, [idInstituicao, novoIdUsuario]);
}

async function buscarKPIs(idInstituicao) {
    const instrucao = `
    SELECT
    (SELECT COUNT(DISTINCT u.id_usuario)
     FROM usuario u
     JOIN curso c 
       ON u.id_usuario = c.id_administrador 
       OR u.id_usuario = c.id_coordenador 
       OR u.id_usuario = c.id_diretor
     WHERE c.id_instituicao = ?) AS totalPessoas,

    (SELECT COUNT(DISTINCT u.id_usuario)
     FROM usuario u
     JOIN curso c 
       ON u.id_usuario = c.id_administrador 
       OR u.id_usuario = c.id_coordenador 
       OR u.id_usuario = c.id_diretor
     WHERE c.id_instituicao = ? AND u.ativo = 1) AS totalAtivo,

    (SELECT COUNT(DISTINCT u.id_usuario)
     FROM usuario u
     JOIN curso c 
       ON u.id_usuario = c.id_diretor
     WHERE c.id_instituicao = ?) AS totalDiretor;  
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