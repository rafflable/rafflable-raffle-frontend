const path = require('path');
const env = process.env.ENV || 'development';

const assetPrefix = {
  development: 'http://localhost:3000',
  testnet: 'https://static.rafflable.io/testnet/raffle',
  production: 'https://static.rafflable.io/raffle',
}[env];

module.exports = {
  basePath: '',
  assetPrefix: assetPrefix,
  future: {
    webpack5: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  publicRuntimeConfig: {
    env: env,
    assetPrefix: assetPrefix,
  },
};
