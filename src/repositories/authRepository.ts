import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type {
  LoginCredentials,
  RegistrationData,
  User,
  UserRecord,
} from "../types/auth";


const SESSION_KEY = "app_session";
const USERS_KEY = "app_users";


const defaultUsers = initialUsers as UserRecord[];


const getUsers = (): UserRecord[] =>
  storageService.get<UserRecord[]>(USERS_KEY) ?? defaultUsers;


const toSessionUser = (user: UserRecord): User => ({
  id: user.id,
  nombre: user.nombre,
  apellido: user.apellido,
  email: user.email,
  rol: user.rol,
  direccion: user.direccion,
  telefono: user.telefono,
});


export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const normalizedEmail = credentials.email.trim().toLowerCase();

    const foundUser = getUsers().find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.contraseña === credentials.password
    );


    if (!foundUser) {
      return null;
    }


    const sessionUser = toSessionUser(foundUser);


    storageService.set<User>(SESSION_KEY, sessionUser);


    return sessionUser;
  },


  register(data: RegistrationData): User | null {
    const users = getUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      return null;
    }

    const newUser: UserRecord = {
      id: `user-${Date.now()}`,
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: normalizedEmail,
      contraseña: data.password,
      rol: data.rol,
      direccion: data.direccion,
      telefono: data.telefono.trim(),
    };

    storageService.set<UserRecord[]>(USERS_KEY, [...users, newUser]);

    const sessionUser = toSessionUser(newUser);
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