const KPI_LABELS = {
    'taxa-evasao': 'Taxa de Evasão',
    matriculas: 'Total de Matrículas',
    trancamentos: 'Trancamentos',
};

const CLASSIFICACAO_LABELS = {
    'Crítico': 'Alto Risco',
    'Atenção': 'Atenção',
    'Normal': 'Normal',
};

const CONDICAO_LABELS = {
    'Superior': 'Limite superior ultrapassado',
    'Inferior': 'Limite inferior ultrapassado',
};

const ICONES = {
    'Crítico': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    'Atenção': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
    'Normal': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
    </svg>`,
};

let _alertasCache = [];
let regrasCarregadas = [];

function getAlertas() { return _alertasCache; }
function setAlertas(lista) { _alertasCache = lista; }

function classeClassificacao(classificacao) {
    const mapa = { 'Crítico': 'critico', 'Atenção': 'atencao', 'Normal': 'normal' };
    return mapa[classificacao] ?? 'normal';
}

function idInstituicao() {
    const id = sessionStorage.getItem('ID_INSTITUICAO');
    if (!id) console.error('ID_INSTITUICAO não definido no sessionStorage.');
    return id;
}

async function atualizarContadores() {
    const id = idInstituicao();
    if (!id) return;

    try {
        const resposta = await fetch(`/alertas/buscarKpi/${id}`);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();
        const row = dados[0];

        const elCritico = document.getElementById('count-critico');
        const elAtencao = document.getElementById('count-atencao');
        const elTotal = document.getElementById('count-total');

        if (elCritico) elCritico.textContent = row?.total_criticos ?? 0;
        if (elAtencao) elAtencao.textContent = row?.total_atencao ?? 0;
        if (elTotal) elTotal.textContent = row?.total_alertas ?? 0;
    } catch (erro) {
        console.error('Erro ao atualizar contadores:', erro);
    }
}

async function popularFiltroKpi() {
    const id = idInstituicao();
    if (!id) return;

    try {
        const resposta = await fetch(`/alertas/kpis/${id}`);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const kpis = await resposta.json();

        const select = document.getElementById('filtro-kpi');
        if (!select) return;

        select.innerHTML = `<option value="">Todos</option>` +
            kpis.map(k => `
                <option value="${k.kpi}">
                    ${KPI_LABELS[k.kpi] ?? k.kpi}
                </option>
            `).join('');
    } catch (erro) {
        console.error('Erro ao popular filtro de KPI:', erro);
    }
}

window.renderAlertas = async function () {
    try {
        const id = idInstituicao();
        if (!id) return;

        const filtroClassificacao = document.getElementById('filtro-classificacao')?.value || '';
        const filtroKpi = document.getElementById('filtro-kpi')?.value || '';

        const params = new URLSearchParams();
        if (filtroClassificacao) params.append('classificacao', filtroClassificacao);
        if (filtroKpi) params.append('kpi', filtroKpi);

        const url = `/alertas/filtrar/${id}${params.toString() ? '?' + params.toString() : ''}`;

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const alertas = await resposta.json();
        setAlertas(alertas);

        await atualizarContadores();

        const lista = document.getElementById('alertas-lista');
        if (!lista) return;

        if (alertas.length === 0) {
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

        lista.innerHTML = alertas.map((alerta) => `
            <div class="alerta-item alerta-item--${classeClassificacao(alerta.classificacao)}"
                 data-id="${alerta.id}"
                 data-classificacao="${alerta.classificacao}"
                 data-kpi="${alerta.kpi}">

                <div class="alerta-item-esquerda">
                    <div class="alerta-icone alerta-icone--${classeClassificacao(alerta.classificacao)}">
                        ${ICONES[alerta.classificacao] ?? ''}
                    </div>

                    <div class="alerta-info">
                        <div class="alerta-info-topo">
                            <span class="alerta-nome">
                                ${KPI_LABELS[alerta.kpi] ?? alerta.kpi}
                            </span>
                            <span class="alerta-badge alerta-badge--${classeClassificacao(alerta.classificacao)}">
                                ${CLASSIFICACAO_LABELS[alerta.classificacao] ?? alerta.classificacao}
                            </span>
                            <span class="alerta-condicao-tag">
                                ${CONDICAO_LABELS[alerta.condicao] ?? alerta.condicao}
                            </span>
                        </div>
                    </div>
                </div>

                <div style="display:flex;gap:8px;align-items:center;">
                    <button class="btn-visualizar"
                            onclick="abrirModalDetalhesAlerta(${alerta.id})">
                        Visualizar
                    </button>
                    <button class="action-btn edit"
                            onclick="abrirModalEditarAlerta(${alerta.id})"
                            title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="action-btn del"
                            onclick="abrirModalExcluirAlerta(${alerta.id})"
                            title="Excluir">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

    } catch (erro) {
        console.error('Erro ao renderizar alertas:', erro);
    }
};

async function obterRegras() {
    const id = idInstituicao();
    if (!id) return [];

    try {
        const resposta = await fetch(`/alertas/regras/${id}`);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();
        regrasCarregadas = dados;
        return dados;
    } catch (erro) {
        console.error('Erro ao buscar regras da API:', erro);
        return [];
    }
}

function _htmlCondicaoGrupo(condicaoSelecionada = 'Superior') {
    return `
        <div class="condicao-grupo">
            <label class="condicao-opcao">
                <input type="radio" name="alerta-condicao" value="Superior"
                       ${condicaoSelecionada === 'Superior' ? 'checked' : ''}>
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
                <input type="radio" name="alerta-condicao" value="Inferior"
                       ${condicaoSelecionada === 'Inferior' ? 'checked' : ''}>
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
    `;
}

window.formNovoAlerta = async function () {
    regrasCarregadas = await obterRegras();
    return `
        <div class="form-group">
            <label>Regra</label>
            <select id="alerta-regra">
                <option value="">Selecione uma regra</option>
                ${regrasCarregadas.map((regra) => `
                    <option value="${regra.id_regra}">
                        ${KPI_LABELS[regra.kpi] ?? regra.kpi}
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Classificação</label>
            <select id="alerta-classificacao">
                <option value="">Selecione a classificação</option>
                <option value="Crítico">Crítico</option>
                <option value="Atenção">Atenção</option>
                <option value="Normal">Normal</option>
            </select>
        </div>
        <div class="form-group full-width">
            <label>Condição de Ativação</label>
            ${_htmlCondicaoGrupo('Superior')}
        </div>
        <div class="form-group full-width">
            <label>Descrição / Observação</label>
            <textarea id="alerta-descricao"
                      placeholder="Digite o contexto ou observações sobre este alerta..."></textarea>
        </div>
    `;
};

window.formEditarAlerta = async function ({ id_regra, classificacao, condicao, descricao }) {
    if (!regrasCarregadas.length) regrasCarregadas = await obterRegras();
    return `
        <div class="form-group">
            <label>Regra</label>
            <select id="alerta-regra">
                <option value="">Selecione uma regra</option>
                ${regrasCarregadas.map((regra) => `
                    <option value="${regra.id_regra}"
                            ${Number(regra.id_regra) === Number(id_regra) ? 'selected' : ''}>
                        ${KPI_LABELS[regra.kpi] ?? regra.kpi}
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Classificação</label>
            <select id="alerta-classificacao">
                <option value="">Selecione a classificação</option>
                <option value="Crítico"  ${classificacao === 'Crítico' ? 'selected' : ''}>Crítico</option>
                <option value="Atenção"  ${classificacao === 'Atenção' ? 'selected' : ''}>Atenção</option>
                <option value="Normal"   ${classificacao === 'Normal' ? 'selected' : ''}>Normal</option>
            </select>
        </div>
        <div class="form-group full-width">
            <label>Condição de Ativação</label>
            ${_htmlCondicaoGrupo(condicao)}
        </div>
        <div class="form-group full-width">
            <label>Descrição / Observação</label>
            <textarea id="alerta-descricao"
                      placeholder="Descreva o contexto ou observações sobre este alerta...">${descricao ?? ''}</textarea>
        </div>
    `;
};

window.abrirModalNovoAlerta = async function () {
    const conteudo = await formNovoAlerta();
    abrirModal({
        titulo: 'Novo Alerta',
        conteudo,
        botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">Cancelar</button>
            <button class="modal-botao-confirmar" onclick="salvarAlerta()">Cadastrar</button>
        `,
        tamanho: 'md',
        tipo: 'default',
    });
};

window.abrirModalEditarAlerta = async function (id) {
    const alerta = getAlertas().find((a) => a.id === id);
    if (!alerta) return;
    const conteudo = await formEditarAlerta(alerta);
    abrirModal({
        titulo: 'Editar Alerta',
        conteudo,
        botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">Cancelar</button>
            <button class="modal-botao-confirmar" onclick="atualizarAlerta(${id})">Salvar</button>
        `,
        tamanho: 'md',
        tipo: 'warning',
    });
};

window.abrirModalDetalhesAlerta = function (id) {
    const alerta = getAlertas().find((a) => a.id === id);
    if (!alerta) return;
    abrirModal({
        titulo: 'Detalhes do Alerta',
        conteudo: `
            <div class="modal-detalhe-grid">
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Regra</span>
                    <span class="modal-detalhe-valor">${KPI_LABELS[alerta.kpi] ?? alerta.kpi}</span>
                </div>
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Classificação</span>
                    <span class="modal-detalhe-valor">${CLASSIFICACAO_LABELS[alerta.classificacao] ?? alerta.classificacao}</span>
                </div>
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Condição de Ativação</span>
                    <span class="modal-detalhe-valor">${CONDICAO_LABELS[alerta.condicao] ?? '—'}</span>
                </div>
                <div class="modal-detalhe-item">
                    <span class="modal-detalhe-label">Data de Geração</span>
                    <span class="modal-detalhe-valor">${alerta.data}</span>
                </div>
                <div class="modal-detalhe-item modal-detalhe-item--full">
                    <span class="modal-detalhe-label">Descrição / Observação</span>
                    <span class="modal-detalhe-valor">${alerta.descricao || '—'}</span>
                </div>
            </div>
        `,
        botoes: `<button class="modal-botao-cancelar" onclick="fecharModal()">Fechar</button>`,
        tamanho: 'md',
        tipo: 'default',
    });
};

window.abrirModalExcluirAlerta = function (id) {
    abrirModal({
        titulo: 'Excluir Alerta',
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
        tamanho: 'sm',
        tipo: 'danger',
    });
};

window.salvarAlerta = async function () {
    const id_regra = document.getElementById('alerta-regra').value;
    const classificacao = document.getElementById('alerta-classificacao').value;
    const condicao = document.querySelector('input[name="alerta-condicao"]:checked')?.value;
    const descricao = document.getElementById('alerta-descricao').value;

    if (!id_regra || !classificacao || !condicao) {
        showToast('danger', 'Erro ao cadastrar alerta!', 'Preencha todos os campos obrigatórios e escolha uma condição de ativação.');
        return;
    }

    try {
        const resposta = await fetch('/alertas/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_regra: Number(id_regra), classificacao, observacao: descricao, condicao }),
        });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao cadastrar alerta.');
        fecharModal();
        await renderAlertas();
        showToast('success', 'Alerta cadastrado!', 'Alerta criado com sucesso.');
    } catch (erro) {
        console.error('Falha na requisição de cadastro:', erro);
        showToast('danger', 'Erro ao cadastrar alerta!', erro.message || 'Não foi possível cadastrar o alerta.');
    }
};

window.atualizarAlerta = async function (id) {
    const id_regra = document.getElementById('alerta-regra').value;
    const classificacao = document.getElementById('alerta-classificacao').value;
    const condicao = document.querySelector('input[name="alerta-condicao"]:checked')?.value;
    const observacao = document.getElementById('alerta-descricao').value;

    if (!id_regra || !classificacao || !condicao) {
        showToast('danger', 'Erro ao atualizar alerta!', 'Preencha todos os campos obrigatórios e selecione a condição de ativação.');
        return;
    }

    try {
        const resposta = await fetch(`/alertas/atualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_regra: Number(id_regra), classificacao, observacao, condicao }),
        });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao atualizar alerta.');
        fecharModal();
        await renderAlertas();
        showToast('success', 'Alerta atualizado!', 'Alerta atualizado com sucesso.');
    } catch (erro) {
        console.error('Falha na requisição de atualização:', erro);
        showToast('danger', 'Erro ao atualizar alerta!', erro.message || 'Não foi possível atualizar o alerta.');
    }
};

window.excluirAlerta = async function (id) {
    try {
        const resposta = await fetch(`/alertas/deletar/${id}`, { method: 'DELETE' });
        if (!resposta.ok) {
            const texto = await resposta.text();
            showToast('danger', 'Erro ao excluir alerta!', `Erro ao excluir alerta: ${texto}`);
            return;
        }
        fecharModal();
        await renderAlertas();
        showToast('success', 'Alerta excluído!', 'Alerta removido com sucesso.');
    } catch (erro) {
        console.error('Falha na requisição de exclusão:', erro);
        showToast('danger', 'Erro ao excluir alerta!', 'Não foi possível conectar ao servidor para deletar o alerta.');
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await popularFiltroKpi();
    await renderAlertas();
});