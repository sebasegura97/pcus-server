module.exports = {
  apps: [
    {
      name: "pcus-server",
      script: "dist/index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "sebasegura97",
      host: "199.241.139.3",
      ref: "origin/master",
      repo: "git@github.com:sebasegura97/pcus-server.git",
      path: "/home/sebasegura97/git/pcus-server",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
    },
  },
};
