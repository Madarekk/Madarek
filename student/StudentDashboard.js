function setupSidebarToggle() {
    const sidebar = document.querySelector('.student-sidebar');
    const header = document.querySelector('.student-header');
    const main = document.querySelector('.student-main');
    const toggle = document.getElementById('sidebarToggle');
    if (!toggle) return;
    toggle.onclick = function() {
        sidebar.classList.toggle('sidebar-collapsed');
        header.classList.toggle('sidebar-collapsed');
        toggle.classList.toggle('sidebar-collapsed');
        if (main) main.classList.toggle('sidebar-collapsed');
    };
}

window.onload = function() {
    setupSidebarToggle();
}
