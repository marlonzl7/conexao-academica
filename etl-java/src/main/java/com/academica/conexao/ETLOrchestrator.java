package com.academica.conexao;

import com.academica.conexao.infra.pipeline.ETLPipeline;

import java.util.List;

public class ETLOrchestrator {

    private final List<ETLPipeline> pipelines;

    public ETLOrchestrator(List<ETLPipeline> pipelines) {
        this.pipelines = pipelines;
    }

    public void executar() {
        for (ETLPipeline pipeline : pipelines) {
            pipeline.executar();
        }
    }

}
