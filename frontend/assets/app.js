const defaultApiBase = localStorage.getItem('gpsjr-api-base') || 'http://localhost:3000';
const apiInput = document.querySelector('#apiBase');
const saveApiButton = document.querySelector('#saveApi');
const deviceCount = document.querySelector('#deviceCount');
const positionCount = document.querySelector('#positionCount');
const positionList = document.querySelector('#positionList');

apiInput.value = defaultApiBase;

const map = L.map('map').setView([-14.235, -51.9253], 4);
const markers = new Map();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

saveApiButton.addEventListener('click', () => {
  localStorage.setItem('gpsjr-api-base', apiInput.value.replace(/\/$/, ''));
  location.reload();
});

function apiBase() {
  return apiInput.value.replace(/\/$/, '');
}

async function fetchJson(path) {
  const response = await fetch(`${apiBase()}${path}`);

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${path}`);
  }

  return response.json();
}

function upsertMarker(position) {
  const latLng = [Number(position.latitude), Number(position.longitude)];
  const key = position.deviceUniqueId || position.deviceId;
  const label = position.deviceName || position.deviceUniqueId || `Dispositivo ${position.deviceId}`;

  if (!markers.has(key)) {
    markers.set(key, L.marker(latLng).addTo(map));
  }

  markers.get(key).setLatLng(latLng).bindPopup(`<strong>${label}</strong><br>${latLng.join(', ')}`);
}

function renderPositions(positions) {
  positionCount.textContent = String(positions.length);
  positionList.innerHTML = '';

  for (const position of positions.slice(0, 12)) {
    upsertMarker(position);

    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${position.deviceName || position.deviceUniqueId}</strong>
      ${Number(position.latitude).toFixed(5)}, ${Number(position.longitude).toFixed(5)}
    `;
    positionList.appendChild(item);
  }

  if (positions.length > 0) {
    const latest = positions[0];
    map.setView([Number(latest.latitude), Number(latest.longitude)], Math.max(map.getZoom(), 12));
  }
}

async function refresh() {
  try {
    const [devices, positions] = await Promise.all([
      fetchJson('/api/devices'),
      fetchJson('/api/positions/latest?limit=100')
    ]);

    deviceCount.textContent = String(devices.data.length);
    renderPositions(positions.data);
  } catch (error) {
    console.error(error);
  }
}

function connectRealtime() {
  const url = new URL(apiBase());
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws';

  const socket = new WebSocket(url);

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'position.created') {
      refresh();
    }
  });

  socket.addEventListener('close', () => {
    setTimeout(connectRealtime, 3000);
  });
}

refresh();
connectRealtime();

