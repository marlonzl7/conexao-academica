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

        List<String> keysInstituicao = List.of(
                "instituicao/2014/MICRODADOS_CADASTRO_IES_2014.xlsx",
                "instituicao/2015/MICRODADOS_CADASTRO_IES_2015.xlsx",
                "instituicao/2016/MICRODADOS_CADASTRO_IES_2016.xlsx",
                "instituicao/2017/MICRODADOS_CADASTRO_IES_2017.xlsx",
                "instituicao/2018/MICRODADOS_CADASTRO_IES_2018.xlsx",
                "instituicao/2019/MICRODADOS_CADASTRO_IES_2019.xlsx",
                "instituicao/2020/MICRODADOS_CADASTRO_IES_2020.xlsx",
                "instituicao/2021/MICRODADOS_ED_SUP_IES_2021.xlsx",
                "instituicao/2022/MICRODADOS_ED_SUP_IES_2022.xlsx",
                "instituicao/2023/MICRODADOS_ED_SUP_IES_2023.xlsx",
                "instituicao/2024/MICRODADOS_ED_SUP_IES_2024.xlsx"
        );

        List<String> keysCurso = List.of(
                "curso/2014/MICRODADOS_CADASTRO_CURSOS_2014.xlsx",
                "curso/2015/MICRODADOS_CADASTRO_CURSOS_2015.xlsx",
                "curso/2016/MICRODADOS_CADASTRO_CURSOS_2016.xlsx",
                "curso/2017/MICRODADOS_CADASTRO_CURSOS_2017.xlsx",
                "curso/2018/MICRODADOS_CADASTRO_CURSOS_2018.xlsx",
                "curso/2019/MICRODADOS_CADASTRO_CURSOS_2019.xlsx",
                "curso/2020/MICRODADOS_CADASTRO_CURSOS_2020.xlsx",
                "curso/2021/MICRODADOS_CADASTRO_CURSOS_2021.xlsx",
                "curso/2022/MICRODADOS_CADASTRO_CURSOS_2022.xlsx",
                "curso/2023/MICRODADOS_CADASTRO_CURSOS_2023.xlsx",
                "curso/2024/MICRODADOS_CADASTRO_CURSOS_2024.xlsx"
        );

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
