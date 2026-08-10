import { useNavigate } from "react-router-dom";


import { authRepository } from "../repositories/authRepository";


function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();


  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };


  return (
    <main>
      <h1>Página principal</h1>


      {user ? (
        <>
            <p>Bienvenido, {user.nombre}</p>
          <p>Email: {user.email}</p>
          <p>Rol: {user.rol}</p>
          <p>Dirección: {user.direccion}</p>
          <p>Teléfono: {user.telefono}</p>

          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <p>No existe una sesión activa.</p>
      )}
    </main>
  );
}


export default HomePage;

