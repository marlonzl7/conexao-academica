(function () {
  const STORAGE_KEY = "notificacoes_lidas";

  function getIdInstituicao() {
    return sessionStorage.getItem("ID_INSTITUICAO");
  }

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

  function marcarTodasLidas(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function formatarData(dataStr) {
    if (!dataStr) return "—";
    const d = new Date(dataStr);
    if (isNaN(d)) return dataStr;
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function classeClassif(c) {
    return (
      { Crítico: "critico", Atenção: "atencao", Normal: "normal" }[c] ??
      "normal"
    );
  }

  function iconeClassif(c) {
    if (c === "Crítico")
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    if (c === "Atenção")
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  }

  async function buscarAlertas() {
    const id = getIdInstituicao();
    if (!id) return [];
    try {
      const res = await fetch(`/alertas/${id}`);
      if (!res.ok) return [];
      const dados = await res.json();
      return Array.isArray(dados) ? dados : [];
    } catch {
      return [];
    }
  }

  function injetarEstilos() {
    if (document.getElementById("notif-styles")) return;
    const style = document.createElement("style");
    style.id = "notif-styles";
    style.textContent = `
            .sidebar-notif-btn {
                position: relative;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                color: inherit;
                text-decoration: none;
                transition: background 0.18s;
                width: 100%;
                background: none;
                border: none;
                font-size: inherit;
                font-family: inherit;
            }
            .sidebar-notif-btn:hover { background: rgba(255,255,255,0.08); }
            .sidebar-notif-btn img { width: 22px; height: 22px; }
            .sidebar-notif-badge {
                position: absolute;
                top: 6px;
                left: 28px;
                background: #EF4444;
                color: #fff;
                border-radius: 50%;
                font-size: 10px;
                font-weight: 700;
                min-width: 17px;
                height: 17px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 3px;
                line-height: 1;
                border: 2px solid #1E3A8A;
                display: none;
            }

            /* ── Painel de notificações ── */
            .notif-overlay {
                position: fixed;
                inset: 0;
                z-index: 999;
                background: transparent;
            }
            .notif-painel {
                position: fixed;
                top: 0;
                left: 240px;
                width: 360px;
                height: 100vh;
                background: #fff;
                box-shadow: 4px 0 24px rgba(0,0,0,0.13);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                transform: translateX(-10px);
                opacity: 0;
                transition: transform 0.22s ease, opacity 0.22s ease;
                pointer-events: none;
            }
            .notif-painel.aberto {
                transform: translateX(0);
                opacity: 1;
                pointer-events: all;
            }
            .notif-painel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 20px 14px;
                border-bottom: 1px solid #F0F0F0;
            }
            .notif-painel-titulo {
                font-weight: 700;
                font-size: 15px;
                color: #1E3A8A;
            }
            .notif-painel-acoes {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .notif-btn-marcar-todas {
                font-size: 11px;
                color: #1E3A8A;
                background: none;
                border: none;
                cursor: pointer;
                text-decoration: underline;
                padding: 0;
            }
            .notif-btn-fechar {
                background: none;
                border: none;
                cursor: pointer;
                color: #888;
                display: flex;
                align-items: center;
                padding: 2px;
                border-radius: 4px;
                transition: background 0.15s;
            }
            .notif-btn-fechar:hover { background: #F5F5F5; color: #333; }
            .notif-lista {
                overflow-y: auto;
                flex: 1;
                padding: 10px 0;
            }
            .notif-vazia {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #AAA;
                gap: 10px;
                font-size: 13px;
            }
            .notif-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 14px 20px;
                border-bottom: 1px solid #F7F7F7;
                cursor: pointer;
                transition: background 0.15s;
                position: relative;
            }
            .notif-item:hover { background: #F9FAFB; }
            .notif-item.nao-lida { background: #EFF6FF; }
            .notif-item.nao-lida:hover { background: #DBEAFE; }
            .notif-ponto-nao-lida {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #3B82F6;
            }
            .notif-icone {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .notif-icone.critico { background: #FEE2E2; color: #DC2626; }
            .notif-icone.atencao { background: #FEF9C3; color: #CA8A04; }
            .notif-icone.normal  { background: #DCFCE7; color: #16A34A; }
            .notif-item-corpo { flex: 1; min-width: 0; }
            .notif-item-titulo {
                font-size: 13px;
                font-weight: 600;
                color: #1F2937;
                margin-bottom: 2px;
            }
            .notif-item-desc {
                font-size: 11px;
                color: #6B7280;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .notif-item-data {
                font-size: 10px;
                color: #9CA3AF;
                margin-top: 4px;
            }
            .notif-badge-classif {
                display: inline-block;
                font-size: 10px;
                font-weight: 600;
                padding: 1px 7px;
                border-radius: 10px;
                margin-bottom: 4px;
            }
            .notif-badge-classif.critico { background: #FEE2E2; color: #DC2626; }
            .notif-badge-classif.atencao { background: #FEF9C3; color: #CA8A04; }
            .notif-badge-classif.normal  { background: #DCFCE7; color: #16A34A; }
        `;
    document.head.appendChild(style);
  }

  let painelAberto = false;
  let overlayEl = null;
  let painelEl = null;
  let alertasCarregados = [];

  function renderizarPainel() {
    const lista = painelEl.querySelector(".notif-lista");
    if (!lista) return;

    const lidas = getLidas();

    if (!alertasCarregados.length) {
      lista.innerHTML = `
                <div class="notif-vazia">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 01-3.46 0"/>
                    </svg>
                    <p>Nenhum alerta encontrado.</p>
                </div>`;
      return;
    }

    lista.innerHTML = alertasCarregados
      .map((a) => {
        const naoLida = !lidas.includes(a.id);
        const classe = classeClassif(a.classificacao);
        return `
                <div class="notif-item ${naoLida ? "nao-lida" : ""}"
                     onclick="window._notifMarcarLida(${a.id})">
                    <div class="notif-icone ${classe}">
                        ${iconeClassif(a.classificacao)}
                    </div>
                    <div class="notif-item-corpo">
                        <span class="notif-badge-classif ${classe}">${a.classificacao}</span>
                        <div class="notif-item-titulo">${a.kpi ?? "Alerta"}</div>
                        <div class="notif-item-desc">${a.descricao || a.observacao || "Sem descrição"}</div>
                        <div class="notif-item-data">${formatarData(a.data || a.data_hora)}</div>
                    </div>
                    ${naoLida ? '<div class="notif-ponto-nao-lida"></div>' : ""}
                </div>`;
      })
      .join("");
  }

  function atualizarBadge() {
    const badge = document.querySelector(".sidebar-notif-badge");
    if (!badge) return;
    const lidas = getLidas();
    const naoLidas = alertasCarregados.filter(
      (a) => !lidas.includes(a.id),
    ).length;
    if (naoLidas > 0) {
      badge.textContent = naoLidas > 99 ? "99+" : naoLidas;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  function abrirPainel() {
    if (painelAberto) {
      fecharPainel();
      return;
    }
    painelAberto = true;

    overlayEl = document.createElement("div");
    overlayEl.className = "notif-overlay";
    overlayEl.addEventListener("click", fecharPainel);
    document.body.appendChild(overlayEl);

    painelEl = document.createElement("div");
    painelEl.className = "notif-painel";
    painelEl.innerHTML = `
            <div class="notif-painel-header">
                <span class="notif-painel-titulo">🔔 Notificações</span>
                <div class="notif-painel-acoes">
                    <button class="notif-btn-marcar-todas" onclick="window._notifMarcarTodas()">
                        Marcar todas como lidas
                    </button>
                    <button class="notif-btn-fechar" onclick="window._fecharNotifPainel()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="notif-lista"></div>
        `;
    document.body.appendChild(painelEl);

    painelEl.addEventListener("click", (e) => e.stopPropagation());

    requestAnimationFrame(() => painelEl.classList.add("aberto"));
    renderizarPainel();
  }

  function fecharPainel() {
    if (!painelAberto) return;
    painelAberto = false;
    if (painelEl) {
      painelEl.classList.remove("aberto");
      setTimeout(() => {
        painelEl?.remove();
        painelEl = null;
      }, 250);
    }
    overlayEl?.remove();
    overlayEl = null;
  }

  window._fecharNotifPainel = fecharPainel;
  window._notifMarcarLida = function (id) {
    marcarLida(id);
    atualizarBadge();
    renderizarPainel();
  };
  window._notifMarcarTodas = function () {
    marcarTodasLidas(alertasCarregados.map((a) => a.id));
    atualizarBadge();
    renderizarPainel();
  };

  async function inicializar() {
    injetarEstilos();

    const sidebar = document.querySelector(".sidebar-main");
    if (!sidebar) return;

    const btn = document.createElement("button");
    btn.className = "sidebar-notif-btn link-box";
    btn.title = "Notificações";
    btn.setAttribute("aria-label", "Abrir notificações");
    btn.innerHTML = `
            <img src="/assets/icons/notification-icon-no-fill.svg" alt="Notificações">
            <span>Notificações</span>
            <span class="sidebar-notif-badge">0</span>
        `;
    btn.addEventListener("click", abrirPainel);
    sidebar.appendChild(btn);

    alertasCarregados = await buscarAlertas();
    atualizarBadge();
  }

  function aguardarSidebar() {
    const sidebar = document.querySelector(".sidebar-main");
    if (sidebar) {
      inicializar();
    } else {
      setTimeout(aguardarSidebar, 100);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aguardarSidebar);
  } else {
    aguardarSidebar();
  }
})();
