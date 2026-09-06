import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";

function AppRoutes() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/crear-cuenta" element={<RegisterPage />} />
    <Route path="/producto/:id" element={<ProductDetailPage />} />
    <Route path="/carrito" element={<CartPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes></BrowserRouter>;
}
export default AppRoutes;
