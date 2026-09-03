import { useState } from "react";
import type { FormEventHandler } from "react";
import type { RegistrationData } from "../../types/auth";

import "./LoginForm.css";


interface RegisterFormProps {
  error?: string;
  onSubmit: (data: RegistrationData) => void;
  onLogin: () => void;
}


const bolivianLocations = [
  "La Paz", "Cochabamba", "Santa Cruz", "Chuquisaca", "Oruro",
  "Potosí", "Tarija", "Beni", "Pando",
];


function RegisterForm({ error, onSubmit, onLogin }: RegisterFormProps) {
  const [data, setData] = useState<RegistrationData>({
    nombre: "", apellido: "", telefono: "", email: "", password: "", direccion: "",
  });

  const updateField = <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => {
    setData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit({ ...data, email: data.email.trim(), nombre: data.nombre.trim(), apellido: data.apellido.trim() });
  };

  return (
    <form className="auth-form auth-form--register" onSubmit={handleSubmit}>
      <h1>Crea tu cuenta</h1>
      <p className="auth-form__intro">Al crear tu cuenta podrás comprar y vender moda en Bolivia.</p>

      <div className="auth-form__grid">
        <div><label htmlFor="nombre">Nombre</label><input id="nombre" value={data.nombre} onChange={(event) => updateField("nombre", event.target.value)} autoComplete="given-name" required /></div>
        <div><label htmlFor="apellido">Apellido</label><input id="apellido" value={data.apellido} onChange={(event) => updateField("apellido", event.target.value)} autoComplete="family-name" required /></div>
      </div>
      <div><label htmlFor="telefono">Teléfono</label><input id="telefono" type="tel" value={data.telefono} onChange={(event) => updateField("telefono", event.target.value)} placeholder="Ej. 70000000" autoComplete="tel" required /></div>
      <div><label htmlFor="register-email">Correo electrónico</label><input id="register-email" type="email" value={data.email} onChange={(event) => updateField("email", event.target.value)} autoComplete="email" required /></div>
      <div><label htmlFor="register-password">Crea una contraseña</label><input id="register-password" type="password" value={data.password} onChange={(event) => updateField("password", event.target.value)} minLength={4} autoComplete="new-password" required /></div>
      <div><label htmlFor="direccion">Lugar donde comprarás o venderás</label><select id="direccion" value={data.direccion} onChange={(event) => updateField("direccion", event.target.value)} required><option value="" disabled>Selecciona un departamento de Bolivia</option>{bolivianLocations.map((location) => <option key={location} value={location}>{location}, Bolivia</option>)}</select></div>

      {error && <p role="alert" aria-live="polite">{error}</p>}
      <button type="submit">Crear cuenta</button>
      <p className="auth-form__alternate">¿Ya tienes cuenta? <button className="auth-form__link" type="button" onClick={onLogin}>Iniciar sesión</button></p>
    </form>
  );
}


export default RegisterForm;
