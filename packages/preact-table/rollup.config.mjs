// @ts-check

import { defineConfig } from 'rollup'
import { buildConfigs } from '../../scripts/getRollupConfig.js'

export default defineConfig(
  buildConfigs({
    name: 'preact-table',
    jsName: 'PreactTable',
    outputFile: 'index',
    entryFile: 'src/index.tsx',
    external: ['preact', '@tanstack/table-core'],
    globals: {
      preact: 'Preact',
    },
  }),
)
