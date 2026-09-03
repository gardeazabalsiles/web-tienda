import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import { authRepository } from "../../repositories/authRepository";
import type { RegistrationData } from "../../types/auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (authRepository.isAuthenticated()) return <Navigate to="/" replace />;

  const handleRegister = (data: RegistrationData) => {
    setError("");

    const user = authRepository.register(data);

    if (!user) {
      setError("Ya existe una cuenta registrada con este correo electrónico.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="auth-page">
      <RegisterForm
        error={error}
        onSubmit={handleRegister}
        onLogin={() => navigate("/login")}
      />
    </main>
  );
}

export default RegisterPage;
