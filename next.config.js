const path = require("path");

module.exports = {
  trailingSlash: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      
    }

    // Add managedPaths to the cache configuration
    if (config.cache && config.cache.managedPaths) {
      config.cache.managedPaths.push(
        ...[
          "/Users/umar/Downloads/8thsem/blockfund_hardhat/node_modules/@next",
          "/Users/umar/Downloads/8thsem/blockfund_hardhat/node_modules/@metamask",
        ]
      );
    }

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  
};
