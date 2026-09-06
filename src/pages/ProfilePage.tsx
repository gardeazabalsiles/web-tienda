import { Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { Order } from "../types/commerce";
import type { Product } from "../types/marketplace";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  const orders = storageService.get<Order[]>("app_orders") ?? [];
  const products = storageService.get<Product[]>("app_products") ?? [];
  const sales = orders.filter((o) => o.sellerId === user.id);
  const purchases = orders.filter((o) => o.buyerId === user.id);
  const myProducts = products.filter((p) => p.sellerId === user.id);
  const logout = () => { authRepository.logout(); navigate("/login", { replace: true }); };
  return <main className="profile-page"><header className="profile-header"><button className="profile-brand" onClick={() => navigate("/")}>TuTiendaModa</button><button onClick={() => navigate("/")}>← Volver</button></header><section className="profile-card"><div className="avatar">{user.nombre.charAt(0).toUpperCase()}</div><div><p>MI PERFIL</p><h1>{user.nombre} {user.apellido}</h1><span>{user.email}</span><span>{user.telefono} · {user.direccion}</span></div><button className="logout" onClick={logout}>Cerrar sesión</button></section><div className="profile-stats"><div><strong>{myProducts.length}</strong><span>Prendas publicadas</span></div><div><strong>{purchases.length}</strong><span>Compras</span></div><div><strong>{sales.length}</strong><span>Ventas recibidas</span></div></div><section className="profile-orders"><div><h2>Mis compras</h2>{purchases.length ? purchases.map((o) => <article key={o.id}><b>Pedido #{o.id.slice(-6)}</b><span>{o.sellerName} · Bs {o.total.toFixed(2)}</span><small>{o.status} · {o.payment === "qr" ? "QR" : "Efectivo"}</small><button onClick={() => navigate(`/chat/${o.sellerId}`)}>💬 Hablar con vendedor</button></article>) : <p>Aún no tienes compras.</p>}</div><div><h2>Ventas recibidas</h2>{sales.length ? sales.map((o) => <article key={o.id}><b>Pedido #{o.id.slice(-6)}</b><span>{o.buyerName} · Bs {o.total.toFixed(2)}</span><small>{o.status} · {o.payment === "qr" ? "QR" : "Efectivo"}</small><button onClick={() => navigate(`/chat/${o.buyerId}`)}>💬 Hablar con comprador</button></article>) : <p>Aún no tienes ventas.</p>}</div></section></main>;
}
