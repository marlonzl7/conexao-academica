package com.academica.conexao.instituicao.service;

import com.academica.conexao.infra.excel.LeitorExcelService;
import com.academica.conexao.infra.excel.LeitorUtils;
import com.academica.conexao.infra.log.LogsManager;
import com.academica.conexao.infra.s3.S3Service;
import com.academica.conexao.instituicao.dao.InstituicaoDAO;
import com.academica.conexao.instituicao.mapper.InstituicaoRowMapper;
import com.academica.conexao.instituicao.model.Instituicao;
import com.academica.conexao.instituicao.validator.InstituicaoValidator;
import com.academica.conexao.infra.pipeline.ETLPipeline;
import org.apache.poi.ss.usermodel.Row;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class InstituicaoETLPipeline extends ETLPipeline {

    private final List<String> bases;
    private final InstituicaoRowMapper mapper;
    private final InstituicaoValidator validator;
    private final InstituicaoDAO dao;

    public InstituicaoETLPipeline(
            S3Service s3Service,
            List<String> bases,
            LeitorExcelService leitor,
            Connection connection,
            LogsManager logsManager,
            InstituicaoDAO dao,
            int batchSize
    ) {
        super(s3Service, leitor, connection, logsManager, batchSize);
        this.bases = bases;
        this.mapper = new InstituicaoRowMapper(new LeitorUtils());
        this.validator = new InstituicaoValidator();
        this.dao = dao;
    }

    @Override
    protected void processarLinha(Row row) throws Exception {
        Instituicao instituicao = mapper.map(row);
        List<String> erros = validator.validate(instituicao);

        if (!erros.isEmpty()) {
            registrarErroLinha();
            return;
        }

        dao.addBatch(instituicao);
    }

    @Override
    protected void executeBatch() throws SQLException {
        dao.executeBatch();
    }

    @Override
    protected List<String> getBases() {
        return bases;
    }

    @Override
    protected void closeDAOs() throws SQLException {
        dao.close();
    }
}
