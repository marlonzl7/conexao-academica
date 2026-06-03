window.conteudoDetalhesAlerta = function ({ kpi, classificacao, curso, data, regra }) {
    return `
        <div class="modal-detalhe-grid">
            <div class="modal-detalhe-item">
                <span class="modal-detalhe-label">KPI</span>
                <span class="modal-detalhe-valor">${kpi ?? "—"}</span>
            </div>
            <div class="modal-detalhe-item">
                <span class="modal-detalhe-label">Classificação</span>
                <span class="modal-detalhe-valor">${classificacao ?? "—"}</span>
            </div>
            <div class="modal-detalhe-item">
                <span class="modal-detalhe-label">Curso</span>
                <span class="modal-detalhe-valor">${curso ?? "—"}</span>
            </div>
            <div class="modal-detalhe-item">
                <span class="modal-detalhe-label">Data de geração</span>
                <span class="modal-detalhe-valor">${data ?? new Date().toLocaleDateString("pt-BR")}</span>
            </div>
            <div class="modal-detalhe-item modal-detalhe-item--full">
                <span class="modal-detalhe-label">Regra acionada</span>
                <span class="modal-detalhe-valor">${regra ?? "Limite superior definido pela regra ativa. Valor atual excede o threshold configurado."}</span>
            </div>
        </div>
    `;
};

window.abrirModalDetalhesAlerta = function (btn) {
    const item = btn.closest(".alerta-item");

    const kpi = item.querySelector(".alerta-nome").textContent;
    const classificacao = item.querySelector(".alerta-badge").textContent;
    const curso = item.querySelector(".alerta-curso").textContent.replace("Curso: ", "");

    abrirModal({
        titulo: "Detalhes do Alerta",
        conteudo: conteudoDetalhesAlerta({ kpi, classificacao, curso }),
        botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">
                Fechar
            </button>
            <a href="../regras.html" class="modal-botao-confirmar">
                Ver Regras
            </a>
        `,
        tamanho: "sm",
        tipo: "default"
    });
};