module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 16,
          browsers: [
            'last 2 chrome versions',
            'last 2 firefox versions',
            'last 2 safari versions',
            'last 2 edge versions',
          ],
        },
      },
    ],
    '@babel/preset-typescript',
  ],
}
