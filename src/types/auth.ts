export type UserRole = "ADMIN" | "USUARIO";


export interface User {
  id: string;
  nombre: string;
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
