import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import "./HomePage.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  status: "Nuevo" | "Usado";
  size: string;
  images: string[];
}

const PRODUCTS_KEY = "app_products";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [products, setProducts] = useState<Product[]>(() =>
    storageService.get<Product[]>(PRODUCTS_KEY) ?? [],
  );
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStatus, setProductStatus] = useState<Product["status"]>("Nuevo");
  const [productSize, setProductSize] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    storageService.set<Product[]>(PRODUCTS_KEY, products);
  }, [products]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const images = await Promise.all(files.map(fileToDataUrl));
    setProductImages(images);
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = productName.trim();
    const category = productCategory.trim();
    const price = productPrice.trim();

    if (!name || !category || !price || !productSize) {
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name,
      category,
      price,
      status: productStatus,
      size: productSize,
      images: productImages,
    };

    setProducts((currentProducts) => [...currentProducts, newProduct]);
    setProductName("");
    setProductCategory("");
    setProductPrice("");
    setProductStatus("Nuevo");
    setProductSize("");
    setProductImages([]);
  };

  return (
    <main className="home-page">
      <nav className="home-navbar" aria-label="Navegación principal">
        <a className="home-navbar__brand" href="/">
          TuTiendaModa
        </a>

        <ul className="home-navbar__links">
          <li><a className="home-navbar__link" href="#productos">Productos</a></li>
          <li><a className="home-navbar__link" href="#agregar-producto">Agregar producto</a></li>
          <li><a className="home-navbar__link" href="#mi-cuenta">Mi cuenta</a></li>
        </ul>
      </nav>

      <section className="home-hero">
        <div className="home-hero__image-slot" aria-label="Espacio para imagen principal">
          <span>Coloca aquí tu imagen principal</span>
        </div>

        <div className="home-hero__text">
          <h1>Encuentra tu estilo</h1>
          <div className="home-hero__divider" />
          <p>La mejor moda para ti</p>
          <a className="home-hero__button" href="#agregar-producto">Agregar producto</a>
        </div>
      </section>

      <section className="products-section" id="agregar-producto">
        <div className="products-section__heading">
          <p className="products-section__eyebrow">Mi tienda</p>
          <h2>Agregar producto</h2>
          <p>Registra la información de cada prenda que quieras publicar.</p>
        </div>

        <form className="product-form" onSubmit={handleAddProduct}>
          <div className="product-form__field product-form__field--wide">
            <label htmlFor="product-name">Nombre del producto</label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="Ej. Chaqueta de jean"
              required
            />
          </div>

          <div className="product-form__field">
            <label htmlFor="product-category">Categoría</label>
            <select
              id="product-category"
              value={productCategory}
              onChange={(event) => setProductCategory(event.target.value)}
              required
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Niños">Niños</option>
            </select>
          </div>

          <div className="product-form__field">
            <label htmlFor="product-price">Precio (Bs)</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={productPrice}
              onChange={(event) => setProductPrice(event.target.value)}
              placeholder="Ej. 120"
              required
            />
          </div>

          <div className="product-form__field">
            <label htmlFor="product-status">Estado</label>
            <select
              id="product-status"
              value={productStatus}
              onChange={(event) => setProductStatus(event.target.value as Product["status"])}
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>

          <div className="product-form__field">
            <label htmlFor="product-size">Talla</label>
            <select
              id="product-size"
              value={productSize}
              onChange={(event) => setProductSize(event.target.value)}
              required
            >
              <option value="" disabled>Selecciona una talla</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="Única">Única</option>
            </select>
          </div>

          <div className="product-form__field product-form__field--wide">
            <label htmlFor="product-images">Imágenes del producto</label>
            <input
              id="product-images"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImageChange}
            />
            <small>Puedes seleccionar una o varias imágenes.</small>
          </div>

          {productImages.length > 0 && (
            <div className="product-form__preview" aria-label="Vista previa de imágenes">
              {productImages.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`Vista previa ${index + 1}`} />
              ))}
            </div>
          )}

          <button className="product-form__button" type="submit">
            Agregar producto
          </button>
        </form>
      </section>

      {products.length > 0 && (
        <section className="products-section products-section--list" id="productos">
          <div className="products-section__heading">
            <p className="products-section__eyebrow">Mis productos</p>
            <h2>Productos agregados</h2>
          </div>

          <div className="product-list" aria-live="polite">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-card__image">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </div>
                <div className="product-card__content">
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <div className="product-card__details">
                    <span>{product.status}</span>
                    <span>Talla {product.size}</span>
                  </div>
                  <strong>{product.price} Bs</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="home-content" id="mi-cuenta">
        <h2>Mi cuenta</h2>
        <p>Bienvenido, {user.nombre} {user.apellido}</p>
        <p>Email: {user.email}</p>
        <p>Rol: {user.rol}</p>
        <button className="home-content__logout" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}

export default HomePage;
