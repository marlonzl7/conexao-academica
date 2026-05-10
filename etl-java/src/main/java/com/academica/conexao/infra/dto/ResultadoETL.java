package com.academica.conexao.infra.dto;

import java.util.List;

public class ResultadoETL {
    private final List<String> basesProcessadas;
    private final Double duracaoSegundos;

    public ResultadoETL(List<String> basesProcessadas, Double duracaoSegundos) {
        this.basesProcessadas = basesProcessadas;
        this.duracaoSegundos = duracaoSegundos;
    }

    public List<String> getBasesProcessadas() {
        return basesProcessadas;
    }

    public Double getDuracaoSegundos() {
        return duracaoSegundos;
    }
}
