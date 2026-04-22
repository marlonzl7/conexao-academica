package com.academica.conexao.curso.dao;

import com.academica.conexao.curso.model.Curso;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class CursoDAO {

    private PreparedStatement ps;

    public CursoDAO(Connection connection) throws SQLException {
        String sql = "INSERT IGNORE INTO curso (id_curso, id_instituicao, nome, modalidade) VALUES (?, ?, ?, ?)";
        this.ps = connection.prepareStatement(sql);
    }

    public void addBatch(Curso curso) throws SQLException {
        ps.setInt(1, curso.getId());
        ps.setInt(2, curso.getIdInstituicao());
        ps.setString(3, curso.getNome());
        ps.setString(4, curso.getModalidade().toString());

        ps.addBatch();
    }

    public void executeBatch() throws SQLException {
        ps.executeBatch();
        ps.clearBatch();
    }

}
