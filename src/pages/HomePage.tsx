import { useState } from "react";
import type { FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";


import { authRepository } from "../repositories/authRepository";
import "./HomePage.css";


interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
}


function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");


  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };


  const handleAddProduct: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();


    const name = productName.trim();
    const category = productCategory.trim();
    const price = productPrice.trim();


    if (!name || !category || !price) {
      return;
    }


    setProducts((currentProducts) => [
      ...currentProducts,
      {
        id: Date.now(),
        name,
        category,
        price,
      },
    ]);
    setProductName("");
    setProductCategory("");
    setProductPrice("");
  };


  return (
    <main className="home-page">
      <nav className="home-navbar" aria-label="Navegación principal">
        <a className="home-navbar__brand" href="/">
          Tu TiendaModa
        </a>


        <ul className="home-navbar__links">
          <li>
            <a className="home-navbar__link" href="#productos">
              Productos
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#categorias">
              Categorías
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#carrito">
              Carrito
            </a>
          </li>
          <li>
            <a className="home-navbar__link" href="#mi-cuenta">
              Mi cuenta
            </a>
          </li>
        </ul>
      </nav>


      <section className="home-hero">
        <div className="home-hero__image-wrapper">
          <img
            className="home-hero__image"
            src="/images/hero-woman.svg"
            alt="Mujer sonriendo con chaqueta de jean"
          />
        </div>


        <div className="home-hero__text">
          <h1>Encuentra tu estilo</h1>
          <div className="home-hero__divider" />
          <p>La mejor moda para ti</p>
          <a className="home-hero__button" href="#productos">
            Ver Productos
          </a>
        </div>
      </section>


      <section className="products-section" id="productos">
        <div>
          <p className="products-section__eyebrow">Productos</p>
          <h2>Agrega productos a tu tienda</h2>
        </div>


        <form className="product-form" onSubmit={handleAddProduct}>
          <label htmlFor="product-name">Nombre del producto</label>
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="Ej. Chaqueta denim"
            required
          />


          <label htmlFor="product-category">Categoría</label>
          <input
            id="product-category"
            type="text"
            value={productCategory}
            onChange={(event) => setProductCategory(event.target.value)}
            placeholder="Ej. Moda mujer"
            required
          />


          <label htmlFor="product-price">Precio</label>
          <input
            id="product-price"
            type="text"
            value={productPrice}
            onChange={(event) => setProductPrice(event.target.value)}
            placeholder="Ej. 120 Bs"
            required
          />


          <button className="product-form__button" type="submit">
            Agregar producto
          </button>
        </form>


        <div className="product-list" aria-live="polite">
          {products.length > 0 ? (
            products.map((product) => (
              <article className="product-card" key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <strong>{product.price}</strong>
              </article>
            ))
          ) : (
            <p className="product-list__empty">
              Aún no agregaste productos. Usa el formulario para comenzar.
            </p>
          )}
        </div>
      </section>


      <section className="home-content" id="mi-cuenta">
        <h1>Página principal</h1>


        {user ? (
          <>
            <p>Bienvenido, {user.nombre}</p>
            <p>Email: {user.email}</p>
            <p>Rol: {user.rol}</p>
            <p>Dirección: {user.direccion}</p>
            <p>Teléfono: {user.telefono}</p>


            <button
              className="home-content__logout"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <p>No existe una sesión activa.</p>
        )}
      </section>
    </main>
  );
}


export default HomePage;

