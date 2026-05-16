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

        S3Service s3Service = new S3Service(new S3Provider().getS3Client(), System.getenv("BUCKET_NAME"));

        List<String> keysInstituicao;
        List<String> keysCurso;

        try {
            String pathInstituicao = System.getenv("BASES_INSTITUICAO");
            String pathCurso = System.getenv("BASES_CURSO");

            if (pathInstituicao == null || pathCurso == null) {
                System.out.println("Variáveis de ambiente BASES_INSTITUICAO e BASES_CURSO não definidas");
                return;
            }

            keysInstituicao = Files.readAllLines(Path.of(pathInstituicao));
            keysCurso = Files.readAllLines(Path.of(pathCurso));
        } catch (IOException e) {
            System.out.println("Erro ao ler arquivos de bases: " + e.getMessage());
            return;
        }

        Connection connection = new DatabaseConnection().getConnection();
        LogsManager logsManager = new LogsManager(new LogEntryDAO(connection));
        LeitorExcelService leitor = new LeitorExcelService(100);

        ETLOrchestrator orchestrator = new ETLOrchestrator(
                List.of(
                        new InstituicaoETLPipeline(s3Service, keysInstituicao, leitor, connection, logsManager, new InstituicaoDAO(connection), 3000),
                        new CursoETLPipeline(s3Service, keysCurso, leitor, connection, logsManager, new CursoDAO(connection), new IndicadorCursoDAO(connection), 3000)
                )
        );

        orchestrator.executar();

        Double duracaoSeg = (System.nanoTime() - inicio) / 1_000_000_000.0;

        List<String> todasAsBases = new ArrayList<>();
        todasAsBases.addAll(keysInstituicao);
        todasAsBases.addAll(keysCurso);

        ResultadoETL resultado = new ResultadoETL(todasAsBases, duracaoSeg);

        NotificacaoETLService notificacaoService = new NotificacaoETLService(
                new EmailService(logsManager),
                new UsuarioNotificacaoDAO(connection, logsManager),
                logsManager
        );

        notificacaoService.notificar(resultado);

        logsManager.log(LogLevel.INFO, "Main", String.format("ETL finalizado em %.2fs", duracaoSeg));
    }

}
