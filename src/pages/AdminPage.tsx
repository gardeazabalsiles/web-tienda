import { Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { Order } from "../types/commerce";
import type { Product } from "../types/marketplace";
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "ADMIN") return <Navigate to="/" replace />;
  const orders = storageService.get<Order[]>("app_orders") ?? [];
  const products = storageService.get<Product[]>("app_products") ?? [];
  const deleteProduct = (id: number) => {
    if (!window.confirm("¿Eliminar esta prenda?")) return;
    const current = storageService.get<Product[]>("app_products") ?? [];
    storageService.set("app_products", current.filter((product) => product.id !== id));
    window.location.reload();
  };
  return <main className="admin-page">
    <header><button onClick={() => navigate("/")}>TuTiendaModa</button><h1>Panel de administración</h1><button onClick={() => { authRepository.logout(); navigate("/login"); }}>Cerrar sesión</button></header>
    <section className="admin-stats"><article><b>{products.length}</b><span>Prendas publicadas</span></article><article><b>{orders.length}</b><span>Pedidos registrados</span></article><article><b>Bs {orders.filter(o => o.status !== "Cancelado").reduce((s,o) => s + o.total, 0).toFixed(2)}</b><span>Total de pedidos no cancelados</span></article></section>
    <section><h2>Publicaciones de clientes</h2>{products.length === 0 ? <p>No hay prendas publicadas.</p> : products.map(p => <article className="admin-product" key={p.id}><div>{p.images[0] && <img src={p.images[0]} alt={p.name}/>}</div><div><h3>{p.name}</h3><p>Vendedor: {p.sellerName}</p><b>Bs {p.price.toFixed(2)}</b></div><button onClick={() => deleteProduct(p.id)}>Eliminar publicación</button></article>)}</section>
    <section><h2>Todos los pedidos y ventas</h2>{orders.length === 0 ? <p>No hay pedidos registrados.</p> : orders.slice().reverse().map(o => <article className="admin-order" key={o.id}><b>Pedido #{o.id.slice(-6)}</b><span>Comprador: {o.buyerName}</span><span>Vendedor: {o.sellerName}</span><span>Bs {o.total.toFixed(2)}</span><span>{o.status}</span><small>{new Date(o.createdAt).toLocaleString("es-BO")}</small></article>)}</section>
    <p className="admin-note">El administrador supervisa y modera. No puede comprar, vender ni publicar prendas.</p>
  </main>;
}