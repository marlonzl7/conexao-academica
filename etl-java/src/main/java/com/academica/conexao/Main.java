package com.academica.conexao;

import com.academica.conexao.curso.dao.CursoDAO;
import com.academica.conexao.curso.dao.IndicadorCursoDAO;
import com.academica.conexao.curso.service.CursoETLPipeline;
import com.academica.conexao.infra.db.DatabaseConnection;
import com.academica.conexao.infra.dto.ResultadoETL;
import com.academica.conexao.infra.email.dao.UsuarioNotificacaoDAO;
import com.academica.conexao.infra.email.service.EmailService;
import com.academica.conexao.infra.email.service.NotificacaoETLService;
import com.academica.conexao.infra.excel.LeitorExcelService;
import com.academica.conexao.infra.log.LogEntryDAO;
import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;
import com.academica.conexao.infra.s3.S3Provider;
import com.academica.conexao.infra.s3.S3Service;
import com.academica.conexao.instituicao.dao.InstituicaoDAO;
import com.academica.conexao.instituicao.service.InstituicaoETLPipeline;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) throws SQLException {

        long inicio = System.nanoTime();

        Connection connection = new DatabaseConnection().getConnection();
        Connection connectionLogs = new DatabaseConnection().getConnection();
        LogsManager logsManager = new LogsManager(new LogEntryDAO(connectionLogs));

        try {
            logsManager.log(LogLevel.INFO, "Main", "Iniciando ETL");

            String bucket = System.getenv("BUCKET_NAME");
            String varInstituicoes = System.getenv("BASES_INSTITUICAO");
            String varCursos = System.getenv("BASES_CURSO");

            if (bucket == null || varInstituicoes == null || varCursos == null) {
                String msg = "Variáveis de ambiente inválidas: BUCKET_NAME / BASES_INSTITUICAO / BASES_CURSO";

                logsManager.log(LogLevel.ERROR, "Main", msg);

                throw new IllegalStateException(msg);
            }

            Path pathInstituicao = Path.of(varInstituicoes);
            Path pathCurso = Path.of(varCursos);

            if (!Files.exists(pathInstituicao) || !Files.exists(pathCurso)) {
                String msg = "Arquivo(s) de base não encontrado(s): " +
                        pathInstituicao + " | " + pathCurso;

                logsManager.log(LogLevel.ERROR, "Main", msg);

                throw new IllegalStateException(msg);
            }

            if (!Files.isReadable(pathInstituicao) || !Files.isReadable(pathCurso)) {
                String msg = "Arquivo(s) de base não podem ser lidos: " +
                        pathInstituicao + " | " + pathCurso;

                logsManager.log(LogLevel.ERROR, "Main", msg);

                throw new IllegalStateException(msg);
            }

            List<String> keysInstituicao;
            List<String> keysCurso;

            try {
                keysInstituicao = Files.readAllLines(pathInstituicao);
                keysCurso = Files.readAllLines(pathCurso);
            } catch (IOException e) {
                logsManager.log(LogLevel.ERROR, "Main",
                        "Erro ao ler arquivos de base");

                throw new RuntimeException("Falha ao ler arquivos de base", e);
            }

            logsManager.log(LogLevel.INFO, "Main",
                    "Bases carregadas com sucesso");

            S3Service s3Service = new S3Service(
                    new S3Provider().getS3Client(),
                    bucket
            );

            int rowCacheSize = Integer.parseInt(System.getenv().getOrDefault("ETL_ROW_CACHE_SIZE", "100"));
            int batchSize = Integer.parseInt(System.getenv().getOrDefault("ETL_BATCH_SIZE", "3000"));

            LeitorExcelService leitor = new LeitorExcelService(rowCacheSize);

            ETLOrchestrator orchestrator = new ETLOrchestrator(
                    List.of(
                            new InstituicaoETLPipeline(
                                    s3Service,
                                    keysInstituicao,
                                    leitor,
                                    connection,
                                    logsManager,
                                    new InstituicaoDAO(connection),
                                    batchSize
                            ),
                            new CursoETLPipeline(
                                    s3Service,
                                    keysCurso,
                                    leitor,
                                    connection,
                                    logsManager,
                                    new CursoDAO(connection),
                                    new IndicadorCursoDAO(connection),
                                    batchSize
                            )
                    )
            );

            orchestrator.executar();

            double duracaoSeg = (System.nanoTime() - inicio) / 1_000_000_000.0;

            List<String> todasAsBases = new ArrayList<>();
            todasAsBases.addAll(keysInstituicao);
            todasAsBases.addAll(keysCurso);

            ResultadoETL resultado = new ResultadoETL(todasAsBases, duracaoSeg);

            logsManager.log(LogLevel.INFO, "Main",
                    String.format("ETL finalizado em %.2fs", duracaoSeg));

            NotificacaoETLService notificacaoService = new NotificacaoETLService(
                    new EmailService(logsManager),
                    new UsuarioNotificacaoDAO(connection, logsManager),
                    logsManager
            );

            notificacaoService.notificar(resultado);

            logsManager.log(LogLevel.INFO, "Main",
                    "Notificação enviada com sucesso");
        } catch (Exception e) {

            logsManager.log(LogLevel.ERROR, "Main",
                    "Falha geral na execução do ETL");

            throw e;
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                logsManager.log(LogLevel.ERROR, "Main", "Erro ao fechar conexão ETL");
            }

            try {
                connectionLogs.close();
            } catch (SQLException e) {
                System.err.println("Erro ao fechar conexão de logs");
            }
        }
    }

}
