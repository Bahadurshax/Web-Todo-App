const theme_toggle = document.querySelector('[data-btn="theme-toggle"]');

theme_toggle.addEventListener('click', () => {
    const current_theme = document.body.className;
    const theme = (current_theme === 'light') ? 'dark' : 'light';

    setTheme(theme);
});


function setTheme(theme) {
    document.body.className = theme;
}

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: isDark }) => {
        const theme = isDark ? 'dark' : 'light';
        setTheme(theme);
    })