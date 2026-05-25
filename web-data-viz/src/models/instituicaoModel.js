var database = require("../database/config");

async function listar() {
    const instrucao = `SELECT id_instituicao, nome FROM instituicao`;
    return await database.executar(instrucao);
}

async function buscar(busca) {
    const instrucao = `SELECT id_instituicao, nome FROM instituicao WHERE nome LIKE ?`;
    const parametro = "%" + busca + "%";
    return await database.executar(instrucao, parametro);
}

async function buscarIdPorIdCurso(idCurso) {
    const instrucao = `
        SELECT id_instituicao
        FROM curso
        WHERE id_curso = ?
    `;

    const resultado = await database.executar(instrucao, [idCurso]);

    if (resultado.length === 0) {
        return null;
    }

    return resultado[0].id_instituicao;
}

module.exports = {
    listar,
    buscar,
    buscarIdPorIdCurso
};