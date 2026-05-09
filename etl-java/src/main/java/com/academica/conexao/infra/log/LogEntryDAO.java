package com.academica.conexao.infra.log;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

public class LogEntryDAO {

    private final Connection connection;

    public LogEntryDAO(Connection connection) {
        this.connection = connection;
    }

    public void insert(LogEntry logEntry) throws SQLException {
        String sql = "INSERT INTO log (mensagem, tipo, modulo, data_hora) VALUES (?, ?, ?, ?)";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, logEntry.getMessage());
            ps.setString(2, logEntry.getLevel().toString());
            ps.setString(3, logEntry.getModule());
            ps.setTimestamp(4, Timestamp.valueOf(logEntry.getTimestamp()));

            ps.execute();
        }

    }

}
