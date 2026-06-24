function toggleMenu() {

    const menu =
        document.getElementById("submenu");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    } else {

        menu.style.display = "block";

    }
}

window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    const scrollPercent = (scrollTop / scrollHeight) * 100;

    const scrollBar = document.getElementById("scroll-bar");
    if (scrollBar) {
        scrollBar.style.width = scrollPercent + "%";
    }
});

// ── Preservar scroll da sidebar entre navegações ──────────────────────────────
(function () {
    const STORAGE_KEY = "sidebarScrollTop";
    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    // Restaura a posição de scroll assim que o DOM estiver pronto
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
        sidebar.scrollTop = parseInt(saved, 10);
    }

    // Salva a posição antes de sair da página (clique em qualquer link da sidebar)
    sidebar.addEventListener("click", function (e) {
        const link = e.target.closest("a");
        if (link) {
            sessionStorage.setItem(STORAGE_KEY, sidebar.scrollTop);
        }
    });
})();

// Sidebar toggle (mobile): cria botão hamburger e overlay dinamicamente
(function () {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.tabIndex = -1;
    document.body.appendChild(overlay);

    // Criar botão toggle e inserir no navbar se existir, senão no body
    const toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
    toggle.setAttribute('aria-controls', 'sidebar');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '&#9776;'; // hamburger

    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.appendChild(toggle);
    else document.body.appendChild(toggle);

    // Marca a sidebar com id para aria-controls (se já não tiver)
    if (!sidebar.id) sidebar.id = 'sidebar';

    function openSidebar() {
        document.body.classList.add('sidebar-open');
        toggle.setAttribute('aria-expanded', 'true');
        // move focus to first link in sidebar
        const firstLink = sidebar.querySelector('a, button');
        if (firstLink) firstLink.focus();
    }

    function closeSidebar() {
        document.body.classList.remove('sidebar-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
    }

    toggle.addEventListener('click', function (e) {
        if (document.body.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener('click', function () {
        closeSidebar();
    });

    // Close on Escape
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    });

    // Close sidebar on navigation (click on sidebar link) to improve UX on mobile
    sidebar.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (link && window.innerWidth <= 768) {
            closeSidebar();
        }
    });
})();

