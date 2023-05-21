const webpack = require('webpack');

module.exports = {
    resolve: {
        alias: {
            ethers: require.resolve("ethers")
        },
    },
};
