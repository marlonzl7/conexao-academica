package com.academica.conexao.infra.log;

import java.sql.Connection;

public class LogsManager {

    private Connection connection;
    private LogEntryDAO logEntryDAO;

    public LogsManager(Connection connection, LogEntryDAO logEntryDAO) {
        this.connection = connection;
        this.logEntryDAO = logEntryDAO;
    }

    public void log(LogLevel level, String module, String message) {
        LogEntry entry = new LogEntry(level, module, message);

        String formatted = entry.format();

        System.out.println(formatted);

        try {
            logEntryDAO.insert(entry);
        } catch (Exception e) {
            LogEntry error = new LogEntry(LogLevel.ERROR, this.getClass().getSimpleName(), "Não foi possível inserir log no banco de dados");
            e.printStackTrace();
        }
    }

}
