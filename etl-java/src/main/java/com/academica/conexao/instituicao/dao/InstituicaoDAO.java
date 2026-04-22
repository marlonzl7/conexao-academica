package com.academica.conexao.instituicao.dao;

import com.academica.conexao.instituicao.model.Instituicao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InstituicaoDAO {

    private PreparedStatement ps;

    public InstituicaoDAO(Connection connection) throws SQLException {
        String sql = "INSERT IGNORE INTO instituicao (id_instituicao, nome, uf) VALUES (?, ?, ?)";
        this.ps = connection.prepareStatement(sql);
    }

    public void addBatch(Instituicao instituicao) throws SQLException {
        ps.setInt(1, instituicao.getId());
        ps.setString(2, instituicao.getNome());
        ps.setString(3, instituicao.getUf());

        ps.addBatch();
    }

    public void executeBatch() throws SQLException {
        ps.executeBatch();
        ps.clearBatch();
    }

}
