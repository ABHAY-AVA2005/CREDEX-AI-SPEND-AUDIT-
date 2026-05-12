(function() {
  const container = document.getElementById('fluxora-audit-widget');
  if (!container) return;

  const baseUrl = document.currentScript.src.replace('/fluxora-widget.js', '');
  
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/widget`;
  iframe.style.width = '100%';
  iframe.style.height = '450px';
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.scrolling = 'no';
  
  container.appendChild(iframe);
})();
