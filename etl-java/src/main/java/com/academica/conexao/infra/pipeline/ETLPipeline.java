package com.academica.conexao.infra.pipeline;

import com.academica.conexao.infra.excel.LeitorExcelService;
import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;
import com.academica.conexao.infra.s3.S3Service;
import org.apache.poi.ss.usermodel.Row;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public abstract class ETLPipeline {

    protected final S3Service s3Service;
    protected final LeitorExcelService leitor;
    protected final Connection connection;
    protected final LogsManager logsManager;
    private int batchSize;
    private int contador;
    private int contadorErros;

    protected ETLPipeline(
            S3Service s3Service,
            LeitorExcelService leitor,
            Connection connection,
            LogsManager logsManager,
            int batchSize
    ) {
        this.s3Service = s3Service;
        this.leitor = leitor;
        this.connection = connection;
        this.logsManager = logsManager;
        this.batchSize = batchSize;
    }

    protected abstract List<String> getBases();

    protected abstract void processarLinha(Row row) throws Exception;

    protected abstract void executeBatch() throws SQLException;

    public final void executar() {
        try {
            for (String base : getBases()) {
                logsManager.log(LogLevel.INFO, getClass().getSimpleName(), "Iniciando processo de ETL para base: " + base);
                contador = 0;
                contadorErros = 0;

                try {
                    connection.setAutoCommit(false);

                    InputStream is = s3Service.abrirStream(base);
                    leitor.abrir(is);

                    Row row;

                    while ((row = leitor.lerLinha()) != null) {
                        try {
                            processarLinha(row);
                            contador++;
                        } catch (Exception e) {
                            registrarErroLinha();
                            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getName();
                            logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Linha " + contador + " ignorada: " + msg);
                        }

                        if (contador > 0 && contador % batchSize == 0) {
                            try {
                                executeBatch();
                                connection.commit();
                                logsManager.log(LogLevel.INFO, getClass().getSimpleName(), "Lote " + contador / batchSize + " inserido no banco");
                            } catch (Exception e) {
                                connection.rollback();
                                logsManager.log(LogLevel.ERROR, getClass().getSimpleName(), "Lote " + contador / batchSize + " revertido (rollback): " + e.getMessage());
                            }
                        }
                    }

                    executeBatch();
                    connection.commit();

                    if (contadorErros > 0) {
                        logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Total de linhas inválidas: " + contadorErros);
                    }

                    logsManager.log(LogLevel.INFO, getClass().getSimpleName(), "Processo de ETL finalizado. Total de " + contador + " linhas processadas.");

                } catch (Exception e) {
                    logsManager.log(LogLevel.ERROR, getClass().getSimpleName(), "Falha crítica no ETL: " + e.getMessage());
                    e.printStackTrace();
                } finally {
                    try { leitor.fechar(); } catch (Exception ignored) {}
                }
            }
        } finally {
            try { closeDAOs(); } catch (Exception ignored) {}
        }
    }

    protected void registrarErroLinha() {
        contadorErros++;
    }

    protected abstract void closeDAOs() throws SQLException;

    public long getTotalLinhasProcessadas() { return this.contador; }

}
