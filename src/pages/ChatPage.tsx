import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import type { User } from "../types/auth";
import type { ChatMessage } from "../types/commerce";
import "./ChatPage.css";

export default function ChatPage(){
 const nav=useNavigate(); const {userId}=useParams(); const me=authRepository.getCurrentUser(); const users=storageService.get<User[]>("app_users")??[]; const other=users.find(u=>u.id===userId); const cid=[me?.id,userId].sort().join("-"); const [text,setText]=useState("");
 if(!me)return <Navigate to="/login" replace/>; if(!other)return <main className="chat-page"><h1>Usuario no encontrado</h1></main>;
 const all=storageService.get<ChatMessage[]>("app_messages")??[]; const messages=all.filter(m=>m.conversationId===cid);
 const send=()=>{if(!text.trim())return;const m:ChatMessage={id:String(Date.now()),conversationId:cid,senderId:me.id,senderName:`${me.nombre} ${me.apellido}`,text:text.trim(),createdAt:new Date().toISOString()};storageService.set("app_messages",[...all,m]);setText("")};
 return <main className="chat-page"><header><button onClick={()=>nav("/")}>TuTiendaModa</button><span>Chat con {other.nombre} {other.apellido}</span></header><section className="chat-box"><div className="chat-messages">{messages.length===0?<p>Escribe para coordinar la compra, entrega o pago.</p>:messages.map(m=><div className={m.senderId===me.id?"bubble mine":"bubble"} key={m.id}>{m.text}<small>{new Date(m.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div>)}</div><div className="chat-input"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe un mensaje..."/><button onClick={send}>ENVIAR</button></div></section></main>;
}
