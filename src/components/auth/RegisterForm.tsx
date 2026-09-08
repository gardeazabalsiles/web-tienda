import { useState } from "react";
import type { FormEventHandler } from "react";
import type { RegistrationData } from "../../types/auth";
import "./LoginForm.css";

interface RegisterFormProps { error?: string; onSubmit: (data: RegistrationData) => void; onLogin: () => void; }

const locations = ["La Paz", "El Alto", "Cochabamba", "Santa Cruz", "Oruro", "Potosí", "Chuquisaca", "Tarija", "Beni", "Pando"];

function RegisterForm({ error, onSubmit, onLogin }: RegisterFormProps) {
  const [data, setData] = useState<RegistrationData>({ nombre: "", apellido: "", telefono: "", email: "", password: "", direccion: "", departamento: "", rol: "USUARIO" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const updateField = <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => setData((current) => ({ ...current, [field]: value }));
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault(); setLocalError("");
    const clean = { ...data, nombre: data.nombre.trim(), apellido: data.apellido.trim(), telefono: data.telefono.trim(), email: data.email.trim().toLowerCase(), direccion: data.direccion.trim(), departamento: data.departamento.trim() };
    if (clean.password.length < 6) return setLocalError("La contraseña debe tener al menos 6 caracteres.");
    if (clean.password !== confirmPassword) return setLocalError("Las contraseñas no coinciden.");
    onSubmit(clean);
  };
  return <form className="auth-form auth-form--register" onSubmit={handleSubmit}>
    <div className="auth-brand">TuTiendaModa</div><h1>Crear cuenta</h1><p className="auth-form__intro">Compra y vende prendas entre personas de Bolivia.</p>
    <div className="auth-form__grid"><div><label htmlFor="nombre">Nombre</label><input id="nombre" value={data.nombre} onChange={(e) => updateField("nombre", e.target.value)} autoComplete="given-name" required /></div><div><label htmlFor="apellido">Apellido</label><input id="apellido" value={data.apellido} onChange={(e) => updateField("apellido", e.target.value)} autoComplete="family-name" required /></div></div>
    <div className="auth-form__grid"><div><label htmlFor="telefono">Teléfono</label><input id="telefono" type="tel" inputMode="tel" placeholder="70000000" value={data.telefono} onChange={(e) => updateField("telefono", e.target.value)} required /></div><div><label htmlFor="departamento">Ubicación</label><select id="departamento" value={data.departamento} onChange={(e) => updateField("departamento", e.target.value)} required><option value="">Selecciona tu ubicación</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}</select></div></div>
    <div><label htmlFor="direccion">Dirección / zona</label><input id="direccion" placeholder="Ej. Sopocachi, La Paz" value={data.direccion} onChange={(e) => updateField("direccion", e.target.value)} required /></div>
    <div><label htmlFor="register-email">Correo electrónico</label><input id="register-email" type="email" value={data.email} onChange={(e) => updateField("email", e.target.value)} autoComplete="email" required /></div>
    <div><label htmlFor="register-password">Contraseña</label><input id="register-password" type="password" minLength={6} value={data.password} onChange={(e) => updateField("password", e.target.value)} autoComplete="new-password" required /></div>
    <div><label htmlFor="confirm-password">Confirmar contraseña</label><input id="confirm-password" type="password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required /></div>
    {(localError || error) && <p className="auth-error" role="alert" aria-live="polite">{localError || error}</p>}
    <button className="auth-primary" type="submit">Crear cuenta</button><p className="auth-form__alternate">¿Ya tienes cuenta? <button className="auth-form__link" type="button" onClick={onLogin}>Iniciar sesión</button></p>
  </form>;
}
export default RegisterForm;
