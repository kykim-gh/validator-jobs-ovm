module.exports = {
  apps: [{
    name: 'obol-validator-jobs',
    script: 'npm',
    args: 'run dev',
    cwd: '/root/validator-jobs-ovm',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    log_file: '/var/log/pm2/obol-validator-jobs.log',
    out_file: '/var/log/pm2/obol-validator-jobs-out.log',
    error_file: '/var/log/pm2/obol-validator-jobs-error.log',
    time: true
  }]
};
