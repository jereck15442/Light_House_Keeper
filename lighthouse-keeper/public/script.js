const API_BASE = 'http://localhost:5000/api';

class LighthouseApp {
  constructor() {
    this.init();
  }

  async init() {
    await this.checkHealth();
    document
      .getElementById('logForm')
      .addEventListener('submit', (e) => this.submitLog(e));
    document
      .getElementById('lighthouseSelect')
      .addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.loadLogs();
      });
    this.loadLogs(); // Load default
  }

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      const card = document.getElementById('healthCard');
      card.querySelector('.status').textContent = '🟢 Live';
      card.querySelector('.status').className = 'status live';
    } catch (error) {
      document
        .getElementById('healthCard')
        .querySelector('.status').textContent = '🔴 Error';
      document.getElementById('healthCard').querySelector('.status').className =
        'status error';
    }
  }

  async submitLog(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('logResult');

    const logData = {
      lighthouse: document.getElementById('lighthouse').value,
      visibilityNM: parseFloat(document.getElementById('visibility').value),
      windSpeedKnots:
        parseFloat(document.getElementById('windSpeed').value) || 0,
      fog: document.getElementById('fog').checked,
      keeper: document.getElementById('keeper').value,
      notes: document.getElementById('notes').value,
    };

    try {
      resultDiv.className = 'success';
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });
      const data = await res.json();
      resultDiv.textContent = `✅ Log Saved! ID: ${data.id}`;
      this.loadLogs(); // Refresh logs
    } catch (error) {
      resultDiv.className = 'error';
      resultDiv.textContent = `❌ Error: ${error.message}`;
    }
  }

  async loadLogs() {
    const lighthouse =
      document.getElementById('lighthouseSelect').value || 'Cape Hatteras';
    document.getElementById('currentLighthouse').textContent = lighthouse;

    try {
      const res = await fetch(
        `${API_BASE}/logs/${encodeURIComponent(lighthouse)}`
      );
      const logs = await res.json();

      const container = document.getElementById('logsContainer');
      if (logs.length === 0) {
        container.innerHTML = '<div class="no-data">No logs found</div>';
        return;
      }

      container.innerHTML = logs
        .map(
          (log) => `
        <div class="log-item ${
          log.visibilityNM < 3 || log.fog ? 'critical' : ''
        }">
          <h4>${log.lighthouse}</h4>
          <div class="log-meta">
            ${new Date(log.createdAt).toLocaleString()} | ${log.keeper}
          </div>
          <div class="log-data">
            <span>👁️ ${log.visibilityNM} NM</span>
            ${
              log.windSpeedKnots
                ? `<span>💨 ${log.windSpeedKnots} knots</span>`
                : ''
            }
            ${log.fog ? '<span>🌫️ Fog</span>' : ''}
            <span>💡 ${log.equipmentStatus?.light || 'Unknown'}</span>
          </div>
          ${log.notes ? `<p><em>${log.notes}</em></p>` : ''}
        </div>
      `
        )
        .join('');
    } catch (error) {
      document.getElementById(
        'logsContainer'
      ).innerHTML = `<div class="no-data">Error loading logs: ${error.message}</div>`;
    }
  }
}

// Initialize app
new LighthouseApp();
