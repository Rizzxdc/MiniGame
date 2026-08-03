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

  if (!url){
    resultEl.textContent = 'Isi link-nya dulu ya.';
    return;
  }

  resultEl.textContent = 'Memproses...';

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
        ${d.cover ? `<img src="${d.cover}" style="width:100%;border-radius:12px;margin-bottom:8px;">` : ''}
        <div style="font-weight:700;margin-bottom:2px;">${d.title || ''}</div>
        <div style="color:var(--muted);font-size:12px;margin-bottom:8px;">oleh @${d.unique_id || d.author || '-'}</div>
        ${d.video ? `<a href="${d.video}" target="_blank" style="color:var(--accent);display:block;margin-bottom:4px;">⬇️ Download Video</a>` : ''}
        ${d.audio ? `<a href="${d.audio}" target="_blank" style="color:var(--accent);display:block;">⬇️ Download Audio</a>` : ''}
      `;
    } else {
      resultEl.textContent = data.message || 'Gagal memproses link.';
    }
  } catch (err) {
    resultEl.textContent = 'Terjadi kesalahan saat menghubungi server.';
  }
}

document.getElementById('dlSubmit').addEventListener('click', submitDownload);
