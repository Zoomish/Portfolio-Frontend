const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const brokenWatchPaths =
  /node_modules[\\/].*[\\/]xmlbuilder[\\/]perf([\\/].*)?$/;

config.resolver = {
  ...config.resolver,
  blockList: [
    ...(Array.isArray(config.resolver?.blockList)
      ? config.resolver.blockList
      : []),
    brokenWatchPaths,
  ],
};

config.watcher = {
  ...config.watcher,
  additionalExcludes: [
    ...(config.watcher?.additionalExcludes ?? []),
    brokenWatchPaths,
  ],
};

module.exports = config;
