package com.academica.conexao.infra.pipeline;

import com.academica.conexao.infra.excel.LeitorExcelService;
import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;
import com.academica.conexao.infra.s3.S3Service;
import org.apache.poi.ss.usermodel.Row;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public abstract class ETLPipeline {

    protected final S3Service s3Service;
    protected final LeitorExcelService leitor;
    protected final Connection connection;
    protected final LogsManager logsManager;
    private final int batchSize;
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
                Path tmp = null;

                try {
                    connection.setAutoCommit(false);

                    try {
                        InputStream s3Stream = s3Service.abrirStream(base);
                        tmp = Files.createTempFile("etl-", ".xlsx");
                        Files.copy(s3Stream, tmp, StandardCopyOption.REPLACE_EXISTING);
                        s3Stream.close();
                        leitor.abrir(Files.newInputStream(tmp));
                    } catch (IOException e) {
                        logsManager.log(LogLevel.ERROR, getClass().getSimpleName(), "Erro ao abrir Stream. Pulando para próxima base. Erro: " + e.getMessage());
                        continue;
                    }

                    Row row;

                    while ((row = leitor.lerLinha()) != null) {
                        try {
                            processarLinha(row);
                            contador++;
                        } catch (Exception e) {
                            registrarErroLinha();
                            String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getName();
                            logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Linha " + (contador + 1) + " ignorada: " + msg);
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

                    try {
                        executeBatch();
                        connection.commit();
                    } catch (Exception e) {
                        connection.rollback();
                        logsManager.log(LogLevel.ERROR, getClass().getSimpleName(), "Lote " + contador / batchSize + " (Último) revertido (rollback): " + e.getMessage());
                    }

                    if (contadorErros > 0) {
                        logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Total de linhas inválidas: " + contadorErros);
                    }

                    logsManager.log(LogLevel.INFO, getClass().getSimpleName(), "Processo de ETL finalizado. Total de " + contador + " linhas processadas.");

                } catch (Exception e) {
                    logsManager.log(LogLevel.ERROR, getClass().getSimpleName(), "Falha crítica no ETL: " + e.getMessage());
                    e.printStackTrace();
                } finally {
                    try {
                        leitor.fechar();
                    } catch (Exception e) {
                        logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Erro ao fechar leitor excel: " + e.getMessage());
                    }

                    try {
                        if (tmp != null) Files.deleteIfExists(tmp);
                    } catch (Exception e) {
                        logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Erro ao deletar arquivo temporário: " + e.getMessage());
                    }
                }
            }
        } finally {
            try {
                closeDAOs();
            } catch (Exception e) {
                logsManager.log(LogLevel.WARN, getClass().getSimpleName(), "Erro ao fechar DAOs: " + e.getMessage());
            }
        }
    }

    protected void registrarErroLinha() {
        contadorErros++;
    }

    protected abstract void closeDAOs() throws SQLException;

    public long getTotalLinhasProcessadas() { return this.contador; }

}
