// Runs before CSS to restore the theme without a light-frame flash.
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const requested = new URLSearchParams(location.search).get('lang');
  const saved = read('nanshann-language');
  const locale = ['zh', 'en'].includes(requested) ? requested : ['zh', 'en'].includes(saved) ? saved : 'en';
  const savedTheme = read('nanshann-theme');
  const theme = ['dark', 'light'].includes(savedTheme) ? savedTheme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.locale = locale;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#08090c' : '#f8fafc';
})();
