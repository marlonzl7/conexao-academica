package com.academica.conexao.infra.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private final String URL = System.getenv("ETL_DB_URL");
    private final String USER = System.getenv("ETL_DB_USER");
    private final String PASSWORD = System.getenv("ETL_DB_PASSWORD");

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

}
