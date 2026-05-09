package com.academica.conexao.infra.log;

public class LogsManager {

    private final LogEntryDAO logEntryDAO;

    public LogsManager(LogEntryDAO logEntryDAO) {
        this.logEntryDAO = logEntryDAO;
    }

    public void log(LogLevel level, String module, String message) {
        LogEntry entry = new LogEntry(level, module, message);

        String formatted = entry.format();

        System.out.println(formatted);

        try {
            logEntryDAO.insert(entry);
        } catch (Exception e) {
            System.out.println(new LogEntry(LogLevel.ERROR, this.getClass().getSimpleName(), "Não foi possível inserir log no banco de dados"));
            e.printStackTrace();
        }
    }

}
