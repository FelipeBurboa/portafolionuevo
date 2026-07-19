import type { Profile } from "../../src/lib/profile/types";

const profile: Profile = {
  notice: "PERFIL DE EJEMPLO — reemplaza este archivo con la biografía y el enlace al CV real de Felipe.",
  bio: [
    "Convierto problemas de producto ambiguos en interfaces claras y sistemas útiles.",
    "Este texto es un marcador ficticio intencional. Reemplázalo con una descripción breve de tu práctica real, los equipos con los que disfrutas trabajar y los resultados que te importan.",
  ],
  timeline: [
    { period: "2024 — hoy", title: "Trabajo independiente de producto", detail: "Línea de ejemplo — reemplázala por un rol y resultado reales." },
    { period: "2021 — 2024", title: "Diseñador/a de producto / ingeniería", detail: "Línea de ejemplo — reemplázala por un equipo, alcance y contribución reales." },
  ],
  skills: ["Estrategia de producto", "Sistemas de interfaz", "Prototipado", "React", "TypeScript"],
  resumeHref: null,
};

export default profile;
