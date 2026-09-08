import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { CartItem, Product } from "../types/marketplace";
import "./HomePage.css";
import "./CategoryPage.css";

const PRODUCTS_KEY = "app_products";
const CART_KEY = "app_cart";
const categories: Product["category"][] = ["Mujer", "Hombre", "Niños", "Accesorios"];

export default function CategoryPage() {
  const nav = useNavigate();
  const { category } = useParams();
  const currentCategory = decodeURIComponent(category ?? "") as Product["category"];
  const user = authRepository.getCurrentUser();
  const [products] = useState<Product[]>(() => storageService.get<Product[]>(PRODUCTS_KEY) ?? []);
  const [cart] = useState<CartItem[]>(() => storageService.get<CartItem[]>(CART_KEY) ?? []);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { storageService.set(PRODUCTS_KEY, products); }, [products]);

  if (!categories.includes(currentCategory)) {
    return <>{nav("/")}</>;
  }

  const visibleProducts = products.filter((product) => product.category === currentCategory);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="store-page">
      <header className="store-header">
        <button className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menú" type="button">{menuOpen ? "×" : "="}</button>
        <button className="brand" onClick={() => nav("/")} type="button">TuTiendaModa</button>
        {user ? (
          <div className="header-actions">
            <button className="plus-button" onClick={() => nav("/publicar")} type="button">＋</button>
            <button className="profile-button" onClick={() => nav("/perfil")} type="button">♙</button>
            <button className="cart-button" onClick={() => nav("/carrito")} type="button">🛍️<span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button>
          </div>
        ) : (
          <div className="guest-actions"><button onClick={() => nav("/login")} type="button">INICIAR SESIÓN</button><button onClick={() => nav("/crear-cuenta")} type="button">REGISTRARSE</button></div>
        )}
      </header>

      {menuOpen && (
        <>
          <button className="menu-overlay" onClick={closeMenu} aria-label="Cerrar menú" type="button" />
          <aside className="side-menu" aria-label="Menú principal">
            <div className="side-menu-item"><button onClick={closeMenu} type="button"><span>CATEGORÍAS</span><span className="menu-arrow">⌃</span></button>
              <div className="submenu">
                {categories.map((item) => <button key={item} onClick={() => { closeMenu(); nav(`/categoria/${encodeURIComponent(item)}`); }} type="button">{item}</button>)}
              </div>
            </div>
            <div className="side-menu-item"><button type="button"><span>CONTÁCTANOS</span></button></div>
          </aside>
        </>
      )}

      <section className="category-heading"><p>COLECCIÓN</p><h1>{currentCategory}</h1><span>Explora todas las prendas disponibles en esta categoría.</span></section>

      <section className="section category-section">
        {visibleProducts.length === 0 ? (
          <div className="empty-products"><div>♡</div><h3>Aún no hay prendas en {currentCategory}</h3><p>Cuando haya publicaciones aparecerán aquí.</p></div>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => <article className="product-card" key={product.id} onClick={() => nav(`/producto/${product.id}`)}><div className="product-image">{product.images[0] ? <img src={product.images[0]} alt={product.name} /> : <span>Sin imagen</span>}<small>{product.status}</small></div><div className="product-info"><p>{product.category}</p><h3>{product.name}</h3><strong>Bs {product.price.toFixed(2)}</strong><button onClick={(event) => { event.stopPropagation(); nav(`/producto/${product.id}`); }} type="button">VER DETALLES</button></div></article>)}
          </div>
        )}
      </section>
      <footer><strong>TuTiendaModa</strong><span>Compra · Vende · Reutiliza moda en Bolivia</span></footer>
    </main>
  );
}
