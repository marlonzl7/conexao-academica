package com.academica.conexao.curso.validator;

import com.academica.conexao.curso.model.IndicadorCurso;

import java.util.ArrayList;
import java.util.List;

public class IndicadorCursoValidator {

    public List<String> validate(IndicadorCurso indicadorCurso) {
        List<String> erros = new ArrayList<>();

        if (indicadorCurso.getIdCurso() == null) {
            erros.add("ID do curso nulo");
        } else {
            if (indicadorCurso.getIdCurso() == 0)
                erros.add("ID do curso zerado");

            if (indicadorCurso.getIdCurso() < 0)
                erros.add("ID do curso negativo");
        }

        if (indicadorCurso.getAno() == null) {
            erros.add("Ano do curso nulo");
        }

        if (indicadorCurso.getAno() < 1900 || indicadorCurso.getAno() > 2100)
            erros.add("Ano não está dentro do limite esperado: 1900 - 2100");

        if (indicadorCurso.getQtdMatriculas() == null)
            erros.add("Quantidade de matriculas nula");

        if (indicadorCurso.getQtdMatriculas() < 0)
            erros.add("Quantidade de matriculas negativa");

        if (indicadorCurso.getQtdAlunosSituacaoDesvinculada() == null)
            erros.add("Quantidade alunos desvinculados nula");

        if (indicadorCurso.getQtdAlunosSituacaoDesvinculada() < 0)
            erros.add("Quantidade de alunos situação desvinculada negativa");

        if (indicadorCurso.getQtdAlunosSituacaoTrancada() == null)
            erros.add("Quantidade alunos situação trancada nula");

        if (indicadorCurso.getQtdAlunosSituacaoTrancada() < 0)
            erros.add("Quantidade de alunos situação trancada negativa");

        return erros;
    }

}
