package academica.conexao.logs;

import java.time.LocalDateTime;

public class LogEntry {
    private LocalDateTime timestamp;
    private LogLevel level;
    private String module;
    private String message;

    public LogEntry(LogLevel level, String module, String message) {
        this.timestamp = LocalDateTime.now();
        this.level = level;
        this.module = module;
        this.message = message;
    }

    public String format() {
        return timestamp + " | " + level + " | " + module + " | " + message;
    }
}
