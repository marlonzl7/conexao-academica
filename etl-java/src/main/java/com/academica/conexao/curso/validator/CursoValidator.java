package com.academica.conexao.curso.validator;

import com.academica.conexao.curso.model.Curso;

import java.util.ArrayList;
import java.util.List;

public class CursoValidator {

    public List<String> validate(Curso curso) {
        List<String> erros = new ArrayList<>();

        if (curso.getId() == null) {
            erros.add("ID do curso nulo");
        } else {
            if (curso.getId() == 0) {
                erros.add("ID do curso zerado");
            }

            if (curso.getId() < 0)
                erros.add("ID do curso negativo");
        }

        if (curso.getIdInstituicao() == null) {
            erros.add("ID da instituição nulo");
        } else {
            if (curso.getIdInstituicao() == 0)
                erros.add("ID da instituição zerado");

            if (curso.getIdInstituicao() < 0)
                erros.add("ID da instituição negativo");
        }

        if (curso.getNome() == null || curso.getNome().isBlank())
            erros.add("Nome do curso nulo ou vazio");

        if (curso.getNome() != null && curso.getNome().length() > 255)
            erros.add("Nome do curso excede limite de 255 caracteres");

        if (curso.getModalidade() == null)
            erros.add("Modalidade do curso nula");

        return erros;
    }

}
