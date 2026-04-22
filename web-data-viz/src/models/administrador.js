var database = require("../database/config");

async function buscarInstituicoes() {
    const instrucao = `
    SELECT 
    i.id_instituicao AS id, 
    i.nome,
    COUNT(DISTINCT u.id_usuario) AS qtdPessoas,
    COUNT(DISTINCT CASE WHEN u.ativo = 1 THEN u.id_usuario END) AS ativos
    FROM instituicao i
    LEFT JOIN curso c ON c.id_instituicao = i.id_instituicao
    LEFT JOIN usuario u ON u.id_usuario = c.id_diretor 
                       OR u.id_usuario = c.id_coordenador
    GROUP BY i.id_instituicao, i.nome
    ORDER BY i.nome;
    `;

    return await database.executar(instrucao);
}

module.exports = {
    buscarInstituicoes
};