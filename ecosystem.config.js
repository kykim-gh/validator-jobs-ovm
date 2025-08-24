module.exports = {
  apps: [{
    name: 'obol-demo',
    script: 'npm',
    args: 'start',
    cwd: '/root/validator-jobs-ovm',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    max_restarts: 5,
    min_uptime: '10s',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    log_file: '/var/log/pm2/obol-validator-jobs.log',
    out_file: '/var/log/pm2/obol-validator-jobs-out.log',
    error_file: '/var/log/pm2/obol-validator-jobs-error.log',
    time: true
  }]
};
