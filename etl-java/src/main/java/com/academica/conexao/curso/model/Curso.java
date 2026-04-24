package com.academica.conexao.curso.model;

import com.academica.conexao.curso.enums.Modalidade;

public class Curso {

    private Integer id;
    private Integer idInstituicao;
    private String nome;
    private Modalidade modalidade;

    public Curso() {
    }

    public Curso(Integer id, Integer idInstituicao, String nome, Modalidade modalidade) {
        this.id = id;
        this.idInstituicao = idInstituicao;
        this.nome = nome;
        this.modalidade = modalidade;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdInstituicao() {
        return idInstituicao;
    }

    public void setIdInstituicao(Integer idInstituicao) {
        this.idInstituicao = idInstituicao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Modalidade getModalidade() {
        return modalidade;
    }

    public void setModalidade(Modalidade modalidade) {
        this.modalidade = modalidade;
    }
}
