const KPI_LABELS = {
  "taxa-evasao": "Taxa de Evasão",
  matriculas: "Total de Matrículas",
  trancamentos: "Trancamentos",
};

const CLASSIFICACAO_LABELS = {
  critico: "Alto Risco",
  atencao: "Atenção",
  normal: "Normal",
};

const CONDICAO_LABELS = {
  superior: "Limite superior ultrapassado",
  inferior: "Limite inferior ultrapassado",
};

const ICONES = {
  critico: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
  atencao: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
  normal: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
    </svg>`,
};

function getAlertas() {
  return JSON.parse(localStorage.getItem("alertas") || "[]");
}

function saveAlertas(alertas) {
  localStorage.setItem("alertas", JSON.stringify(alertas));
}

window.renderAlertas = function () {
  const alertas = getAlertas();
  const lista = document.getElementById("alertas-lista");

  const filtroClassificacao =
    document.getElementById("filtro-classificacao")?.value || "";
  const filtroKpi = document.getElementById("filtro-kpi")?.value || "";

  const filtrados = alertas.filter((a) => {
    return (
      (!filtroClassificacao || a.classificacao === filtroClassificacao) &&
      (!filtroKpi || a.kpi === filtroKpi)
    );
  });

  const elCritico = document.getElementById("count-critico");
  const elAtencao = document.getElementById("count-atencao");
  const elTotal = document.getElementById("count-total");

  if (elCritico)
    elCritico.textContent = alertas.filter(
      (a) => a.classificacao === "critico",
    ).length;
  if (elAtencao)
    elAtencao.textContent = alertas.filter(
      (a) => a.classificacao === "atencao",
    ).length;
  if (elTotal) elTotal.textContent = alertas.length;

  if (filtrados.length === 0) {
    lista.innerHTML = `
            <div class="alerta-vazio">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>Nenhum alerta encontrado.</p>
            </div>
        `;
    return;
  }

  lista.innerHTML = filtrados
    .map(
      (alerta) => `
        <div class="alerta-item alerta-item--${alerta.classificacao}"
             data-id="${alerta.id}"
             data-classificacao="${alerta.classificacao}"
             data-kpi="${alerta.kpi}">
            <div class="alerta-item-esquerda">
                <div class="alerta-icone alerta-icone--${alerta.classificacao}">
                    ${ICONES[alerta.classificacao]}
                </div>
                <div class="alerta-info">
                    <div class="alerta-info-topo">
                        <span class="alerta-nome">${KPI_LABELS[alerta.kpi] ?? alerta.kpi}</span>
                        <span class="alerta-badge alerta-badge--${alerta.classificacao}">
                            ${CLASSIFICACAO_LABELS[alerta.classificacao]}
                        </span>
                        <span class="alerta-condicao-tag">${CONDICAO_LABELS[alerta.condicao] ?? alerta.condicao}</span>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
                <button class="btn-visualizar" onclick="abrirModalDetalhesAlerta(${alerta.id})">Visualizar</button>
                <button class="action-btn del" onclick="abrirModalExcluirAlerta(${alerta.id})" title="Excluir">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                </button>
            </div>
        </div>
    `,
    )
    .join("");
};

async function obterRegras() {
  const idInstituicao = sessionStorage.ID_INSTITUICAO;

  const resposta = await fetch(`/regras/${idInstituicao}`);

  return await resposta.json();
}

window.formNovoAlerta = async function () {

    const regras = await obterRegras();

    return `
        <div class="form-group">
            <label>Regra</label>

            <select id="alerta-regra">

                <option value="">
                    Selecione uma regra
                </option>

                ${regras.map(regra => `
                    <option value="${regra.id_regra}">
                        ${regra.kpi} - ${regra.classificacao}
                    </option>
                `).join("")}

            </select>
        </div>

        <div class="form-group full-width">
            <label>Observação</label>

            <textarea
                id="alerta-observacao"
                placeholder="Digite uma observação"
            ></textarea>
        </div>
    `;
};

window.formEditarAlerta = function ({
  kpi,
  classificacao,
  condicao,
  descricao,
}) {
  return `
        <div class="form-group">
            <label>Regra</label>
            <select id="alerta-regra">
                <option value="">Selecione a regra</option>
                <option value="taxa-evasao"  ${kpi === "taxa-evasao" ? "selected" : ""}>Taxa de Evasão</option>
                <option value="matriculas"   ${kpi === "matriculas" ? "selected" : ""}>Total de Matrículas</option>
                <option value="trancamentos" ${kpi === "trancamentos" ? "selected" : ""}>Trancamentos</option>
            </select>
        </div>

        <div class="form-group">
            <label>Classificação</label>
            <select id="alerta-classificacao">
                <option value="">Selecione a classificação</option>
                <option value="critico" ${classificacao === "critico" ? "selected" : ""}>Crítico</option>
                <option value="atencao" ${classificacao === "atencao" ? "selected" : ""}>Atenção</option>
                <option value="normal"  ${classificacao === "normal" ? "selected" : ""}>Normal</option>
            </select>
        </div>

        <div class="form-group full-width">
            <label>Condição de Ativação</label>
            <div class="condicao-grupo">
                <label class="condicao-opcao">
                    <input type="radio" name="alerta-condicao" value="superior" ${condicao === "superior" ? "checked" : ""}>
                    <div class="condicao-card">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="18 15 12 9 6 15"/>
                        </svg>
                        <div>
                            <strong>Limite Superior</strong>
                            <p>Ativar quando o valor ultrapassar o limite máximo</p>
                        </div>
                    </div>
                </label>
                <label class="condicao-opcao">
                    <input type="radio" name="alerta-condicao" value="inferior" ${condicao === "inferior" ? "checked" : ""}>
                    <div class="condicao-card">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        <div>
                            <strong>Limite Inferior</strong>
                            <p>Ativar quando o valor cair abaixo do limite mínimo</p>
                        </div>
                    </div>
                </label>
            </div>
        </div>

        <div class="form-group full-width">
            <label>Descrição / Observação</label>
            <textarea id="alerta-descricao" placeholder="Descreva o contexto ou observações sobre este alerta...">${descricao ?? ""}</textarea>
        </div>
    `;
};

window.abrirModalNovoAlerta = async function () {

    const conteudo =
        await formNovoAlerta();

    abrirModal({
        titulo: "Novo Alerta",

        conteudo,

        botoes: `
            <button
                class="modal-botao-cancelar"
                onclick="fecharModal()">
                Cancelar
            </button>

            <button
                class="modal-botao-confirmar"
                onclick="salvarAlerta()">
                Cadastrar
            </button>
        `,

        tamanho: "md",
        tipo: "default"
    });
};

window.abrirModalEditarAlerta = function (id) {
  const alerta = getAlertas().find((a) => a.id === id);
  if (!alerta) return;

  abrirModal({
    titulo: "Editar Alerta",
    conteudo: formEditarAlerta(alerta),
    botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">Cancelar</button>
            <button class="modal-botao-confirmar" onclick="atualizarAlerta(${id})">Salvar</button>
        `,
    tamanho: "md",
    tipo: "warning",
  });
};

window.abrirModalDetalhesAlerta = function (id) {
  const alerta = getAlertas().find((a) => a.id === id);
  if (!alerta) return;

  abrirModal({
    titulo: "Detalhes do Alerta",
    conteudo: `
            <div class="modal-detalhe-grid">
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Regra (KPI)</span>
                    <span class="modal-detalhe-valor">${KPI_LABELS[alerta.regra] ?? alerta.regra}</span>
                </div>
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Classificação</span>
                    <span class="modal-detalhe-valor">${CLASSIFICACAO_LABELS[alerta.classificacao]}</span>
                </div>
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Condição de Ativação</span>
                    <span class="modal-detalhe-valor">${CONDICAO_LABELS[alerta.condicao] ?? "—"}</span>
                </div>
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Data de Geração</span>
                    <span class="modal-detalhe-valor">${alerta.data}</span>
                </div>
                <div class="modal-detalhe-item modal-detalhe-item--full">
                    <span class="modal-detalhe-label">Descrição / Observação</span>
                    <span class="modal-detalhe-valor">${alerta.descricao || "—"}</span>
                </div>
            </div>
        `,
    botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">Fechar</button>
        `,
    tamanho: "md",
    tipo: "default",
  });
};

window.abrirModalExcluirAlerta = function (id) {
  abrirModal({
    titulo: "Excluir Alerta",
    conteudo: `
            <div class="modal-confirmacao">
                <h3>Tem certeza que deseja excluir este alerta?</h3>
                <p>Esta ação não pode ser desfeita. O alerta será removido permanentemente.</p>
            </div>
        `,
    botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">Cancelar</button>
            <button class="modal-botao-deletar" onclick="excluirAlerta(${id})">Excluir</button>
        `,
    tamanho: "sm",
    tipo: "danger",
  });
};

window.salvarAlerta = function () {
  const regra = document.getElementById("alerta-regra").value;
  const classificacao = document.getElementById("alerta-classificacao").value;
  const condicao = document.querySelector(
    'input[name="alerta-condicao"]:checked',
  )?.value;
  const descricao = document.getElementById("alerta-descricao").value;

  if (!kpi || !classificacao || !condicao) {
    alert(
      "Preencha todos os campos obrigatórios e selecione a condição de ativação.",
    );
    return;
  }

  const alertas = getAlertas();
  alertas.push({
    id: Date.now(),
    regra,
    classificacao,
    condicao,
    descricao,
    data: new Date().toLocaleDateString("pt-BR"),
  });

  saveAlertas(alertas);
  fecharModal();
  renderAlertas();
};

window.atualizarAlerta = function (id) {
  const regra = document.getElementById("alerta-regra").value;
  const classificacao = document.getElementById("alerta-classificacao").value;
  const condicao = document.querySelector(
    'input[name="alerta-condicao"]:checked',
  )?.value;
  const descricao = document.getElementById("alerta-descricao").value;

  if (!regra || !classificacao || !condicao) {
    alert(
      "Preencha todos os campos obrigatórios e selecione a condição de ativação.",
    );
    return;
  }

  const alertas = getAlertas().map((a) =>
    a.id === id ? { ...a, regra, classificacao, condicao, descricao } : a,
  );

  saveAlertas(alertas);
  fecharModal();
  renderAlertas();
};

window.excluirAlerta = function (id) {
  saveAlertas(getAlertas().filter((a) => a.id !== id));
  fecharModal();
  renderAlertas();
};

document.addEventListener("DOMContentLoaded", renderAlertas);
