import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";


import type { LoginCredentials } from "../../types/auth";


function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");


  if (authRepository.isAuthenticated()) {
    const currentUser = authRepository.getCurrentUser();
    return <Navigate to={currentUser?.rol === "ADMIN" ? "/admin" : "/"} replace />;
  }


  const handleLogin = (credentials: LoginCredentials) => {
    setError("");


    const user = authRepository.login(credentials);


    if (!user) {
      setError("El email o la contraseña son incorrectos.");
      return;
    }


    navigate(user.rol === "ADMIN" ? "/admin" : "/", { replace: true });
  };


  return (
    <main className="auth-page">
      <LoginForm
        error={error}
        onSubmit={handleLogin}
        onCreateAccount={() => navigate("/crear-cuenta")}
      />
    </main>
  );
}


export default LoginPage;