import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import path from "path";

const pkg = require("./package.json");

export default {
  input: "projects/filestack-angular/src/public-api.ts",
  output: {
    file: path.join(
      __dirname,
      "dist/filestack-angular/bundles",
      "filestack-angular.umd.min.js"
    ),
    format: "umd",
    name: pkg.name,
    sourcemap: true,
  },
  plugins: [
    typescript({
      // Rollup 4 / @rollup/plugin-typescript v12 require outDir to live under
      // the bundle output directory.
      outDir: path.join(__dirname, "dist/filestack-angular/bundles"),
      declaration: false,
      sourceMap: true,
    }),
    commonjs(),
    nodeResolve({ browser: true }),
    terser({
      ecma: 2020,
      mangle: { toplevel: true },
      compress: {
        module: true,
        toplevel: true,
        unsafe_arrows: true,
        drop_console: true,
        drop_debugger: true,
      },
      output: { quote_style: 1 },
    }),
  ],
};
