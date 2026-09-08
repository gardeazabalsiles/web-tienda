import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { User } from "../types/auth";
import type { ChatMessage } from "../types/commerce";
import "./ChatPage.css";

export default function ChatPage(){
 const nav=useNavigate(); const {userId}=useParams(); const me=authRepository.getCurrentUser(); const users=storageService.get<User[]>("app_users")??[]; const other=users.find(u=>u.id===userId); const cid=[me?.id,userId].sort().join("-"); const [text,setText]=useState(""); const [messages,setMessages]=useState<ChatMessage[]>(()=>{const all=storageService.get<ChatMessage[]>("app_messages")??[];return all.filter(m=>m.conversationId===cid)});
 useEffect(()=>{const refresh=()=>{const all=storageService.get<ChatMessage[]>("app_messages")??[];setMessages(all.filter(m=>m.conversationId===cid))};const timer=window.setInterval(refresh,250);window.addEventListener("storage",refresh);return()=>{window.clearInterval(timer);window.removeEventListener("storage",refresh)}},[cid]);
 if(!me)return <Navigate to="/login" replace/>; if(!other)return <main className="chat-page"><h1>Usuario no encontrado</h1></main>;
 const send=()=>{const clean=text.trim();if(!clean)return;const all=storageService.get<ChatMessage[]>("app_messages")??[];const m:ChatMessage={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,conversationId:cid,senderId:me.id,senderName:`${me.nombre} ${me.apellido}`,text:clean,createdAt:new Date().toISOString()};const next=[...all,m];storageService.set("app_messages",next);setMessages(next.filter(message=>message.conversationId===cid));setText("")};
 return <main className="chat-page"><header><button onClick={()=>nav("/")}>TuTiendaModa</button><span>Chat con {other.nombre} {other.apellido}</span></header><section className="chat-box"><div className="chat-messages">{messages.length===0?<p>Escribe para coordinar la compra, entrega o pago.</p>:messages.map(m=><div className={m.senderId===me.id?"bubble mine":"bubble"} key={m.id}>{m.text}<small>{new Date(m.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div>)}</div><div className="chat-input"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..."/><button onClick={send}>ENVIAR</button></div></section></main>;
}
