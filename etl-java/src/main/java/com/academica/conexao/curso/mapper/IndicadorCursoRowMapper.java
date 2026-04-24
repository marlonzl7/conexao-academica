package com.academica.conexao.curso.mapper;

import com.academica.conexao.curso.model.IndicadorCurso;
import com.academica.conexao.infra.excel.LeitorUtils;
import org.apache.poi.ss.usermodel.Row;

public class IndicadorCursoRowMapper {

    private LeitorUtils leitorUtils;

    public IndicadorCursoRowMapper(LeitorUtils leitorUtils) {
        this.leitorUtils = leitorUtils;
    }

    public IndicadorCurso map(Row row) {
        IndicadorCurso indicadorCurso = new IndicadorCurso();

        indicadorCurso.setIdCurso(leitorUtils.getInt(row, 15));
        indicadorCurso.setAno(leitorUtils.getInt(row, 0));
        indicadorCurso.setQtdMatriculas(leitorUtils.getInt(row, 75));
        indicadorCurso.setQtdAlunosSituacaoTrancada(leitorUtils.getInt(row, 171));
        indicadorCurso.setQtdAlunosSituacaoDesvinculada(leitorUtils.getInt(row, 172));

        return indicadorCurso;
    }

}
