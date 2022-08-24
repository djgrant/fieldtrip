import type { Loader, Plugin } from "esbuild";
import * as esbuild from "esbuild";
import path, { resolve } from "path";

type Options = {
  files: Record<string, string>;
  entry: string;
};

export const build = async (options: Options) => {
  const result = esbuild.build({
    entryPoints: [options.entry],
    bundle: true,
    write: false,
    plugins: [virtual(options.files)],
  });
  console.log(result);
};

function virtual(files: Options["files"]): Plugin {
  const namespace = "virtual";
  return {
    name: namespace,
    setup(build) {
      build.onResolve({ filter: /\.\/.*/ }, (args) => {
        return {
          path: args.path,
          namespace,
          pluginData: args.pluginData,
        };
      });
      build.onLoad({ filter: /.*/, namespace }, (args) => {
        const fullPath = path.join(
          args.pluginData?.resolveDir || "./",
          args.path
        );

        let file = files[fullPath] || files[`${fullPath}.ts`];
        let resolveDir = path.parse(fullPath).dir || "./";

        if (!file) {
          file = files[`${fullPath}/index.ts`];
          resolveDir = path.parse(`${fullPath}/index`).dir;
        }

        if (!file) return;

        return {
          contents: file,
          loader: "ts",
          pluginData: { resolveDir },
          resolveDir: __dirname,
        };
      });
    },
  };
}
