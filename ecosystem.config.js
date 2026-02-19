// Arquivo de configuração para o pm2 na VM: permite que o código carregue .env.production

module.exports = {
  apps: [
    {
      name: 'news-explorer-backend',
      script: 'server.js',
      cwd: '/home/emaildavanessayuri/new-explorer-backend',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
