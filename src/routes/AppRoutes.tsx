import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";
import PublishProductPage from "../pages/PublishProductPage";
import ChatPage from "../pages/ChatPage";
import ChatContactsPage from "../pages/ChatContactsPage";
import CategoryPage from "../pages/CategoryPage";
import AdminPage from "../pages/AdminPage";

export default function AppRoutes(){return <BrowserRouter><Routes><Route path="/" element={<HomePage/>}/><Route path="/categoria/:category" element={<CategoryPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/crear-cuenta" element={<RegisterPage/>}/><Route path="/producto/:id" element={<ProductDetailPage/>}/><Route path="/carrito" element={<CartPage/>}/><Route path="/perfil" element={<ProfilePage/>}/><Route path="/publicar" element={<PublishProductPage/>}/><Route path="/chat" element={<ChatContactsPage/>}/><Route path="/chat/:userId" element={<ChatPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/admin/vendedor/:sellerId" element={<AdminPage/>}/><Route path="*" element={<HomePage/>}/></Routes></BrowserRouter>}
