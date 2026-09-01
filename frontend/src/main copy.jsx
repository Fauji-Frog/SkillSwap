import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import "./style.css";

const API="http://localhost:5000/api";

function App(){
 const [page,setPage]=useState("login"),[user,setUser]=useState(null);
 const [posts,setPosts]=useState([]);
 const [search,setSearch]=useState("");
 
 const [form,setForm]=useState({});
const [message,setMessage]=useState("");
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const load=()=>fetch(API+"/posts").then(r=>r.json()).then(setPosts);const showMessage=(text)=>{
 setMessage(text);
 setTimeout(()=>setMessage(""),5000);
};

 const signup=e=>{
  e.preventDefault();
  fetch(API+"/signup",{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify(form)}).then(r=>r.json()).then(x=>showMessage(x.message));
 };

 const login=e=>{
  e.preventDefault();
  fetch(API+"/login",{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify(form)}).then(r=>r.json()).then(x=>{
    if(x.id){setUser(x);setPage("home");load()}else alert(x.message);
   });
 };

 const post=e=>{
  e.preventDefault();
  fetch(API+"/posts",{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({...form,user_id:user.id})}).then(r=>r.json()).then(x=>{
    alert(x.message);setForm({});load();setPage("home");
   });
 };

 if(!user && page==="login") return <Box title="SkillSwap"><form onSubmit={login}>
  <input name="email" placeholder="Email" onChange={change} required/>
  <input name="password" type="password" placeholder="Password" onChange={change} required/>
  <button>Login</button><p onClick={()=>setPage("signup")}>Create account</p>
 </form></Box>;

 if(!user && page==="signup") return <Box title="Join SkillSwap"><form onSubmit={signup}>
  {["name","email","password","student_id","batch","phone","description"].map((x)=>
   <input key={x} name={x} type={x==="password"?"password":"text"}
    placeholder={x.replace("_"," ").toUpperCase()} onChange={change} required={x!=="description"}/>)}
  <button>Sign Up</button><p onClick={()=>setPage("login")}>Already have an account?</p>
 </form></Box>;

 return <main>
 {message && <div className="message">{message}</div>}
 <header><b>SkillSwap</b><button onClick={()=>setPage("new")}>+ Create Swap</button>
 <button onClick={()=>{setUser(null);setPage("login")}}>Logout</button></header>
 {page==="new"?<Box title="Create SkillSwap"><form onSubmit={post}>
  <input name="teach_skill" placeholder="I can teach..." onChange={change} required/>
  <input name="learn_skill" placeholder="I want to learn..." onChange={change} required/>
  <textarea name="description" placeholder="About this swap..." onChange={change}/>
  <button>Post SkillSwap</button></form></Box>:
  <section><h2>Available SkillSwaps</h2>
  <input
  placeholder="Search what you want to learn..."
  value={search}
  onChange={e=>setSearch(e.target.value)}
/>{posts.filter(p =>
  p.learn_skill.toLowerCase().includes(search.toLowerCase())
).map(p=><article key={p.id}>
   <h3>{p.name}</h3><small>ID: {p.student_id} · Batch: {p.batch}</small>
   <p><b>Teaches:</b> {p.teach_skill}</p><p><b>Wants:</b> {p.learn_skill}</p>
   <p>{p.description}</p><p>{p.profile_description}</p>
  <button onClick={()=>showMessage(`Contact ${p.name}: ${p.phone}`)}>Connect / Call</button>
  </article>)}</section>}
 </main>
}

function Box({title,children}){return <main className="box"><h1>{title}</h1>{children}</main>}
createRoot(document.getElementById("root")).render(<App/>);
