import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Cache Components: dynamic-by-default rendering with explicit `"use cache"`
  // boundaries. Top-level stable flag (replaces experimental.dynamicIO/ppr).
  // FelipeOS reads no request data, so every route prerenders fully static.
  cacheComponents: true,
};

export default withNextIntl(nextConfig);
