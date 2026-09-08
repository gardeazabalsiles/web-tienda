import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { CartItem, Product } from "../types/marketplace";
import "./HomePage.css";

const PRODUCTS_KEY = "app_products";
const CART_KEY = "app_cart";
type ProductCategory = Product["category"];

export default function HomePage() {
  const nav = useNavigate();
  const user = authRepository.getCurrentUser();
  const [products] = useState<Product[]>(
    () => storageService.get<Product[]>(PRODUCTS_KEY) ?? [],
  );
  const [cart] = useState<CartItem[]>(
    () => storageService.get<CartItem[]>(CART_KEY) ?? [],
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "Todas">("Todas");

  useEffect(() => {
    storageService.set(PRODUCTS_KEY, products);
  }, [products]);

  const visibleProducts =
    selectedCategory === "Todas"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const closeMenu = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
    setContactOpen(false);
  };

  const chooseCategory = (category: ProductCategory | "Todas") => {
    setSelectedCategory(category);
    closeMenu();
    window.setTimeout(() => {
      document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <main className="store-page">
      <header className="store-header">
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          type="button"
        >
          {menuOpen ? "×" : "="}
        </button>

        <button
          className="brand"
          onClick={() => {
            setSelectedCategory("Todas");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          type="button"
        >
          TuTiendaModa
        </button>

        {user ? (
          <div className="header-actions">
            <button className="plus-button" onClick={() => nav("/publicar")} aria-label="Publicar prenda" type="button">
              ＋
            </button>
            <button className="profile-button" onClick={() => nav("/perfil")} aria-label="Mi perfil" type="button">
              ♙
            </button>
            <button className="cart-button" onClick={() => nav("/carrito")} aria-label="Carrito" type="button">
              🛍️
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </button>
          </div>
        ) : (
          <div className="guest-actions">
            <button onClick={() => nav("/login")} type="button">INICIAR SESIÓN</button>
            <button onClick={() => nav("/crear-cuenta")} type="button">REGISTRARSE</button>
          </div>
        )}
      </header>

      {menuOpen && (
        <>
          <button className="menu-overlay" aria-label="Cerrar menú" onClick={closeMenu} type="button" />
          <aside className="side-menu" aria-label="Menú principal">
            <div className="side-menu-item">
              <button onClick={() => setCategoriesOpen((value) => !value)} type="button">
                <span>CATEGORÍAS</span>
                <span className="menu-arrow">{categoriesOpen ? "⌃" : "›"}</span>
              </button>
              {categoriesOpen && (
                <div className="submenu">
                  <button onClick={() => chooseCategory("Mujer")} type="button">Mujer</button>
                  <button onClick={() => chooseCategory("Hombre")} type="button">Hombre</button>
                  <button onClick={() => chooseCategory("Niños")} type="button">Niños</button>
                  <button onClick={() => chooseCategory("Accesorios")} type="button">Accesorios</button>
                  <button className="show-all" onClick={() => chooseCategory("Todas")} type="button">Todas las prendas</button>
                </div>
              )}
            </div>

            <div className="side-menu-item">
              <button onClick={() => setContactOpen((value) => !value)} type="button">
                <span>CONTÁCTANOS</span>
                <span className="menu-arrow">{contactOpen ? "⌃" : "›"}</span>
              </button>
              {contactOpen && (
                <div className="contact-info">
                  <div>
                    <strong>Sabrina Gardeazabal</strong>
                    <span>+591 72879584</span>
                  </div>
                  <div>
                    <strong>Fernanda Siles</strong>
                    <span>+591 67636799</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      <section className="hero">
        <div className="hero-model" />
        <div className="hero-copy">
          <p>ENCUENTRA TU ESTILO</p>
          <h1>Prendas únicas para cada forma de ser</h1>
          <span>
            Descubre prendas nuevas y de segunda mano, dales una segunda oportunidad y encuentra algo hecho para ti.
          </span>
        </div>
      </section>

      <section className="section" id="productos">
        <div className="section-title">
          <h2>NUESTRAS PRENDAS</h2>
          {selectedCategory !== "Todas" && (
            <p className="active-category">{selectedCategory}</p>
          )}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="empty-products">
            <div>♡</div>
            <h3>Aún no hay prendas publicadas</h3>
            <p>Cuando haya publicaciones aparecerán aquí.</p>
          </div>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article
                className="product-card"
                key={product.id}
                onClick={() => nav(`/producto/${product.id}`)}
              >
                <div className="product-image">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                  <small>{product.status}</small>
                </div>
                <div className="product-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <strong>Bs {product.price.toFixed(2)}</strong>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      nav(`/producto/${product.id}`);
                    }}
                    type="button"
                  >
                    VER DETALLES
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        <strong>TuTiendaModa</strong>
        <span>Compra · Vende · Reutiliza moda en Bolivia</span>
      </footer>
    </main>
  );
}
