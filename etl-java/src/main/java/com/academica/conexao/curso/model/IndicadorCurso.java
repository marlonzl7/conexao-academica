package com.academica.conexao.curso.model;

public class IndicadorCurso {

    private Integer idCurso;
    private Integer ano;
    private Integer qtdMatriculas;
    private Integer qtdAlunosSituacaoDesvinculada;
    private Integer qtdAlunosSituacaoTrancada;

    public IndicadorCurso() {
    }

    public IndicadorCurso(Integer idCurso, Integer ano, Integer qtdMatriculas, Integer qtdAlunosSituacaoDesvinculada, Integer qtdAlunosSituacaoTrancada) {
        this.idCurso = idCurso;
        this.ano = ano;
        this.qtdMatriculas = qtdMatriculas;
        this.qtdAlunosSituacaoDesvinculada = qtdAlunosSituacaoDesvinculada;
        this.qtdAlunosSituacaoTrancada = qtdAlunosSituacaoTrancada;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Integer getQtdMatriculas() {
        return qtdMatriculas;
    }

    public void setQtdMatriculas(Integer qtdMatriculas) {
        this.qtdMatriculas = qtdMatriculas;
    }

    public Integer getQtdAlunosSituacaoDesvinculada() {
        return qtdAlunosSituacaoDesvinculada;
    }

    public void setQtdAlunosSituacaoDesvinculada(Integer qtdAlunosSituacaoDesvinculada) {
        this.qtdAlunosSituacaoDesvinculada = qtdAlunosSituacaoDesvinculada;
    }

    public Integer getQtdAlunosSituacaoTrancada() {
        return qtdAlunosSituacaoTrancada;
    }

    public void setQtdAlunosSituacaoTrancada(Integer qtdAlunosSituacaoTrancada) {
        this.qtdAlunosSituacaoTrancada = qtdAlunosSituacaoTrancada;
    }
}
