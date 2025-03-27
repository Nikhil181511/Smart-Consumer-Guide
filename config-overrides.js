module.exports = function override(config) {
    config.resolve.fallback = {
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
    };
    return config;
  };
  