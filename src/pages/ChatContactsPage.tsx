import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { User } from "../types/auth";
import type { Order } from "../types/commerce";
import type { Product } from "../types/marketplace";
import "./ChatContactsPage.css";

type ContactTab = "vendedores" | "compradores";

export default function ChatContactsPage() {
  const nav = useNavigate();
  const me = authRepository.getCurrentUser();
  const [tab, setTab] = useState<ContactTab>("vendedores");
  const users = storageService.get<User[]>("app_users") ?? [];
  const products = storageService.get<Product[]>("app_products") ?? [];
  const orders = storageService.get<Order[]>("app_orders") ?? [];

  const sellers = useMemo(() => {
    const ids = new Set<string>([
      ...products.map((product) => product.sellerId),
      ...orders.map((order) => order.sellerId),
    ]);
    return users.filter((user) => user.id !== me?.id && ids.has(user.id));
  }, [users, products, orders, me?.id]);

  const buyers = useMemo(() => {
    const ids = new Set(orders.map((order) => order.buyerId));
    return users.filter((user) => user.id !== me?.id && ids.has(user.id));
  }, [users, orders, me?.id]);

  if (!me) {
    nav("/login", { replace: true });
    return null;
  }

  const contacts = tab === "vendedores" ? sellers : buyers;

  return (
    <main className="chat-contacts-page">
      <header className="chat-contacts-header">
        <button onClick={() => nav("/")} className="chat-contacts-brand">TuTiendaModa</button>
        <h1>Mensajes</h1>
      </header>
      <section className="contacts-panel">
        <div className="contacts-intro">
          <h2>Conecta con la comunidad</h2>
          <p>Elige una persona para iniciar o continuar una conversación.</p>
        </div>
        <div className="contacts-tabs" role="tablist" aria-label="Tipo de contacto">
          <button className={tab === "vendedores" ? "active" : ""} onClick={() => setTab("vendedores")} type="button">
            Vendedores <span>{sellers.length}</span>
          </button>
          <button className={tab === "compradores" ? "active" : ""} onClick={() => setTab("compradores")} type="button">
            Compradores <span>{buyers.length}</span>
          </button>
        </div>
        <div className="contacts-list">
          {contacts.length === 0 ? (
            <div className="contacts-empty">
              <span>♡</span>
              <h3>No hay {tab} disponibles todavía</h3>
              <p>Cuando haya actividad en la tienda, aparecerán aquí.</p>
            </div>
          ) : contacts.map((contact) => (
            <article className="contact-row" key={contact.id}>
              <div className="contact-avatar">{contact.nombre.charAt(0)}{contact.apellido.charAt(0)}</div>
              <div className="contact-details">
                <strong>{contact.nombre} {contact.apellido}</strong>
                <span>{contact.departamento || "Bolivia"}</span>
              </div>
              <button onClick={() => nav(`/chat/${contact.id}`)} type="button">ABRIR CHAT</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
