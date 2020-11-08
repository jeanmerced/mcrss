module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            _components: './src/components',
            _screens: './src/screens',
            _navigation: './src/navigation',
            _styles: './src/styles',
            _firebase: './src/firebase',
            _hooks: './src/hooks',
          },
        },
      ],
    ],
  };
};
