import type { Project } from "../../src/lib/projects/types";

/** EJEMPLO — reemplaza este registro por un caso de estudio público y real. */
const project: Project = {
  slug: "signalgrid",
  title: "Signalgrid",
  eyebrow: "CASO DE ESTUDIO DE EJEMPLO · REEMPLÁZAME",
  summary:
    "Un espacio de operaciones ficticio que convierte reportes de campo dispersos en una cola de decisiones clara y consultable.",
  role: "Diseño de producto + dirección frontend",
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
  year: "2025",
  outcomes: [
    "Diseñé un flujo de priorización centrado en urgencia y no en el sistema de origen.",
    "Hice legible la cola activa de un vistazo sin esconder el historial de auditoría.",
    "Creé patrones reutilizables de tabla, filtros y panel de detalle para una herramienta interna compleja.",
  ],
  imageCaption: "Reemplaza este panel con una captura real o un flujo anotado del proyecto.",
  links: [
    { label: "Demo en vivo", href: null },
    { label: "Repositorio", href: null },
  ],
};

export default [project] as const;
