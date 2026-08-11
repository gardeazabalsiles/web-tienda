import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type {
  LoginCredentials,
  User,
  UserRecord,
} from "../types/auth";


const SESSION_KEY = "app_session";


const users = initialUsers as UserRecord[];


export const authRepository = {
  login(credentials: LoginCredentials): User | null {
      const normalizedEmail = credentials.email.trim().toLowerCase();

    const foundUser = users.find(
      (user) =>
          user.email.toLowerCase() === normalizedEmail &&
        user.contraseña === credentials.password
    );
    


    if (!foundUser) {
      return null;
    }


    const sessionUser: User = {
      id: foundUser.id,
       nombre: foundUser.nombre,
      email: foundUser.email,
      rol: foundUser.rol,
      direccion: foundUser.direccion,
      telefono: foundUser.telefono,
    };


    storageService.set<User>(SESSION_KEY, sessionUser);


    return sessionUser;
  },


  logout(): void {
    storageService.remove(SESSION_KEY);
  },


  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },


  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
