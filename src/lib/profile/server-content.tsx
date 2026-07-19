import { getContact, getProfile } from "./data";

export function AboutRouteContent({ locale }: { locale: string }) {
  const profile = getProfile(locale);
  return <article><p>{profile.notice}</p><h1>About</h1>{profile.bio.map((text) => <p key={text}>{text}</p>)}<h2>Experience</h2><ul>{profile.timeline.map((item) => <li key={item.period}>{item.period}: {item.title} — {item.detail}</li>)}</ul></article>;
}

export function ContactRouteContent({ locale }: { locale: string }) {
  const contact = getContact(locale);
  return <article><p>{contact.notice}</p><h1>Contact</h1><a href={`mailto:${contact.email}`}>{contact.email}</a></article>;
}
