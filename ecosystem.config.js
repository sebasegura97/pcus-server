module.exports = {
  apps: [
    {
      name: "pcus-server",
      script: "dist/index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
<<<<<<< Updated upstream
=======
      env_production: {
        NODE_ENV: "production",
      }
>>>>>>> Stashed changes
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
