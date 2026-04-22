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
                        OR u.id_usuario = c.id_administrador
        GROUP BY i.id_instituicao, i.nome
        ORDER BY i.nome;
        `;

        return await database.executar(instrucao);
    }

    async function buscarPorId(id) {
        const instrucao = `
        SELECT DISTINCT
        i.nome AS instituicaoNome,
        u.id_usuario,
        u.nome AS nomePessoa,
        u.email AS emailPessoa,
        car.nome AS cargoNome
        FROM instituicao i
            JOIN usuario u ON u.id_cargo IN (
            SELECT id_cargo FROM cargo WHERE nome IN ('diretor', 'coordenador', 'administrador', 'administrador_instituicao')
            )
        JOIN cargo car ON u.id_cargo = car.id_cargo
        JOIN curso c ON (
        c.id_diretor = u.id_usuario OR 
        c.id_coordenador = u.id_usuario OR 
        c.id_administrador = u.id_usuario
        )
        WHERE i.id_instituicao = ? AND c.id_instituicao = i.id_instituicao
        GROUP BY u.id_usuario, u.nome, u.email, car.nome, i.nome;
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
        LEFT JOIN curso c ON c.id_instituicao = i.id_instituicao
        LEFT JOIN usuario u 
            ON u.id_usuario = c.id_diretor
            OR u.id_usuario = c.id_coordenador
            OR u.id_usuario = c.id_administrador
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