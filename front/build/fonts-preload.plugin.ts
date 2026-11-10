import type { HtmlTagDescriptor, Plugin } from "vite";
import { PRELOAD_FONT_PATTERNS } from "./fonts-preload.constants";

export function fontsPreloadPlugin(): Plugin {
  return {
    name: "fonts-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, context) {
        const files = Object.keys(context.bundle ?? {});
        const tags: HtmlTagDescriptor[] = [];
        for (const pattern of PRELOAD_FONT_PATTERNS) {
          const file = files.find((name) => pattern.test(name));
          if (!file) continue;
          tags.push({ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "", href: `/${file}` }, injectTo: "head-prepend" });
        }
        return tags;
      },
    },
  };
}
