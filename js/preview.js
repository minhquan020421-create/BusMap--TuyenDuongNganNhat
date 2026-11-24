(() => {
  const params = new URLSearchParams(location.search);
  const previousLinks = {map: ['near'], directions: ['from', 'to'], routes: ['id']};
  const entryParameters = previousLinks[document.body.dataset.page] ?? [];
  if (params.get('demo') !== '1' && !entryParameters.some(key => params.has(key))) return;
  const app = document.getElementById('app');
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  async function openDemo() {
    app.setAttribute('aria-busy', 'true');
    const status = document.querySelector('.waiting p');
    status.textContent = 'Đang mở mạng trạm minh họa…';
    const leaflet = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet';
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = leaflet + '.css';
    const stylesReady = new Promise(resolve => { css.onload = () => resolve(true); css.onerror = () => resolve(false); });
    document.head.append(css);
    // Use the existing offline renderer when map resources cannot load promptly.
    const mapsReady = Promise.all([stylesReady, loadScript(leaflet + '.js')]).then(([ok]) => ok).catch(() => false);
    try {
      await loadScript('data/network.js');
      await loadScript('js/graph.js');
      await loadScript('js/map.js');
      const ready = await Promise.race([mapsReady, new Promise(resolve => setTimeout(() => resolve(false), 1200))]);
      document.body.dataset.offlineMap = String(!ready);
      await loadScript('js/app.js');
    } catch {
      status.textContent = 'Chưa tải được bản minh họa. Hãy tải lại trang để thử lại.';
    } finally { app.removeAttribute('aria-busy'); }
  }
  openDemo();
})();
