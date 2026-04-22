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
            ON u.id_usuario = c.id_diretor 
            OR u.id_usuario = c.id_coordenador
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
            c.nome AS cargoNome
        FROM instituicao i
        LEFT JOIN curso cu 
            ON cu.id_instituicao = i.id_instituicao
        LEFT JOIN usuario u 
            ON u.id_usuario = cu.id_diretor 
            OR u.id_usuario = cu.id_coordenador
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
            ON u.id_usuario = c.id_diretor 
            OR u.id_usuario = c.id_coordenador
        WHERE i.nome LIKE CONCAT('%', ?, '%')
        GROUP BY i.id_instituicao, i.nome
        ORDER BY i.nome;
    `;

    return await database.executar(instrucao, [termo]);
}

module.exports = {
    buscarInstituicoes,
    buscarPorId,
    pesquisarInstituicoes
};