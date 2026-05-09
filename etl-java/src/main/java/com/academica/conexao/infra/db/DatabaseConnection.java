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

    public Connection getConnection() throws RuntimeException {
        int retries = 10;
        int delay = 1000;

        while (retries > 0) {
            try {
                return DriverManager.getConnection(URL, USER, PASSWORD);
            } catch (SQLException e) {
                System.out.println("Erro ao conectar: " + e.getMessage());

                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Thread interrompida", ie);
                }

                delay *= 2;
                retries--;
            }
        }

        throw new RuntimeException("Não foi possível conectar ao banco após várias tentativas");
    }

}
