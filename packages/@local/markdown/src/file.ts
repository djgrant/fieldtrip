import * as qs from "qs";
import * as fs from "fs/promises";

export async function getFile(
  filePath: string,
  props?: Record<string, string>
) {
  const [basePath, query] = filePath.split("?");
  const queryProps = qs.parse(query);

  const allProps = { ...props, ...queryProps } as typeof queryProps &
    typeof props;

  const content = await fs.readFile(basePath, { encoding: "utf-8" });

  if (!Object.keys(allProps).length) return content;

  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    if (allProps.hasOwnProperty(key)) {
      return allProps[key as keyof typeof allProps];
    }
    return "";
  });
}
