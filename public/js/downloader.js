const dlMeta = {
  instagram: { title: '📸 Instagram Downloader', placeholder: 'Tempel link postingan/reel Instagram...' },
  tiktok:    { title: '🎵 TikTok Downloader', placeholder: 'Tempel link video TikTok...' },
  youtube:   { title: '▶️ YouTube Downloader', placeholder: 'Tempel link video YouTube...' }
};

let currentPlatform = null;

function openDownloader(platform){
  currentPlatform = platform;
  const meta = dlMeta[platform] || { title: 'Downloader', placeholder: 'Tempel link di sini...' };

  document.getElementById('dlTitle').textContent = meta.title;
  const input = document.getElementById('dlUrl');
  input.placeholder = meta.placeholder;
  input.value = '';
  document.getElementById('dlResult').textContent = '';

  document.getElementById('overlayDownloader').classList.remove('hidden');
}

function closeDownloader(){
  currentPlatform = null;
}

async function submitDownload(){
  const url = document.getElementById('dlUrl').value.trim();
  const resultEl = document.getElementById('dlResult');
  const btn = document.getElementById('dlSubmit');

  if (!url){
    resultEl.innerHTML = '<div class="dl-msg">Isi link-nya dulu ya.</div>';
    return;
  }

  resultEl.innerHTML = '<div class="dl-msg">⏳ Memproses...</div>';
  btn.style.opacity = '0.6';
  btn.style.pointerEvents = 'none';

  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: currentPlatform, url })
    });
    const data = await res.json();

    if (data.ok && data.data) {
      const d = data.data;
      resultEl.innerHTML = `
        <div class="dl-card">
          ${d.cover ? `<img class="dl-cover" src="${d.cover}">` : ''}
          <div class="dl-card-body">
            ${d.title ? `<div class="dl-title">${d.title}</div>` : ''}
            <div class="dl-author">
              <i data-lucide="user-round"></i> @${d.unique_id || d.author || '-'}
            </div>
            <div class="dl-actions">
              ${d.video ? `<a href="${d.video}" target="_blank" class="dl-action-btn"><i data-lucide="video"></i> Download Video</a>` : ''}
              ${d.audio ? `<a href="${d.audio}" target="_blank" class="dl-action-btn secondary"><i data-lucide="music"></i> Download Audio</a>` : ''}
            </div>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    } else {
      resultEl.innerHTML = `<div class="dl-msg error">${data.message || 'Gagal memproses link.'}</div>`;
    }
  } catch (err) {
    resultEl.innerHTML = '<div class="dl-msg error">Terjadi kesalahan saat menghubungi server.</div>';
  } finally {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  }
}

document.getElementById('dlSubmit').addEventListener('click', submitDownload);