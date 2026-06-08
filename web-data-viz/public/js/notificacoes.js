(function () {
  "use strict";

  const STORAGE_KEY = "notificacoes_lidas";

  function getLidas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function marcarLida(id) {
    const lidas = getLidas();
    if (!lidas.includes(id)) {
      lidas.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lidas));
    }
  }
  function marcarTodasLidas() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(_disparos.map((d) => d.id)),
    );
    atualizarBadge();
    renderizarLista();
  }

  function classeClassif(c) {
    const s = (c || "").toLowerCase();
    if (s.includes("crít") || s.includes("crit")) return "critico";
    if (s.includes("aten")) return "atencao";
    return "normal";
  }

  function iconeClassif(c) {
    const cl = classeClassif(c);
    if (cl === "critico")
      return `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>`;
    if (cl === "atencao")
      return `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>`;
    return `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>`;
  }

  let _disparos = [];
  let _painelAberto = false;
  let _painelEl = null;
  let _overlayEl = null;

  async function verificarEBuscar() {
    const cargo = sessionStorage.getItem("CARGO_USUARIO");
    const idInstituicao = sessionStorage.getItem("ID_INSTITUICAO");
    const idCurso = sessionStorage.getItem("ID_CURSO");

    let url = null;

    if (cargo === "diretor" && idInstituicao) {
      url = `/notificacoes/diretor/${idInstituicao}`;
    } else if (cargo === "coordenador" && idInstituicao && idCurso) {
      url = `/notificacoes/coordenador/${idInstituicao}/${idCurso}`;
    } else if (cargo === "administrador_instituicao" && idInstituicao) {
      url = `/notificacoes/admin/${idInstituicao}`;
    } else {
      return [];
    }

    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const dados = await res.json();
      return Array.isArray(dados) ? dados : [];
    } catch (e) {
      console.warn("[Notificações] Erro ao verificar:", e);
      return [];
    }
  }

  function atualizarBadge() {
    const badge = document.querySelector(".notif-badge");
    if (!badge) return;
    const lidas = getLidas();
    const naoLidas = _disparos.filter((d) => !lidas.includes(d.id)).length;
    if (naoLidas > 0) {
      badge.textContent = naoLidas > 99 ? "99+" : naoLidas;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  function renderizarLista() {
    if (!_painelEl) return;
    const lista = _painelEl.querySelector(".notif-lista");
    if (!lista) return;

    if (!_disparos.length) {
      lista.innerHTML = `
                <div class="notif-vazia">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                         stroke="#D1D5DB" stroke-width="1.5">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 01-3.46 0"/>
                    </svg>
                    <p>Nenhum limite atingido.</p>
                </div>`;
      return;
    }

    const lidas = getLidas();

    lista.innerHTML = _disparos
      .map((d) => {
        const naoLida = !lidas.includes(d.id);
        const classe = classeClassif(d.classificacao);
        const limiteLabel =
          d.condicao === "Superior"
            ? `↑ Valor ${d.valorAtual} acima do limite superior (${d.limiteSuperior})`
            : `↓ Valor ${d.valorAtual} abaixo do limite inferior (${d.limiteInferior})`;

        return `
                <div class="notif-item ${naoLida ? "nao-lida" : ""}"
                     ${naoLida ? `onclick="window.__notifMarcarLida(${d.id})"` : ""}>
                    <div class="notif-icone ${classe}">
                        ${iconeClassif(d.classificacao)}
                    </div>
                    <div class="notif-item-corpo">
                        <div class="notif-item-cabecalho">
                            <span class="notif-badge-classif ${classe}">${d.classificacao}</span>
                        </div>
                        <div class="notif-item-kpi">${d.kpi}</div>
                        <div class="notif-item-desc">${d.contexto}</div>
                        <div class="notif-item-rodape">
                            <span class="notif-item-condicao">${limiteLabel}</span>
                        </div>
                        ${d.descricao ? `<div class="notif-item-data">${d.descricao}</div>` : ""}
                        <div class="notif-item-data">${d.data}</div>
                    </div>
                    ${naoLida ? '<div class="notif-ponto"></div>' : ""}
                </div>`;
      })
      .join("");
  }

  function abrirPainel() {
    if (_painelAberto) {
      fecharPainel();
      return;
    }
    _painelAberto = true;

    _overlayEl = document.createElement("div");
    _overlayEl.className = "notif-overlay";
    _overlayEl.addEventListener("click", fecharPainel);
    document.body.appendChild(_overlayEl);

    _painelEl = document.createElement("div");
    _painelEl.className = "notif-painel";
    _painelEl.innerHTML = `
            <div class="notif-painel-header">
                <span class="notif-painel-titulo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 01-3.46 0"/>
                    </svg>
                    Notificações
                </span>
                <div class="notif-painel-acoes">
                    <button class="notif-btn-marcar-todas" onclick="window.__notifMarcarTodas()">
                        Marcar todas como lidas
                    </button>
                    <button class="notif-btn-fechar" onclick="window.__notifFechar()" title="Fechar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="notif-lista"></div>`;

    _painelEl.addEventListener("click", (e) => e.stopPropagation());
    document.body.appendChild(_painelEl);
    requestAnimationFrame(() => _painelEl.classList.add("aberto"));
    renderizarLista();
  }

  function fecharPainel() {
    if (!_painelAberto) return;
    _painelAberto = false;
    if (_painelEl) {
      _painelEl.classList.remove("aberto");
      const el = _painelEl;
      setTimeout(() => el.remove(), 280);
      _painelEl = null;
    }
    _overlayEl?.remove();
    _overlayEl = null;
  }

  window.__notifMarcarLida = function (id) {
    marcarLida(id);
    atualizarBadge();
    renderizarLista();
  };
  window.__notifMarcarTodas = marcarTodasLidas;
  window.__notifFechar = fecharPainel;

  function inicializar() {
    const cargo = sessionStorage.getItem("CARGO_USUARIO");

    if (
      cargo !== "diretor" &&
      cargo !== "coordenador" &&
      cargo !== "administrador_instituicao"
    )
      return;

    const sinoLink = document.querySelector(
      "a.link-item:has(#notification-icon)",
    );
    if (!sinoLink) return;

    sinoLink.classList.add("notif-wrapper");
    sinoLink.removeAttribute("href");

    const badge = document.createElement("span");
    badge.className = "notif-badge";
    sinoLink.appendChild(badge);

    sinoLink.addEventListener("click", (e) => {
      e.preventDefault();
      abrirPainel();
    });

    verificarEBuscar().then((dados) => {
      _disparos = dados;
      atualizarBadge();
    });
  }

  function aguardarHeader() {
    if (document.getElementById("notification-icon")) inicializar();
    else setTimeout(aguardarHeader, 80);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", aguardarHeader);
  else aguardarHeader();
})();
