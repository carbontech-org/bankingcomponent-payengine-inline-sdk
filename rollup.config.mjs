import terser from '@rollup/plugin-terser';

export default [
    // 1. Minified UMD bundle (For direct <script> tags & UNPKG/jsDelivr CDN)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/checkout.min.js',
            format: 'umd',
            name: 'CheckoutWidget',
            sourcemap: false
        },
        plugins: [terser()]
    },
    // 2. ESM bundle (For modern apps: Vite, React, Vue, Next.js)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/checkout.esm.js',
            format: 'es'
        }
    },
    // 3. CommonJS bundle (For Node.js / require)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/checkout.cjs.js',
            format: 'cjs',
            exports: 'named'
        }
    }
];