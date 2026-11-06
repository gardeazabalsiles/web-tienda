import { Navigate, useNavigate, useParams } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { Order } from "../types/commerce";
import type { User } from "../types/auth";
import type { Product } from "../types/marketplace";
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const user = authRepository.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "ADMIN") return <Navigate to="/" replace />;

  const users = authRepository.getAllUsers().filter((item) => item.rol === "USUARIO");
  const orders = storageService.get<Order[]>("app_orders") ?? [];
  const products = storageService.get<Product[]>("app_products") ?? [];
  const activeOrders = orders.filter((order) => order.status !== "Cancelado");
  const sellers = users.filter((seller) => activeOrders.some((order) => order.sellerId === seller.id));
  const selectedSeller = sellerId ? users.find((seller) => seller.id === sellerId) : undefined;
  const sellerOrders = selectedSeller ? activeOrders.filter((order) => order.sellerId === selectedSeller.id) : [];
  const sellerProducts = selectedSeller ? products.filter((product) => product.sellerId === selectedSeller.id) : [];
  const soldItems = sellerOrders.flatMap((order) => (Array.isArray(order.items) ? order.items : []).map((item) => ({ ...item, order })));
  const deleteProduct = (id: number) => {
    if (!window.confirm("¿Eliminar esta prenda publicada por el vendedor?")) return;
    const current = storageService.get<Product[]>("app_products") ?? [];
    storageService.set("app_products", current.filter((product) => product.id !== id));
    window.location.reload();
  };
  const logout = () => { authRepository.logout(); navigate("/login", { replace: true }); };

  return <main className="admin-page">
    <header>
      <button onClick={() => navigate("/")}>TuTiendaModa</button>
      <h1>{selectedSeller ? "Perfil del vendedor" : "Panel de administración"}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </header>
    {selectedSeller ? <>
      <button className="admin-back" onClick={() => navigate("/admin")}>← Volver a vendedores</button>
      <section className="admin-seller-profile">
        <div className="admin-seller-avatar">♙</div>
        <div><p>PERFIL DEL VENDEDOR</p><h2>{selectedSeller.nombre} {selectedSeller.apellido}</h2><span>{selectedSeller.email}</span><span>{selectedSeller.telefono} · {selectedSeller.departamento}</span><span>{selectedSeller.direccion}</span></div>
      </section>
      <section className="admin-stats">
        <article><b>{soldItems.reduce((sum, item) => sum + item.quantity, 0)}</b><span>Prendas vendidas / solicitadas</span></article>
        <article><b>{sellerOrders.length}</b><span>Pedidos no cancelados</span></article>
        <article><b>Bs {sellerOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</b><span>Total de ventas registradas</span></article>
      </section>
      <section><h2>Prendas que vendió</h2>{soldItems.length === 0 ? <p>Este vendedor todavía no tiene ventas registradas.</p> : soldItems.slice().reverse().map(({ product, size, quantity, order }) => <article className="admin-product" key={order.id + product.id + size}><div>{product.images[0] && <img src={product.images[0]} alt={product.name}/>}</div><div><h3>{product.name}</h3><p>Pedido #{order.id.slice(-6)} · Comprador: {order.buyerName}</p><p>Talla: {size} · Cantidad: {quantity} · {order.status}</p><b>Bs {(product.price * quantity).toFixed(2)}</b><small>{new Date(order.createdAt).toLocaleString("es-BO")}</small></div></article>)}</section>
      <section><h2>Prendas que tiene publicadas</h2>{sellerProducts.length === 0 ? <p>No tiene publicaciones activas.</p> : sellerProducts.map((product) => <article className="admin-product" key={product.id}><div>{product.images[0] && <img src={product.images[0]} alt={product.name}/>}</div><div><h3>{product.name}</h3><p>{product.category} · {product.status} · {product.quantity} disponibles</p><b>Bs {product.price.toFixed(2)}</b></div><button onClick={() => deleteProduct(product.id)}>Eliminar publicación</button></article>)}</section>
    </> : <>
      <section className="admin-stats">
        <article><b>{products.length}</b><span>Prendas publicadas</span></article>
        <article><b>{orders.length}</b><span>Pedidos registrados</span></article>
        <article><b>Bs {activeOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0).toFixed(2)}</b><span>Total de pedidos no cancelados</span></article>
      </section>
      <section><h2>Vendedores de la tienda</h2><p className="admin-section-intro">Selecciona un vendedor para consultar sus datos, pedidos y prendas vendidas.</p>{sellers.length === 0 ? <p>Aún no hay usuarios con ventas registradas.</p> : sellers.map((seller: User) => {
        const sellerSales = activeOrders.filter((order) => order.sellerId === seller.id);
        const quantity = sellerSales.reduce((sum, order) => sum + (Array.isArray(order.items) ? order.items.reduce((n, item) => n + (Number(item.quantity) || 0), 0) : 0), 0);
        const total = sellerSales.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        return <button className="admin-seller-row" key={seller.id} onClick={() => navigate(`/admin/vendedor/${encodeURIComponent(seller.id)}`)}><span className="admin-seller-icon">♙</span><span className="admin-seller-name"><b>{seller.nombre} {seller.apellido}</b><small>{seller.email}</small></span><span className="admin-seller-sales">{quantity} prendas · Bs {total.toFixed(2)}</span><span className="admin-seller-arrow">›</span></button>;
      })}</section>
      <section><h2>Publicaciones de clientes</h2>{products.length === 0 ? <p>No hay prendas publicadas.</p> : products.map((product) => <article className="admin-product" key={product.id}><div>{product.images[0] && <img src={product.images[0]} alt={product.name}/>}</div><div><h3>{product.name}</h3><p>Vendedor: {product.sellerName}</p><b>Bs {product.price.toFixed(2)}</b></div><button onClick={() => deleteProduct(product.id)}>Eliminar publicación</button></article>)}</section>
      <section><h2>Todos los pedidos y ventas</h2>{orders.length === 0 ? <p>No hay pedidos registrados.</p> : orders.slice().reverse().map((order) => <article className="admin-order" key={order.id}><b>Pedido #{String(order.id).slice(-6)}</b><span>Comprador: {order.buyerName || "No disponible"}</span><span>Vendedor: {order.sellerName || "No disponible"}</span><span>Bs {(Number(order.total) || 0).toFixed(2)}</span><span>{order.status || "Sin estado"}</span><small>{order.createdAt ? new Date(order.createdAt).toLocaleString("es-BO") : "Fecha no disponible"}</small></article>)}</section>
    </>}
    <p className="admin-note">El administrador supervisa y modera. No puede comprar, vender ni publicar prendas.</p>
  </main>;
}