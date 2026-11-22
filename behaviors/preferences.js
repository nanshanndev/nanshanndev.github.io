import { createState, navigate } from 'nanshann';
export default function preferences() {
  const state = createState({ theme: document.documentElement.dataset.theme, locale: document.documentElement.dataset.locale });
  function save(key, value) { try { localStorage.setItem(key, value); } catch { /* Preferences remain usable without storage. */ } }
  return { state, actions: {
    toggleTheme() {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = state.theme;
      document.querySelector('meta[name="theme-color"]').content = state.theme === 'dark' ? '#08090c' : '#f8fafc';
      save('nanshann-theme', state.theme);
    },
    changeLanguage() {
      const url = new URL(location.href);
      url.searchParams.set('lang', state.locale === 'en' ? 'zh' : 'en');
      navigate(url);
    },
    syncLanguage(search) {
      const requested = new URLSearchParams(search).get('lang');
      if (['zh', 'en'].includes(requested)) state.locale = requested;
      document.documentElement.lang = state.locale === 'en' ? 'en' : 'zh-CN';
      document.documentElement.dataset.locale = state.locale;
      save('nanshann-language', state.locale);
    },
  } };
}
