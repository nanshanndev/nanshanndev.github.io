import { attribute, Signal } from 'nanshann';
import { common, href, localeOf, repository } from '../content/catalog.js';
export const localized = { locale: attribute('zh') };
export function pageState(ctx) {
  const locale = localeOf(ctx);
  return { locale, t: common[locale], repository, links: Object.fromEntries(Object.entries({ home: '/', docs: '/docs/', blog: '/blog/', components: '/ecosystem/components.html', showcase: '/ecosystem/showcase.html', about: '/about/' }).map(([key, path]) => [key, href(path, locale)])) };
}
export function dispatch(host, type, detail) { host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true })); }
export function attachCopy(ctx, root, getLocale) {
  const resets = new Set();
  let disposed = false;
  const click = async event => {
    const button = event.composedPath().find(node => node instanceof HTMLButtonElement && node.hasAttribute('data-copy'));
    if (!button) return;
    const contentRoot = button.getRootNode();
    const text = button.dataset.copyText ?? contentRoot.getElementById(button.dataset.copy)?.textContent;
    if (!text) return;
    const label = button.querySelector('[data-copy-label]') || button;
    try {
      await navigator.clipboard.writeText(text);
      if (disposed) return;
      label.textContent = common[getLocale()].copied;
    } catch {
      if (disposed) return;
      label.textContent = common[getLocale()].copyFailed;
      const target = contentRoot.getElementById(button.dataset.copy);
      if (target) { const range = document.createRange(); range.selectNodeContents(target); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
    }
    const timer = setTimeout(() => { resets.delete(timer); if (!disposed) label.textContent = common[getLocale()].copy; }, 2500);
    resets.add(timer);
  };
  root.addEventListener('click', click);
  ctx.onDispose(() => { disposed = true; root.removeEventListener('click', click); for (const timer of resets) clearTimeout(timer); });
}
export function escapeHtml(text) { return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
export function highlight(code) {
  return code.split('\n').map(line => {
    if (line.trim().startsWith('<!--') || line.trim().startsWith('//')) return `<span class="token-comment">${escapeHtml(line)}</span>`;
    return escapeHtml(line).replace(/(&lt;\/?[\w-]+|&lt;\/script&gt;)/g, '<span class="token-tag">$1</span>').replace(/(&quot;.*?&quot;)/g, '<span class="token-string">$1</span>');
  }).join('\n');
}
export function scrollToAnchor({ behavior = 'auto' } = {}) {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (!id) return;
  function find(root) {
    const target = root.getElementById?.(id);
    if (target) return target;
    for (const element of root.querySelectorAll('*')) if (element.shadowRoot) { const result = find(element.shadowRoot); if (result) return result; }
  }
  const target = find(document);
  if (target) { target.scrollIntoView({ block: 'start', behavior }); if (id === 'main') target.focus({ preventScroll: true }); }
}

// Project explicit inputs into translated state without replacing the component instance.
export function localize(ctx, render) {
  const snapshot = new Signal.Computed(() => render(pageState(ctx)));
  return Object.defineProperties({}, Object.fromEntries(Object.keys(snapshot.get()).map(key =>
    [key, { enumerable: true, get: () => snapshot.get()[key] }])));
}

export async function readyContent(host, active) {
  await customElements.whenDefined(host.localName);
  while (active() && host.isConnected) {
    const ready = host.ready;
    await ready;
    if (!active() || !host.isConnected) return;
    if (ready !== host.ready) continue;
    const children = [...(host.shadowRoot?.querySelectorAll('site-header, site-footer, site-search, site-counter, ns-include') || [])];
    await Promise.all(children.map(child => readyContent(child, active)));
    if (ready === host.ready) return;
  }
}

// This website owns its completion event; framework ready remains local to each host.
export function pageReady(ctx) {
  let generation = 0;
  let disposed = false;
  ctx.onDispose(() => { disposed = true; generation++; });
  ctx.onMount(host => {
    ctx.subscribe(new Signal.Computed(() => JSON.stringify([
      ctx.route.pathname, ctx.route.search, ctx.route.hash, ctx.attributes.locale.get(),
    ])), () => {
      const current = ++generation;
      const url = location.href;
      const active = () => !disposed && current === generation && host.isConnected && location.href === url;
      void readyContent(host, active).then(() => {
        if (active()) dispatch(host, 'page-ready', { url });
      }).catch(error => {
        if (active()) dispatch(host, 'ns-error', error);
      });
    });
  });
}
