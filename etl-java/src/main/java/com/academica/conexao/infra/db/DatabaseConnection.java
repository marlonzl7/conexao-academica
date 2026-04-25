package com.academica.conexao.infra.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL Driver não encontrado", e);
        }
    }

    private final String URL = System.getenv("ETL_DB_URL");
    private final String USER = System.getenv("ETL_DB_USER");
    private final String PASSWORD = System.getenv("ETL_DB_PASSWORD");

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

}
