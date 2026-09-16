const fs = require('fs');
const path = require('path');
const os = require('os');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function donutChart(passed, failed) {
  const total = passed + failed;
  const passPct = total > 0 ? (passed / total) * 100 : 0;
  const passColor = '#2ecc71';
  const failColor = '#e74c3c';
  const gradient = total > 0
    ? `conic-gradient(${passColor} 0% ${passPct}%, ${failColor} ${passPct}% 100%)`
    : '#e0e0e0';
  return `<div class="donut" style="background:${gradient}"><div class="donut-hole"><span>${Math.round(passPct)}%</span></div></div>`;
}

class ExtentReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'reports/extent/index.html';
    this.tests = [];
  }

  onBegin() {
    this.startTime = new Date();
  }

  onTestEnd(test, result) {
    this.tests.push({
      title: test.title,
      file: path.relative(process.cwd(), test.location.file),
      status: result.status,
      duration: result.duration,
      steps: (result.steps || []).filter((step) => step.category === 'test.step'),
      error: result.error && result.error.message,
    });
  }

  onEnd() {
    this.endTime = new Date();
    this.writeReport();
  }

  writeReport() {
    const passedTests = this.tests.filter((t) => t.status === 'passed');
    const failedTests = this.tests.filter((t) => t.status !== 'passed');

    const allSteps = this.tests.flatMap((t) => t.steps);
    const passedSteps = allSteps.filter((s) => !s.error);
    const failedSteps = allSteps.filter((s) => s.error);

    const totalDurationMs = this.tests.reduce((sum, t) => sum + t.duration, 0);
    const passPercent = this.tests.length > 0
      ? Math.round((passedTests.length / this.tests.length) * 100)
      : 0;

    const environment = {
      'User Name': (() => {
        try { return os.userInfo().username; } catch { return 'unknown'; }
      })(),
      OS: `${os.type()} ${os.release()}`,
      'Node Version': process.version,
      'Base URL': process.env.BASE_URL || 'http://localhost:3000',
    };

    const testRows = this.tests.map((t) => `
      <tr class="${t.status === 'passed' ? 'row-pass' : 'row-fail'}">
        <td>${escapeHtml(t.title)}</td>
        <td>${escapeHtml(t.file)}</td>
        <td>${t.status === 'passed' ? 'Pass' : 'Fail'}</td>
        <td>${formatDuration(t.duration)}</td>
        <td>${t.error ? escapeHtml(t.error) : ''}</td>
      </tr>`).join('');

    const envRows = Object.entries(environment).map(([key, value]) => `
      <tr><td>${escapeHtml(key)}</td><td>${escapeHtml(value)}</td></tr>`).join('');

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Automation Report</title>
<style>
  body { margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #f4f6f8; color: #1f2933; }
  .topbar { background: #1f2933; color: #fff; padding: 14px 24px; font-size: 18px; font-weight: 600; }
  .content { padding: 24px; }
  .cards { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }
  .card { background: #fff; border-radius: 6px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; min-width: 160px; }
  .card .label { font-size: 13px; color: #7b8794; }
  .card .value { font-size: 28px; font-weight: 700; margin-top: 6px; }
  .card.start { background: #2ecc71; color: #fff; }
  .card.end { background: #e74c3c; color: #fff; }
  .panels { display: flex; flex-wrap: wrap; gap: 16px; }
  .panel { background: #fff; border-radius: 6px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; min-width: 260px; }
  .panel h3 { margin: 0 0 12px; font-size: 15px; }
  .donut-wrap { display: flex; align-items: center; gap: 20px; }
  .donut { width: 140px; height: 140px; border-radius: 50%; position: relative; }
  .donut-hole { position: absolute; inset: 22px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; }
  .legend span { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; }
  .legend .pass { background: #2ecc71; }
  .legend .fail { background: #e74c3c; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
  tr.row-pass td:nth-child(3) { color: #2ecc71; font-weight: 600; }
  tr.row-fail td:nth-child(3) { color: #e74c3c; font-weight: 600; }
</style>
</head>
<body>
  <div class="topbar">Automation Report</div>
  <div class="content">
    <div class="cards">
      <div class="card"><div class="label">Total Tests</div><div class="value">${this.tests.length}</div></div>
      <div class="card"><div class="label">Total Steps</div><div class="value">${allSteps.length}</div></div>
      <div class="card"><div class="label">Total Time Taken</div><div class="value">${formatDuration(totalDurationMs)}</div></div>
      <div class="card start"><div class="label">Start</div><div class="value">${this.startTime.toLocaleString()}</div></div>
      <div class="card end"><div class="label">End</div><div class="value">${this.endTime.toLocaleString()}</div></div>
    </div>
    <div class="panels">
      <div class="panel">
        <h3>Tests View</h3>
        <div class="donut-wrap">
          ${donutChart(passedTests.length, failedTests.length)}
          <div class="legend">
            <div><span class="pass"></span>${passedTests.length} passed</div>
            <div><span class="fail"></span>${failedTests.length} failed</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <h3>Steps View</h3>
        <div class="donut-wrap">
          ${donutChart(passedSteps.length, failedSteps.length)}
          <div class="legend">
            <div><span class="pass"></span>${passedSteps.length} passed</div>
            <div><span class="fail"></span>${failedSteps.length} failed</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <h3>Pass Percentage</h3>
        <div style="font-size:40px;font-weight:700;text-align:center;padding:20px 0;">${passPercent}%</div>
      </div>
      <div class="panel">
        <h3>Environment</h3>
        <table>${envRows}</table>
      </div>
    </div>
    <div class="panel" style="margin-top:16px;">
      <h3>Tests</h3>
      <table>
        <thead><tr><th>Title</th><th>File</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead>
        <tbody>${testRows}</tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    fs.writeFileSync(this.outputFile, html);
  }
}

module.exports = ExtentReporter;
