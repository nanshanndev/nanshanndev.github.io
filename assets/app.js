import { createComponent, registerBehavior } from 'nanshann';
import preferences from '../behaviors/preferences.js';

const failure = document.getElementById('site-failure');
function fail(error) {
  failure.hidden = false;
  failure.textContent = document.documentElement.lang === 'en' ? 'The page could not load. Please refresh to try again.' : '页面加载失败，请刷新重试。';
  document.documentElement.dataset.siteReady = 'false';
  console.error('nanshann website initialization failed', error);
}
document.addEventListener('ns-error', event => fail(event.detail));
try {
  registerBehavior('preferences', preferences);
  await Promise.all(['header', 'footer', 'search', 'counter'].map(name => createComponent(`site-${name}`, `/components/${name}.html`)));
} catch (error) { fail(error); }
