import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { CartItem, Product } from "../types/marketplace";
import "./HomePage.css";

const PRODUCTS_KEY = "app_products";
const CART_KEY = "app_cart";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
}

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [products, setProducts] = useState<Product[]>(() => storageService.get<Product[]>(PRODUCTS_KEY) ?? []);
  const [cart, setCart] = useState<CartItem[]>(() => storageService.get<CartItem[]>(CART_KEY) ?? []);
  const [category, setCategory] = useState("Todas");
  const [name, setName] = useState("");
  const [productCategory, setProductCategory] = useState<Product["category"]>("Mujer");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<Product["status"]>("Nuevo");
  const [sizes, setSizes] = useState<string[]>(["M"]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => { storageService.set(PRODUCTS_KEY, products); }, [products]);
  useEffect(() => { storageService.set(CART_KEY, cart); }, [cart]);

  if (!user) return <Navigate to="/login" replace />;

  const visibleProducts = useMemo(() => category === "Todas" ? products : products.filter((p) => p.category === category), [products, category]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => { authRepository.logout(); navigate("/login", { replace: true }); };
  const handleImages = async (event: ChangeEvent<HTMLInputElement>) => { const files = Array.from(event.target.files ?? []); if (files.length) setImages(await Promise.all(files.map(fileToDataUrl))); };
  const toggleSize = (size: string) => setSizes((current) => current.includes(size) ? current.filter((s) => s !== size) : [...current, size]);

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const numericPrice = Number(price);
    if (!cleanName || !numericPrice || sizes.length === 0) { setFormMessage("Completa el nombre, precio y al menos una talla."); return; }
    const product: Product = { id: Date.now(), sellerId: user.id, sellerName: `${user.nombre} ${user.apellido}`, name: cleanName, category: productCategory, price: numericPrice, status, sizes, description: description.trim() || "Prenda publicada en TuTiendaModa.", images, createdAt: new Date().toISOString() };
    setProducts((current) => [product, ...current]);
    setName(""); setPrice(""); setDescription(""); setSizes(["M"]); setImages([]); setStatus("Nuevo");
    setFormMessage("¡Prenda publicada! Ya puede ser vista y comprada por otros usuarios.");
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="store-page">
      <header className="store-header">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>TuTiendaModa</button>
        <nav aria-label="Navegación principal">
          <button className={category === "Todas" ? "active" : ""} onClick={() => { setCategory("Todas"); document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" }); }}>INICIO</button>
          <button onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}>PRODUCTOS</button>
          <button onClick={() => document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" })}>CATEGORÍAS</button>
          <button onClick={() => document.getElementById("sobre-nosotros")?.scrollIntoView({ behavior: "smooth" })}>SOBRE NOSOTROS</button>
        </nav>
        <div className="header-actions">
          <button className="cart-button" onClick={() => navigate("/carrito")} aria-label="Ver carrito">🛍️<span>{cartCount}</span></button>
          <button className="account-button" onClick={() => document.getElementById("mi-cuenta")?.scrollIntoView({ behavior: "smooth" })}>{user.nombre}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-model" aria-label="Modelo de la colección" />
        <div className="hero-copy"><p>NUEVA COLECCIÓN</p><h1>Descubre tu estilo</h1><span>Moda nueva y de segunda mano, publicada por nuestra comunidad.</span><button onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}>VER PRENDAS</button></div>
      </section>

      <section className="section" id="productos">
        <div className="section-title"><p>MARKETPLACE</p><h2>Prendas de nuestra comunidad</h2><span>Las imágenes aparecen cuando cada usuario publica su propia ropa.</span></div>
        <div className="category-filter">{["Todas", "Mujer", "Hombre", "Niños", "Accesorios"].map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        {visibleProducts.length === 0 ? <div className="empty-products"><div>♡</div><h3>Aún no hay prendas publicadas</h3><p>Sé la primera persona en subir una prenda para vender.</p><button onClick={() => document.getElementById("publicar")?.scrollIntoView({ behavior: "smooth" })}>PUBLICAR UNA PRENDA</button></div> : <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id} onClick={() => navigate(`/producto/${product.id}`)}><div className="product-image">{product.images[0] ? <img src={product.images[0]} alt={product.name} /> : <span>Sin imagen</span>}<small>{product.status}</small></div><div className="product-info"><p>{product.category}</p><h3>{product.name}</h3><strong>Bs {product.price.toFixed(2)}</strong><button onClick={(e) => { e.stopPropagation(); navigate(`/producto/${product.id}`); }}>VER DETALLES</button></div></article>)}</div>}
      </section>

      <section className="categories-section" id="categorias"><div className="section-title"><p>EXPLORA</p><h2>Explorar por categoría</h2></div><div className="category-cards">{["Mujer", "Hombre", "Accesorios"].map((item) => <button key={item} onClick={() => { setCategory(item as Product["category"]); document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" }); }}><span>{item}</span></button>)}</div></section>

      <section className="publish-section" id="publicar"><div className="section-title"><p>VENDE EN TU TIENDAMODA</p><h2>Publica tu propia ropa</h2><span>Cada usuario puede subir fotos, estado, tallas y precio. La publicación queda disponible para la comunidad.</span></div>
        <form className="publish-form" onSubmit={handleAddProduct}>
          <label>Nombre de la prenda<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Chaqueta denim" required /></label>
          <label>Categoría<select value={productCategory} onChange={(e) => setProductCategory(e.target.value as Product["category"])}><option>Mujer</option><option>Hombre</option><option>Niños</option><option>Accesorios</option></select></label>
          <label>Precio en bolivianos<input type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="120" required /></label>
          <label>Estado<select value={status} onChange={(e) => setStatus(e.target.value as Product["status"])}><option>Nuevo</option><option>Usado</option></select></label>
          <fieldset><legend>Tallas disponibles</legend><div className="size-options">{["XS","S","M","L","XL","Única"].map((size) => <button type="button" className={sizes.includes(size) ? "selected" : ""} key={size} onClick={() => toggleSize(size)}>{size}</button>)}</div></fieldset>
          <label className="wide">Descripción<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Cuenta cómo está la prenda, color, material, etc." rows={4} /></label>
          <label className="wide">Fotos de la prenda<input type="file" accept="image/*" multiple onChange={handleImages} /><small>Selecciona una o varias imágenes. Se guardan localmente en este navegador.</small></label>
          {images.length > 0 && <div className="upload-preview wide">{images.map((src, i) => <img key={i} src={src} alt={`Vista previa ${i + 1}`} />)}</div>}
          {formMessage && <p className="form-message wide">{formMessage}</p>}
          <button className="publish-button wide" type="submit">PUBLICAR PRENDA</button>
        </form>
      </section>

      <section className="about-section" id="sobre-nosotros"><p>SOBRE NOSOTROS</p><h2>Una tienda hecha por la comunidad</h2><span>TuTiendaModa permite comprar y vender prendas entre usuarios, con un diseño inspirado en las grandes tiendas de moda pero pensado para Bolivia.</span></section>
      <section className="account-section" id="mi-cuenta"><div><p>MI CUENTA</p><h2>{user.nombre} {user.apellido}</h2><span>{user.email} · {user.telefono} · {user.direccion}</span></div><button onClick={handleLogout}>CERRAR SESIÓN</button></section>
      <footer><strong>TuTiendaModa</strong><span>Compra · Vende · Reutiliza moda en Bolivia</span><small>Políticas de Privacidad · Términos y Condiciones</small></footer>
    </main>
  );
}
export default HomePage;
