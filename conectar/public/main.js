async function post(path, body){
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

document.getElementById('tcpip-btn').addEventListener('click', async ()=>{
  const port = document.getElementById('tcpip-port').value || '5555';
  document.getElementById('out').textContent = 'Executando adb tcpip...';
  const r = await post('/conectar/api/tcpip', { port });
  document.getElementById('out').textContent = JSON.stringify(r, null, 2);
});

document.getElementById('connect-btn').addEventListener('click', async ()=>{
  const ip = document.getElementById('ip').value.trim();
  const port = document.getElementById('port').value || '5555';
  if(!ip){ alert('Informe o IP do dispositivo'); return; }
  document.getElementById('out').textContent = `Conectando ${ip}:${port} ...`;
  const r = await post('/conectar/api/connect', { ip, port });
  document.getElementById('out').textContent = JSON.stringify(r, null, 2);
});

document.getElementById('disconnect-btn').addEventListener('click', async ()=>{
  const ip = document.getElementById('ip').value.trim();
  const port = document.getElementById('port').value || '5555';
  if(!ip){ alert('Informe o IP do dispositivo'); return; }
  document.getElementById('out').textContent = `Desconectando ${ip}:${port} ...`;
  const r = await post('/conectar/api/disconnect', { ip, port });
  document.getElementById('out').textContent = JSON.stringify(r, null, 2);
});

document.getElementById('list-btn').addEventListener('click', async ()=>{
  document.getElementById('devices-out').textContent = 'Listando...';
  const res = await fetch('/conectar/api/devices');
  const j = await res.json();
  document.getElementById('devices-out').textContent = JSON.stringify(j, null, 2);
});
