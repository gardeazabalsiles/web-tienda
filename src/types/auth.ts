export type UserRole = "ADMIN" | "USUARIO";


export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  direccion: string;
  telefono: string;
}


export interface UserRecord extends User {
  contraseña: string;
}


export interface LoginCredentials {
  email: string;
  password: string;
}


export interface RegistrationData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  password: string;
  direccion: string;
  rol: "USUARIO";
}
