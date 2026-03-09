package academica.conexao.service;

import academica.conexao.logs.LogLevel;
import academica.conexao.logs.LogsManager;

public class ExtractService {

    public void extract() {
        LogsManager.log(LogLevel.INFO, this.getClass().getSimpleName(), "Extração dos dados iniciada");

        try {
            for (int i = 0; i < 1000; i++) {
                Thread.sleep(10);
                LogsManager.log(LogLevel.INFO, this.getClass().getSimpleName(), "Linha " + i + " extraída com sucesso");
            }

            Thread.sleep(1000);
            LogsManager.log(LogLevel.INFO, this.getClass().getSimpleName(), "Extração dos dados concluída com sucesso");
        } catch (InterruptedException e) {
            LogsManager.log(LogLevel.ERROR, this.getClass().getSimpleName(), "Falha na extração dos dados");
        }
    }

}
