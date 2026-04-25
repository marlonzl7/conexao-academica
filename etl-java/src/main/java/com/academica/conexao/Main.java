package com.academica.conexao;

import com.academica.conexao.curso.dao.CursoDAO;
import com.academica.conexao.curso.dao.IndicadorCursoDAO;
import com.academica.conexao.curso.service.CursoETLPipeline;
import com.academica.conexao.infra.db.DatabaseConnection;
import com.academica.conexao.infra.excel.LeitorExcelService;
import com.academica.conexao.infra.log.LogEntryDAO;
import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;
import com.academica.conexao.infra.s3.S3Provider;
import com.academica.conexao.infra.s3.S3Service;
import com.academica.conexao.instituicao.dao.InstituicaoDAO;
import com.academica.conexao.instituicao.service.InstituicaoETLPipeline;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class Main {

    public static void main(String[] args) throws SQLException {
        long inicio = System.nanoTime();

        S3Service s3Service = new S3Service(new S3Provider().getS3Client(), System.getenv("BUCKET_NAME"));

        List<String> todasKeys = s3Service.listarKeys();
        List<String> keysInstituicao = s3Service.filtrarKeys(todasKeys, "CADASTRO_IES");
        List<String> keysCurso = s3Service.filtrarKeys(todasKeys, "CADASTRO_CURSO");

        Connection connection = new DatabaseConnection().getConnection();
        LogsManager logsManager = new LogsManager(connection, new LogEntryDAO(connection));
        LeitorExcelService leitor = new LeitorExcelService(100);

        ETLOrchestrator orchestrator = new ETLOrchestrator(
                List.of(
                        new InstituicaoETLPipeline(s3Service, keysInstituicao, leitor, connection, logsManager, new InstituicaoDAO(connection), 3000),
                        new CursoETLPipeline(s3Service, keysCurso, leitor, connection, logsManager, new CursoDAO(connection), new IndicadorCursoDAO(connection), 3000)
                )
        );

        orchestrator.executar();

        double duracaoSeg = (System.nanoTime() - inicio) / 1_000_000_000.0;
        logsManager.log(LogLevel.INFO, "Main", String.format("ETL finalizado em %.2fs", duracaoSeg));
    }

}
