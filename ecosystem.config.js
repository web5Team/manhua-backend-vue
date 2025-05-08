module.exports = {
  apps: [
    {
      name: 'cartoon-admin',
      script: 'node_modules/@vue/cli-service/bin/vue-cli-service.js',
      args: 'serve',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        VUE_APP_BASE_API: 'https:///manhua-adm.nftx.pics'
      },
      env_staging: {
        NODE_ENV: 'staging',
        VUE_APP_BASE_API: 'http://test-api.example.com'
      },
      env_production: {
        NODE_ENV: 'production',
        VUE_APP_BASE_API: 'http://api.example.com'
      }
    }
  ]
}; 