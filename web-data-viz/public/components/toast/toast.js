const TOAST_ICONS = {
    success: '✓',
    danger:  '✕',
    warning: '⚠',
    info:    'ℹ'
};

function showToast(type = 'info', title = '', desc = '', duration = 4000) {
    const viewport = document.getElementById('toast-viewport');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${TOAST_ICONS[type]}</span>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
        </div>
        <button class="toast-close" onclick="removeToast(this.closest('.toast'))">✕</button>
        <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
    `;

    viewport.appendChild(toast);
    const timer = setTimeout(() => removeToast(toast), duration);
    toast.dataset.timer = timer;
}

function removeToast(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    clearTimeout(toast.dataset.timer);
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
}