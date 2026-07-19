"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { getContact } from "@/lib/profile/data";

export function ContactWindow() {
  const locale = useLocale();
  const contact = getContact(locale);
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard?.writeText(contact.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="text-xs leading-6">
      <p className="border border-term-amber/60 bg-term-bg-titlebar px-3 py-2 text-[10px] leading-4 text-term-amber">{contact.notice}</p>
      <div className="mt-5 border border-term-border">
        <div className="border-b border-term-border-dim bg-term-bg-titlebar px-3 py-2 text-[10px] text-term-green">TO: FELIPE</div>
        <div className="space-y-3 p-4">
          <p className="text-term-fg-dim">Open a mail draft or copy the address.</p>
          <code className="block border border-term-border bg-term-bg px-3 py-2 text-term-fg-bright">{contact.email}</code>
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${contact.email}`} className="border border-term-green px-3 py-1.5 text-[11px] text-term-green hover:bg-term-green hover:text-term-bg">compose mail ↗</a>
            <button type="button" onClick={copyEmail} className="border border-term-border px-3 py-1.5 text-[11px] text-term-fg hover:border-term-green hover:text-term-green">{copied ? "copied" : "copy email"}</button>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {[{ label: "GitHub", href: contact.github }, { label: "LinkedIn", href: contact.linkedin }].map((item) => item.href ? (
          <a key={item.label} href={item.href} className="border border-term-border p-3 text-term-fg hover:border-term-green hover:text-term-green">{item.label} ↗</a>
        ) : <span key={item.label} className="border border-term-border p-3 text-term-fg-dim">{item.label} — add URL</span>)}
      </div>
    </section>
  );
}
