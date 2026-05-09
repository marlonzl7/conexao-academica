package com.academica.conexao.curso.service;

import com.academica.conexao.curso.dao.CursoDAO;
import com.academica.conexao.curso.dao.IndicadorCursoDAO;
import com.academica.conexao.curso.mapper.CursoRowMapper;
import com.academica.conexao.curso.mapper.IndicadorCursoRowMapper;
import com.academica.conexao.curso.model.Curso;
import com.academica.conexao.curso.model.IndicadorCurso;
import com.academica.conexao.curso.validator.CursoValidator;
import com.academica.conexao.curso.validator.IndicadorCursoValidator;
import com.academica.conexao.infra.excel.LeitorExcelService;
import com.academica.conexao.infra.excel.LeitorUtils;
import com.academica.conexao.infra.log.LogsManager;
import com.academica.conexao.infra.pipeline.ETLPipeline;
import com.academica.conexao.infra.s3.S3Service;
import org.apache.poi.ss.usermodel.Row;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class CursoETLPipeline extends ETLPipeline {

    private final List<String> bases;
    private final CursoRowMapper cursoMapper;
    private final IndicadorCursoRowMapper indicadorMapper;
    private final CursoValidator cursoValidator;
    private final IndicadorCursoValidator indicadorValidator;
    private final CursoDAO cursoDAO;
    private final IndicadorCursoDAO indicadorCursoDAO;

    public CursoETLPipeline(
            S3Service s3Service,
            List<String> bases,
            LeitorExcelService leitor,
            Connection connection,
            LogsManager logsManager,
            CursoDAO cursoDAO,
            IndicadorCursoDAO indicadorCursoDAO,
            int batchSize
    ) {
        super(s3Service, leitor, connection, logsManager, batchSize);
        this.bases = bases;
        this.cursoMapper = new CursoRowMapper(new LeitorUtils());
        this.indicadorMapper = new IndicadorCursoRowMapper(new LeitorUtils());
        this.cursoValidator = new CursoValidator();
        this.indicadorValidator = new IndicadorCursoValidator();
        this.cursoDAO = cursoDAO;
        this.indicadorCursoDAO = indicadorCursoDAO;
    }

    @Override
    protected List<String> getBases() {
        return bases;
    }

    @Override
    protected void processarLinha(Row row) throws Exception {
        Curso curso = cursoMapper.map(row);
        IndicadorCurso indicadorCurso = indicadorMapper.map(row);
        List<String> errosCurso = cursoValidator.validate(curso);
        List<String> errosIndicadorCurso = indicadorValidator.validate(indicadorCurso);

        if (!errosCurso.isEmpty() || !errosIndicadorCurso.isEmpty()) {
            registrarErroLinha();
            return;
        }

        cursoDAO.addBatch(curso);
        indicadorCursoDAO.addBatch(indicadorCurso);
    }

    @Override
    protected void executeBatch() throws SQLException {
        cursoDAO.executeBatch();
        indicadorCursoDAO.executeBatch();
    }

    @Override
    protected void closeDAOs() throws SQLException {
        cursoDAO.close();
        indicadorCursoDAO.close();
    }
}
