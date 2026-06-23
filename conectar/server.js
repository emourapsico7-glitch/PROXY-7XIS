const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec, spawn } = require('child_process');
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

// Emparelhamento (Android 11+ Wireless Debugging)
// Recebe { ip, port (optional), code (optional) }
app.post('/conectar/api/pair', (req, res) => {
  const ip = req.body.ip;
  const port = req.body.port; // optional
  const code = req.body.code; // optional
  if (!ip) return res.status(400).json({ success: false, error: 'ip required' });
  const address = port ? `${ip}:${port}` : ip;

  // If code provided, spawn adb pair and write the code to stdin (works with recent platform-tools)
  if (code) {
    try {
      const child = spawn('adb', ['pair', address]);
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });

      child.on('error', (err) => {
        res.json({ success: false, error: err.message, stdout, stderr });
      });

      child.on('close', (codeExit) => {
        res.json({ success: true, stdout, stderr, exitCode: codeExit });
      });

      // send code to stdin then end
      child.stdin.write(String(code) + '\n');
      child.stdin.end();
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  } else {
    // No code given — just run the command and return its output
    runCmd(`adb pair ${address}`, res);
  }
});

// Health
app.get('/conectar/api/ping', (req, res) => res.json({ success: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} — abra /conectar`));
