package com.academica.conexao.infra.email.dao;

import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UsuarioNotificacaoDAO {

    private final Connection connection;
    private final LogsManager logs;

    public UsuarioNotificacaoDAO(Connection connection, LogsManager logs) {
        this.connection = connection;
        this.logs = logs;
    }

    public List<String> buscarEmailPorCargo(String cargo) {
        List<String> emails = new ArrayList<>();

        if (cargo == null || cargo.isBlank()) {
            logs.log(LogLevel.ERROR, getClass().getSimpleName(), "Erro: Cargo buscado está nulo");
            return emails;
        }

        String sql = "SELECT u.email FROM usuario u JOIN cargo c ON u.id_cargo = c.id_cargo WHERE c.nome = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, cargo);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                emails.add(rs.getString("email"));
            }

            return emails;
        } catch (SQLException e) {
            logs.log(LogLevel.ERROR, getClass().getSimpleName(), "Erro ao buscar emails por cargo. Erro: " + e.getMessage());
            return emails;
        }
    }

}
