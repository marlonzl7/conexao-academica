package com.academica.conexao.instituicao.mapper;

import com.academica.conexao.infra.excel.LeitorUtils;
import com.academica.conexao.instituicao.model.Instituicao;
import org.apache.poi.ss.usermodel.Row;

public class InstituicaoRowMapper {

    private LeitorUtils leitorUtils;

    public InstituicaoRowMapper(LeitorUtils leitorUtils) {
        this.leitorUtils = leitorUtils;
    }

    public Instituicao map(Row row) {
        Instituicao instituicao = new Instituicao();

        instituicao.setId(leitorUtils.getInt(row, 17));
        instituicao.setNome(leitorUtils.getString(row, 18));
        instituicao.setUf(leitorUtils.getString(row, 4));

        return instituicao;
    }

}
