import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation. The window manager and language toggle use these
// instead of next/link and next/navigation so locale prefixes stay correct.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
