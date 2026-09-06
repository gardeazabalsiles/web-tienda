import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { CartItem } from "../types/marketplace";
import "./CartPage.css";

const CART_KEY = "app_cart";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => storageService.get<CartItem[]>(CART_KEY) ?? []);
  const [payment, setPayment] = useState<"efectivo" | "qr">("efectivo");
  const [ordered, setOrdered] = useState(false);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  if (!authRepository.isAuthenticated()) { navigate("/login", { replace: true }); return null; }
  const update = (next: CartItem[]) => { setCart(next); storageService.set(CART_KEY, next); };
  const remove = (index: number) => update(cart.filter((_, i) => i !== index));
  const confirmOrder = () => { if (!cart.length) return; setOrdered(true); update([]); };

  return <main className="cart-page"><header className="cart-header"><button onClick={() => navigate("/")}>TuTiendaModa</button><span>Mi carrito</span></header>
    <section className="cart-content"><div className="cart-items"><button className="back-store" onClick={() => navigate("/")}>← Seguir comprando</button>{cart.length === 0 ? <div className="cart-empty"><h1>{ordered ? "¡Pedido registrado!" : "Tu carrito está vacío"}</h1><p>{ordered ? `Elegiste pagar con ${payment === "efectivo" ? "efectivo" : "QR"}. Coordina la entrega con el vendedor.` : "Agrega una prenda desde la tienda para continuar."}</p><button onClick={() => navigate("/")}>EXPLORAR PRENDAS</button></div> : <>{cart.map((item, index) => <article className="cart-item" key={`${item.product.id}-${item.size}`}><div className="cart-item-image">{item.product.images[0] ? <img src={item.product.images[0]} alt={item.product.name} /> : <span>Sin imagen</span>}</div><div className="cart-item-info"><p>{item.product.category}</p><h2>{item.product.name}</h2><span>Talla: {item.size} · Estado: {item.product.status}</span><strong>Bs {(item.product.price * item.quantity).toFixed(2)}</strong><div className="quantity"><button onClick={() => update(cart.map((x,i)=>i===index?{...x,quantity:Math.max(1,x.quantity-1)}:x))}>−</button><span>{item.quantity}</span><button onClick={() => update(cart.map((x,i)=>i===index?{...x,quantity:x.quantity+1}:x))}>+</button></div><button className="remove" onClick={() => remove(index)}>Eliminar</button></div></article>)}</>}</div>
      {cart.length > 0 && <aside className="checkout"><h2>Resumen de compra</h2><div><span>Subtotal</span><strong>Bs {subtotal.toFixed(2)}</strong></div><div><span>Entrega</span><strong>A coordinar</strong></div><hr/><div className="total"><span>Total</span><strong>Bs {subtotal.toFixed(2)}</strong></div><h3>Método de pago</h3><label className={payment === "efectivo" ? "payment selected" : "payment"}><input type="radio" checked={payment === "efectivo"} onChange={() => setPayment("efectivo")} /> 💵 Efectivo</label><label className={payment === "qr" ? "payment selected" : "payment"}><input type="radio" checked={payment === "qr"} onChange={() => setPayment("qr")} /> ▣ QR</label>{payment === "qr" && <div className="qr-box"><strong>QR de pago</strong><div>▦</div><small>En la siguiente etapa se conectará el QR real del vendedor.</small></div>}<button className="confirm-order" onClick={confirmOrder}>CONFIRMAR PEDIDO</button></aside>}</section>
  </main>;
}
export default CartPage;
