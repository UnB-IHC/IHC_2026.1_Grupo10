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

