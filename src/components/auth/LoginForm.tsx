import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";


interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
  onCreateAccount: () => void;
}


function LoginForm({ error, onSubmit, onCreateAccount }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();


    const normalizedEmail = email.trim();


    if (!normalizedEmail || !password) {
      return;
    }


    onSubmit({
      email: normalizedEmail,
      password,
    });
  };


  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>


      <div>
        <label htmlFor="email">Email</label>


        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Ingrese su email"
          autoComplete="email"
          required
        />
      </div>


      <div>
        <label htmlFor="password">Contraseña</label>


        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          required
        />
      </div>


      {error && (
        <p role="alert" aria-live="polite">
          {error}
        </p>
      )}


      <button type="submit">Ingresar</button>

      <p className="auth-form__alternate">
        ¿Aún no tienes cuenta?{" "}
        <button className="auth-form__link" type="button" onClick={onCreateAccount}>
          Crear cuenta
        </button>
      </p>
    </form>
  );
}


export default LoginForm;
