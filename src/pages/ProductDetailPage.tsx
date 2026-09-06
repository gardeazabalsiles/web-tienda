import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { CartItem, Product } from "../types/marketplace";
import "./ProductDetailPage.css";

const PRODUCTS_KEY = "app_products";
const CART_KEY = "app_cart";

function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const products = storageService.get<Product[]>(PRODUCTS_KEY) ?? [];
  const product = useMemo(() => products.find((item) => String(item.id) === id), [products, id]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [message, setMessage] = useState("");

  if (!authRepository.isAuthenticated()) { navigate("/login", { replace: true }); return null; }
  if (!product) return <main className="detail-page"><div className="not-found"><h1>Prenda no encontrada</h1><button onClick={() => navigate("/")}>VOLVER A LA TIENDA</button></div></main>;

  const addToCart = () => {
    if (!selectedSize) { setMessage("Selecciona una talla."); return; }
    const current = storageService.get<CartItem[]>(CART_KEY) ?? [];
    const existing = current.find((item) => item.product.id === product.id && item.size === selectedSize);
    const next = existing ? current.map((item) => item.product.id === product.id && item.size === selectedSize ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, size: selectedSize, quantity: 1 }];
    storageService.set(CART_KEY, next);
    setMessage("¡Prenda agregada al carrito!");
  };

  const buyNow = () => { addToCart(); navigate("/carrito"); };

  return <main className="detail-page">
    <header className="detail-header"><button className="detail-brand" onClick={() => navigate("/")}>TuTiendaModa</button><button className="detail-cart" onClick={() => navigate("/carrito")}>🛍️ Carrito</button></header>
    <div className="detail-breadcrumb"><button onClick={() => navigate("/")}>Inicio</button> / {product.category} / {product.name}</div>
    <section className="detail-layout">
      <div className="gallery"><div className="main-detail-image">{product.images[selectedImage] ? <img src={product.images[selectedImage]} alt={product.name} /> : <div>Sin imagen de la prenda</div>}</div>{product.images.length > 1 && <div className="thumbnails">{product.images.map((src, i) => <button key={i} className={selectedImage === i ? "selected" : ""} onClick={() => setSelectedImage(i)}><img src={src} alt={`Vista ${i + 1}`} /></button>)}</div>}</div>
      <div className="detail-info"><p className="detail-category">{product.category}</p><h1>{product.name}</h1><div className="detail-price">Bs {product.price.toFixed(2)}</div><div className="detail-divider"/><p><strong>Estado:</strong> {product.status}</p><p><strong>Vendedor:</strong> {product.sellerName}</p><p className="description">{product.description}</p><h3>Talla</h3><div className="detail-sizes">{product.sizes.map((size) => <button key={size} className={selectedSize === size ? "selected" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>{message && <p className="detail-message">{message}</p>}<button className="add-cart" onClick={addToCart}>AGREGAR AL CARRITO</button><button className="buy-now" onClick={buyNow}>COMPRAR AHORA</button><div className="seller-note">Compra segura entre usuarios · Pago disponible en efectivo o QR.</div></div>
    </section>
  </main>;
}
export default ProductDetailPage;
