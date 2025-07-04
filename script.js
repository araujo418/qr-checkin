let guests = {}, totalGuests = 0, usedGuests = 0, override = false;
const STORAGE_KEY = 'invitesDigitaisEventData', PASS = '2025Invites';
let fullscreenScanner = null, scannerLocked = false;

window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('splash').style.display = 'none', 3500);
  loadState();
});

function showScanStatus(status, name, type){
  scannerLocked = true;
  document.getElementById('qrStatus').textContent = status;
  document.getElementById('qrGuestName').textContent = name;
  document.getElementById('qrStatus').style.color = type === 'success' ? '#38a169' : '#e53e3e';
  document.getElementById('qrStatus').style.opacity = '1';
  document.getElementById('qrGuestName').style.opacity = '1';
  document.getElementById('nextBtn').style.display = 'block';
}

function enableNextScan(){
  document.getElementById('qrStatus').style.opacity = '0';
  document.getElementById('qrGuestName').style.opacity = '0';
  document.getElementById('nextBtn').style.display = 'none';
  scannerLocked = false;
}

function verify(code) {
  if (!code) return;
  if (!guests[code])
    return showScanStatus('CÓDIGO INEXISTENTE', '', 'error');

  if (guests[code].usado && !override)
    return showScanStatus('USADO', guests[code].nome, 'error');

  guests[code].usado = true;
  usedGuests++;
  showScanStatus('PERMITIDO', guests[code].nome, 'success');

  saveState();
  updateProgress();
  document
    .querySelector(`[data-code="${code}"] .check`)
    ?.classList.add('checked');
}

function startFullscreenScanner() {
  document.getElementById('qrFullscreen').style.display = 'flex';

  if (!fullscreenScanner) {
    fullscreenScanner = new Html5Qrcode('qrViewFull');
  }

  fullscreenScanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 300 },
    txt => {
      if (!scannerLocked) verify(txt);
    },
    () => {}
  );
}

function closeFullscreen() {
  if (fullscreenScanner) {
    fullscreenScanner
      .stop()
      .then(() => fullscreenScanner.clear())
      .then(() => (fullscreenScanner = null));
  }
  document.getElementById('qrFullscreen').style.display = 'none';
  enableNextScan();
}

function openTab(id) {
  document.querySelectorAll('.tab').forEach(e => e.classList.remove('active'));
  document
    .querySelectorAll('.tabcontent')
    .forEach(e => e.classList.remove('active'));

  document.querySelector(`.tab[onclick*="${id}"]`).classList.add('active');
  document.getElementById(id).classList.add('active');
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ guests, totalGuests, usedGuests })
  );
}

function loadState() {
  const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (d.guests) {
    guests = d.guests;
    totalGuests = d.totalGuests || 0;
    usedGuests = d.usedGuests || 0;

    Object.keys(guests).forEach(c =>
      addToList(c, guests[c].nome, guests[c].usado)
    );

    if (totalGuests > 0) showProgress();
  }

  if (localStorage.getItem('clienteTxtImportado') === 'true') {
    document.getElementById('clienteUploadBtn').style.display = 'none';
  }
}

function importTxt(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    guests = {};
    totalGuests = 0;
    usedGuests = 0;
    document.getElementById('guestList').innerHTML = '';

    ev.target.result
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach(l => {
        const [code, name] = l.split(/[,:;\t]+/);
        if (code) {
          addToList(code.trim(), (name || 'Convidado').trim());
          totalGuests++;
        }
      });

    showProgress();
    saveState();
    alert('Lista carregada!');
    e.target.value = '';
  };
  reader.readAsText(file);
}

function clienteImportTxt(e) {
  importTxt(e);
  localStorage.setItem('clienteTxtImportado', 'true');
  document.getElementById('clienteUploadBtn').style.display = 'none';
}

function addManual() {
  const code = document.getElementById('newCode').value.trim();
  const name = document.getElementById('newName').value.trim();

  if (!code || !name) return alert('Preencha ambos os campos.');
  if (guests[code]) return alert('Código já existe.');

  addToList(code, name);
  totalGuests++;
  showProgress();
  saveState();
}

function addToList(code, nome, usado = false) {
  if (document.querySelector(`[data-code="${code}"]`)) return;

  const li = document.createElement('li');
  li.dataset.code = code;
  li.innerHTML = `
    <span class="check ${usado ? 'checked' : ''}"></span>
    <span>${nome}</span>
  `;
  document.getElementById('guestList').appendChild(li);
  guests[code] = { nome, usado };
}

function showProgress() {
  document.getElementById('guestList').style.display = 'block';
  document.getElementById('progressContainer').style.display = 'block';
  updateProgress();
}

function updateProgress() {
  const pct = Math.round((usedGuests / totalGuests) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent =
    `${usedGuests} / ${totalGuests}`;
}

function toggleOverride() {
  override = !override;
  alert('Modo override ' + (override ? 'ativado' : 'desativado'));
}

function adminLogin() {
  if (prompt('Código de administrador:') === PASS) {
    openTab('admin');
    document.getElementById('fileInput').style.display = 'block';
    document.getElementById('adminAddSection').style.display = 'block';
    document.getElementById('overrideBtn').style.display = 'block';
  } else {
    alert('Código incorreto');
  }
}

function exportUsedGuests() {
  let content = '';
  for (const [code, info] of Object.entries(guests)) {
    if (info.usado) content += `${code},${info.nome}\n`;
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'convidados_usados.txt';
  link.click();
}

// nova função para carregar do link e esconder o campo depois
function loadWeTransfer() {
  const link = document.getElementById('weTransferLink').value.trim();
  if (!link) {
    alert('Por favor, insira um link válido.');
    return;
  }

  fetch(link)
    .then(response => {
      if (!response.ok) throw new Error('Falha ao baixar o arquivo.');
      return response.text();
    })
    .then(text => {
      guests = {};
      totalGuests = 0;
      usedGuests = 0;
      document.getElementById('guestList').innerHTML = '';

      text
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach(l => {
          const [code, name] = l.split(/[,:;\t]+/);
          if (code) {
            addToList(code.trim(), (name || 'Convidado').trim());
            totalGuests++;
          }
        });

      showProgress();
      saveState();
      alert('Lista carregada com sucesso!');
      document.getElementById('scanBtn').disabled = false;

      // esconder o campo e botão de link
      document.getElementById('weTransferLink').style.display = 'none';
      document.getElementById('loadWeTransferBtn').style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao carregar a lista. Verifique o link.');
    });
}
