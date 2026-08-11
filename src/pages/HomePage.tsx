import { useNavigate } from "react-router-dom";


import { authRepository } from "../repositories/authRepository";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();


  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
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

