package com.academica.conexao.instituicao.validator;

import com.academica.conexao.instituicao.model.Instituicao;

import java.util.ArrayList;
import java.util.List;

public class InstituicaoValidator {

    public List<String> validate(Instituicao instituicao) {
        List<String> erros = new ArrayList<>();

        if (instituicao.getId() == null) {
            erros.add("ID da instituição nulo");
        } else {
            if (instituicao.getId() == 0)
                erros.add("ID da instituição zerado");

            if (instituicao.getId() < 0)
                erros.add("ID da instituição negativo");
        }

        if (instituicao.getNome() == null || instituicao.getNome().isBlank())
            erros.add("Nome da instituição nulo ou vazio");

        if (instituicao.getNome() != null && instituicao.getNome().length() > 200)
            erros.add("Nome da instituição excede limite de 200 caracteres");

        if (instituicao.getUf() == null)
            erros.add("UF da instituição nula");

        if (instituicao.getUf() != null && instituicao.getUf().length() != 2)
            erros.add("UF da instituição não contém 2 caracteres");

        if (instituicao.getUf() != null && !instituicao.getUf().matches("[A-Z]{2}"))
            erros.add("UF da instituição não contém apenas letras");

        return erros;
    }
}
