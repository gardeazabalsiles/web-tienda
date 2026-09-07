import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps { error?: string; onSubmit: (credentials: LoginCredentials) => void; onCreateAccount: () => void; }

function LoginForm({ error, onSubmit, onCreateAccount }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) return;
    onSubmit({ email: normalizedEmail, password });
  };
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-brand">TuTiendaModa</div>
      <h1>Iniciar sesión</h1>
      <p className="auth-form__intro">Compra y vende moda en Bolivia.</p>
      <div><label htmlFor="email">Correo electrónico</label><input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu correo electrónico" autoComplete="email" required /></div>
      <div><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" autoComplete="current-password" required /></div>
      {error && <p className="auth-error" role="alert" aria-live="polite">{error}</p>}
      <button className="auth-primary" type="submit">Entrar</button>
      <p className="auth-form__alternate">¿Aún no tienes cuenta? <button className="auth-form__link" type="button" onClick={onCreateAccount}>Crear cuenta</button></p>
    </form>
  );
}
export default LoginForm;
