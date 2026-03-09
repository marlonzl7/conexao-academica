package academica.conexao.logs;

public class LogsManager {

    public static void log(LogLevel level, String module, String message) {
        LogEntry entry = new LogEntry(level, module, message);

        String formatted = entry.format();

        System.out.println(formatted);
    }

}
