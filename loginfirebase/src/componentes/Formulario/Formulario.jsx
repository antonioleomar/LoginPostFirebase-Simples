import React from 'react'
import './formulario.css'
import {useState, useEffect} from 'react'


//imports do Firebase:
import {db, auth} from '../../firebaseConnection'  //config da ligação App com Firebase
import {collection, addDoc, deleteDoc, onSnapshot} from 'firebase/firestore'  // post com id automático
import { doc, setDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore' //post com id informado manual

import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'


function Formulario(){

    //useState: Vamos atribuir os valores dos campos aos states
    const [titulo, setTitulo] = useState("")  
    const [autor, setAutor] = useState("")
    const [todosPosts, setTodosPosts] = useState([])
    const [idPost, setIdPost] = useState("")
    const [email, setemail] = useState("")
    const [senha, setSenha] = useState("")
    const [user, setUser] = useState(false)
    const [userDetail, setUserDetail] = useState({})
    
    //useEffect:
    useEffect(()=>{
        async function loadPosts(){
            const unsub = onSnapshot(collection(db,"pots"), (snapshot)=>{
                const lista = []
                snapshot.forEach((item)=>{
                    lista.push({
                        id: item.id,
                        titulo: item.data().titulo,
                        autor: item.data().autor
                    })
                })
                setTodosPosts(lista)
            })  
        }        
        loadPosts() 
    }, [])

    useEffect(()=>{
        async function checkLogin(){
            onAuthStateChanged(auth, (user)=>{
                if(user){
                    //se tem usuário logado entra aqui
                    setUser(true)
                    setUserDetail({
                        uid: user.uid,
                        email: user.email
                    })

                }
                else{
                    //se não tem usuário logado
                    setUser("")
                    setUserDetail({})
                }
            })
        }
        checkLogin()
    }, [])
    
    //funções:
    async function cadastrar(){      
        
        // await setDoc(doc(db, "posts", "12345"), {
        //   titulo: titulo,
        //   autor: autor,
        // })
        // .then(() => {
        //   console.log("DADOS REGISTRADO NO BANCO!")
        // })
        // .catch((error) => {
        //   console.log("GEROU ERRO" + error)
        // }) 

        await addDoc(collection(db, 'pots'), {
            titulo: titulo,
            autor: autor
        })
        .then(()=>{
            alert("Cadastrado com sucesso")
            setTitulo("")
            setAutor("")
        
        })
        .catch(()=>{alert("Erro ao cadastrar")})
    }

    async function buscar(){

        const postRef = doc(db, "pots", idPost)
        await getDoc(postRef)
        .then((snapshot)=>{
            setTitulo(snapshot.data().titulo)
            setAutor(snapshot.data().autor) 
        })
        .catch(()=>{
            alert("Erro ao buscar dado")
        })       
    }

    async function buscarTodos(){

        const postRef = collection(db, 'pots')
        await getDocs(postRef)
        .then((snapshot)=>{
            const lista = []
            snapshot.forEach((item)=>{
                lista.push({
                    id: item.id,
                    titulo: item.data().titulo,
                    autor: item.data().autor
                })
            })
            setTodosPosts(lista)
        })
        .catch(()=>{
            alert("Erro ao buscar dados")
        })
    }

    async function atualizar(){
        const doctRef = doc(db, 'pots', idPost)
        await updateDoc(doctRef,{
            titulo: titulo,
            autor: autor
        })
        .then(()=>{
            alert("Atualização com sucesso")
            setIdPost("")
            setAutor("")
            setTitulo("")
        })
        .catch((erro)=>{
            alert("Erro ao atualizar" + erro)
        })
    }
    
    async function excluir(id){
        const docRef = doc(db, 'pots', id)
        await deleteDoc(docRef)
        .then(()=>{
            alert("Excluido com sucesso")
        })
        .catch((erro)=>{
            alert("Erro ao excluir" + erro)
        })
    }

    async function cadastrarUsuario(){
        await createUserWithEmailAndPassword(auth, email, senha) 
        .then(()=>{
            alert("Cadastrado com sucesso!")
            setemail = ''
            setSenha = ''
        }) 
        .catch((error)=>{
            if(error.code === 'auth/weak-password'){
                alert('Senha fraca')
            }
            else if(error.code === 'auth/email-already-in-use'){
                alert("Email já existe!")
            }
        })      
    }

    async function login(){
        await signInWithEmailAndPassword(auth, email, senha)
        .then((value)=>{
            setUserDetail({
                uid: value.user.uid,
                email: value.user.email
            })
            setUser(true)
            setemail("")
            setSenha("")
        })
        .catch(()=>alert("Erro"))
    }

    async function fazerLogout(){
        await signOut(auth)
        setUser(false);
        setUserDetail({})
      }

    return(
        <div>
            <h2>Projeto React e Firebase</h2>
            <hr/>
            <h2>Login</h2>

            { user && (
                    <div>
                    <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br/>
                    <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br/>
                    <button onClick={fazerLogout}>Sai da conta</button>
                    <br/> <br/>
                    </div>
            )}

            <div className='container'>
                <label>Email:</label>
                <input value={email} onChange={(e)=>{setemail(e.target.value)}} placeholder="Digite seu email"></input>
                <label>Senha:</label>
                <input value={senha} onChange={(e)=>{setSenha(e.target.value)}} placeholder="Digite sua senha"></input>
                <button onClick={cadastrarUsuario}>Cadastrar</button>
                <button onClick={login}>Login</button>
            </div>
            <hr/>
            <h2>Pesquisa</h2>

            <div className='container'>

                <label>ID do Post</label>
                <input placeholder='Digite o ID do post a ser alterado' value={idPost} onChange={(e)=>setIdPost(e.target.value)}></input>

                <label>Título:</label>
                <textarea placeholder='Digite o título' value={titulo} onChange={(e)=>{setTitulo(e.target.value)}}></textarea>

                <labe>Autor:</labe>
                <input type='text' placeholder='Autor do post' value={autor} onChange={(e)=>{setAutor(e.target.value)}}></input>

                <button onClick={cadastrar}>Cadastrar</button>

                <button onClick={buscar}>Buscar</button>

                <button onClick={buscarTodos}>Buscar todos</button>

                <button onClick={atualizar}>Atualizar</button>

                <ul>
                    {todosPosts.map((item)=>{
                        return(
                            <li>
                               <span>ID: {item.id}</span> <br/>
                               <span>titulo: {item.titulo}</span> <br/>
                               <span>autor: {item.autor}</span>  <br/>
                               <button onClick={()=>excluir(item.id)}>Excluir</button>
                               <br/> <br/>                             
                            </li>
                        )
                    })
                    }
                </ul>

            </div>
        </div>
    )
}
export default Formulario