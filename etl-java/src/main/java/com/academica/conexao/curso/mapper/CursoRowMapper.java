package com.academica.conexao.curso.mapper;

import com.academica.conexao.curso.enums.Modalidade;
import com.academica.conexao.curso.model.Curso;
import com.academica.conexao.infra.excel.LeitorUtils;
import org.apache.poi.ss.usermodel.Row;

public class CursoRowMapper {

    private LeitorUtils leitorUtils;

    public CursoRowMapper(LeitorUtils leitorUtils) {
        this.leitorUtils = leitorUtils;
    }

    public Curso map(Row row) {
        Curso curso = new Curso();

        curso.setId(leitorUtils.getInt(row, 15));
        curso.setIdInstituicao(leitorUtils.getInt(row, 13));
        curso.setNome(leitorUtils.getString(row, 14));

        int modalidadeBase = leitorUtils.getInt(row ,26);
        Modalidade modalidade = null;

        if (modalidadeBase == 1) {
            modalidade = Modalidade.PRESENCIAL;
        } else if (modalidadeBase == 2) {
            modalidade = Modalidade.EAD;
        }

        curso.setModalidade(modalidade);

        return curso;
    }

}
