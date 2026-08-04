const dlMeta = {
  instagram: {
    title: '📸 Instagram Downloader',
    placeholder: 'Tempel link postingan/reel Instagram...',
    tip: '💡 Tempel tautan postingan/reel Instagram di bawah untuk mengunduhnya!',
    icon: '<i data-lucide="instagram"></i>'
  },
  tiktok: {
    title: '🎵 TikTok Downloader',
    placeholder: 'Tempel link video TikTok...',
    tip: '💡 Tempel tautan video TikTok di bawah untuk mengunduhnya tanpa watermark!',
    icon: '<i data-lucide="music-2"></i>'
  },
  youtube: {
    title: '▶️ YouTube Downloader',
    placeholder: 'Tempel link video YouTube...',
    tip: '💡 Tempel tautan video YouTube di bawah untuk mengunduhnya!',
    icon: '<i data-lucide="youtube"></i>'
  }
};

let currentPlatform = null;

function openDownloader(platform){
  currentPlatform = platform;
  const meta = dlMeta[platform] || { title: 'Downloader', placeholder: 'Tempel link di sini...', tip: '💡 Tempel link di bawah untuk mulai.', icon: '' };

  document.getElementById('dlTitle').textContent = meta.title;
  document.getElementById('dlTip').textContent = meta.tip;
  document.getElementById('dlInputIcon').innerHTML = meta.icon;

  const input = document.getElementById('dlUrl');
  input.placeholder = meta.placeholder;
  input.value = '';
  document.getElementById('dlResult').innerHTML = '';

  document.getElementById('overlayDownloader').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
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
          <div class="dl-card-head">
            <div class="dl-author">@${d.unique_id || d.author || '-'}</div>
            ${d.title ? `<div class="dl-caption">${d.title}</div>` : ''}
          </div>
          ${d.video ? `<video class="dl-video" controls playsinline ${d.cover ? `poster="${d.cover}"` : ''}><source src="${d.video}" type="video/mp4"></video>` : (d.cover ? `<img class="dl-cover" src="${d.cover}">` : '')}
          <div class="dl-actions">
            ${d.video ? `<a href="/api/proxy-download?url=${encodeURIComponent(d.video)}&filename=${encodeURIComponent(d.unique_id || 'video')}&type=video" class="dl-action-btn"><i data-lucide="download"></i> Download Video</a>` : ''}
            ${d.audio ? `<a href="/api/proxy-download?url=${encodeURIComponent(d.audio)}&filename=${encodeURIComponent((d.unique_id || 'audio') + '-audio')}&type=audio" class="dl-action-btn secondary"><i data-lucide="music"></i> Download Musik (MP3)</a>` : ''}
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