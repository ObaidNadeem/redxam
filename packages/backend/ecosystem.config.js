const SUFFIX = process.argv.indexOf('--env') === -1 ? '' :
  '-' + process.argv[process.argv.indexOf('--env')+1];


module.exports = {
  apps: [
    {
      name: 'redxam' + SUFFIX,
      script: 'dist/index.js',
      watch: '.',
      instances: 'max',
      env: {
        PORT: 5005,
        NODE_ENV: 'development',
        ENV: 'dev',
      },
      env_local_production: {
        PORT: 5005,
        NODE_ENV: 'production',
        ENV: 'prod',
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
        ENV: 'prod',
      },
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
