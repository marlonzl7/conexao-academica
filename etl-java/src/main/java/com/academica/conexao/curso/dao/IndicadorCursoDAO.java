package com.academica.conexao.curso.dao;

import com.academica.conexao.curso.model.IndicadorCurso;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class IndicadorCursoDAO {

    private PreparedStatement ps;

    public IndicadorCursoDAO(Connection connection) throws SQLException {
        String sql = "INSERT IGNORE INTO indicadores_curso (id_curso, ano, quantidade_matriculas, quantidade_alunos_situacao_desvinculada, quantidade_alunos_situacao_trancada) VALUES (?, ?, ?, ?, ?)";
        this.ps = connection.prepareStatement(sql);
    }

    public void addBatch(IndicadorCurso indicadorCurso) throws SQLException {
        ps.setInt(1, indicadorCurso.getIdCurso());
        ps.setInt(2, indicadorCurso.getAno());
        ps.setInt(3, indicadorCurso.getQtdMatriculas());
        ps.setInt(4, indicadorCurso.getQtdAlunosSituacaoDesvinculada());
        ps.setInt(5, indicadorCurso.getQtdAlunosSituacaoTrancada());

        ps.addBatch();
    }

    public void executeBatch() throws SQLException {
        ps.executeBatch();
        ps.clearBatch();
    }

    public void close() throws SQLException {
        if (this.ps != null) ps.close();
    }

}
