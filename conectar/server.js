const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve interface em /conectar
app.use('/conectar', express.static(path.join(__dirname, 'public')));

function runCmd(cmd, res) {
  exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
    if (error) {
      res.json({ success: false, error: error.message, stdout, stderr });
    } else {
      res.json({ success: true, stdout, stderr });
    }
  });
}

// Lista dispositivos conectados (adb devices)
app.get('/conectar/api/devices', (req, res) => {
  runCmd('adb devices -l', res);
});

// Muda o daemon do dispositivo para tcpip (requer USB conectado ao dispositivo ou support local)
app.post('/conectar/api/tcpip', (req, res) => {
  const port = req.body.port || '5555';
  runCmd(`adb tcpip ${port}`, res);
});

// Conecta via IP:porta
app.post('/conectar/api/connect', (req, res) => {
  const ip = req.body.ip;
  const port = req.body.port || '5555';
  if (!ip) return res.status(400).json({ success: false, error: 'ip required' });
  runCmd(`adb connect ${ip}:${port}`, res);
});

// Desconecta
app.post('/conectar/api/disconnect', (req, res) => {
  const ip = req.body.ip;
  const port = req.body.port || '5555';
  if (!ip) return res.status(400).json({ success: false, error: 'ip required' });
  runCmd(`adb disconnect ${ip}:${port}`, res);
});

// Health
app.get('/conectar/api/ping', (req, res) => res.json({ success: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} — abra /conectar`));
