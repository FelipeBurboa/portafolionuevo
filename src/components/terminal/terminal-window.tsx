"use client";

import { type FormEvent, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { APP_IDS, type AppId } from "@/lib/window/model";
import { useWindowStore } from "@/lib/window/store";

type HelpEntry = { command: string; description: string };
type Line = { command?: string; output: string[]; help?: HelpEntry[]; tone?: "green" | "amber" | "dim" };

const APPS = new Set<string>(APP_IDS);

function prompt(locale: string) {
  return locale === "es" ? "felipe@burboa:~$" : "felipe@burboa:~$";
}

function greeting(locale: string): Line[] {
  return [
    {
      output: locale === "es"
        ? ["FelipeOS terminal v1.0", "Escribe 'help' para ver los comandos disponibles."]
        : ["FelipeOS terminal v1.0", "Type 'help' to see available commands."],
      tone: "dim",
    },
  ];
}

function helpEntries(locale: string): HelpEntry[] {
  if (locale === "es") {
    return [
      { command: "help", description: "muestra esta guía de comandos" },
      { command: "whoami", description: "lee el perfil del operador" },
      { command: "ls projects", description: "lista los casos de estudio" },
      { command: "open <app>", description: "abre projects, about, contact o terminal" },
      { command: "lang <en|es>", description: "cambia el idioma de la interfaz" },
      { command: "sudo hire-me", description: "envía una señal de contacto" },
      { command: "clear", description: "limpia la salida de la terminal" },
    ];
  }
  return [
    { command: "help", description: "show this command reference" },
    { command: "whoami", description: "read the operator profile" },
    { command: "ls projects", description: "list the case studies" },
    { command: "open <app>", description: "open projects, about, contact, or terminal" },
    { command: "lang <en|es>", description: "switch the interface language" },
    { command: "sudo hire-me", description: "send a contact signal" },
    { command: "clear", description: "clear terminal output" },
  ];
}

export function TerminalWindow() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const open = useWindowStore((s) => s.open);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Line[]>(() => greeting(locale));
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    const line: Line = { command: raw.trim(), output: [] };
    const [verb, argument] = command.split(/\s+/, 2);

    if (command === "help") {
      line.help = helpEntries(locale);
    } else if (command === "whoami") {
      line.output = locale === "es"
        ? ["Felipe Burboa — perfil de ejemplo en construcción.", "Abre about.md para reemplazarlo con la biografía real."]
        : ["Felipe Burboa — sample profile under construction.", "Open about.md to replace it with the real biography."];
    } else if (command === "ls projects") {
      line.output = ["drwxr-xr-x  signalgrid/  [sample case study]"];
    } else if (verb === "open") {
      if (argument && APPS.has(argument)) {
        open(argument as AppId);
        line.output = [`opening ${argument}...`];
        line.tone = "green";
      } else {
        line.output = ["usage: open <projects|about|contact|terminal>"];
        line.tone = "amber";
      }
    } else if (verb === "lang") {
      if (argument === "en" || argument === "es") {
        line.output = [`switching language to ${argument}...`];
        router.replace(pathname, { locale: argument });
        line.tone = "green";
      } else {
        line.output = ["usage: lang <en|es>"];
        line.tone = "amber";
      }
    } else if (command === "sudo hire-me") {
      line.output = locale === "es"
        ? ["[sudo] permiso concedido.", "Señal recibida. Abriendo contact..."]
        : ["[sudo] permission granted.", "Signal received. Opening contact..."];
      line.tone = "green";
      open("contact");
    } else if (command === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else {
      line.output = [`command not found: ${raw.trim()}`, "Try 'help'."];
      line.tone = "amber";
    }

    setHistory((current) => [...current, line]);
    setInput("");
    setHistoryIndex(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(input);
  };
  const commandHistory = history.flatMap((line) => line.command ? [line.command] : []);

  return (
    <section className="flex min-h-full flex-col bg-term-bg text-xs leading-6 text-term-fg" onClick={() => inputRef.current?.focus()}>
      <div aria-live="polite" aria-atomic="false" className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {history.map((line, index) => (
          <div key={`${line.command ?? "boot"}-${index}`}>
            {line.command && <p className="text-term-fg-bright"><span className="text-term-green">{prompt(locale)}</span> {line.command}</p>}
            {line.output.map((output, outputIndex) => (
              <p key={outputIndex} className={line.tone === "amber" ? "text-term-amber" : line.tone === "green" ? "text-term-green" : "text-term-fg-dim"}>{output}</p>
            ))}
            {line.help && (
              <div className="mt-1 border border-term-border-dim bg-term-bg-titlebar px-3 py-2">
                <p className="mb-1 grid grid-cols-[minmax(7.5rem,max-content)_1fr] gap-x-4 text-[10px] tracking-[0.12em] text-term-amber">
                  <span>COMMAND</span><span>DESCRIPTION</span>
                </p>
                <dl className="grid grid-cols-[minmax(7.5rem,max-content)_1fr] gap-x-4 gap-y-1">
                  {line.help.map((entry) => (
                    <div key={entry.command} className="contents">
                      <dt className="whitespace-nowrap text-term-green">{entry.command}</dt>
                      <dd className="text-term-fg-dim">{entry.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2 border-t border-term-border-dim pt-3">
        <span className="shrink-0 text-term-green">{prompt(locale)}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const next = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
              setHistoryIndex(next);
              setInput(commandHistory[next] ?? "");
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (historyIndex === null) return;
              const next = historyIndex + 1;
              if (next >= commandHistory.length) {
                setHistoryIndex(null);
                setInput("");
              } else {
                setHistoryIndex(next);
                setInput(commandHistory[next]);
              }
            }
          }}
          aria-label="Terminal command"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-term-fg-bright outline-none placeholder:text-term-fg-dim"
          placeholder="help"
        />
      </form>
    </section>
  );
}
