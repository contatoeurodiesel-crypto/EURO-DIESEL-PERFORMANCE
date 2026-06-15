const _supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// Função de Login Simplificada
async function login() {
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();
    
    // Diagnóstico
    console.log("Tentando logar com:", user, pass);

    // ... dentro da função login, substitua o bloco do .eq ...
    // Apenas para teste, substitua o bloco do .eq('senha', pass)
const { data, error } = await _supabase
        .from('usuarios')
        .select('usuario, senha, status, nivel')
        .eq('usuario', user)
        .eq('senha', pass) // REMOVA o // daqui
        .maybeSingle();
    // ... logo após o const { data, error } = ...
console.log("Dados retornados pelo banco:", data); 

if (data && data.status !== 'APROVADO') {
    console.log("O status lido foi:", data.status);
}

    if (error) {
        alert("Erro no Banco: " + error.message);
        return;
    }

    if (!data) {
        alert("USUÁRIO OU SENHA INCORRETOS!");
    } else if (data.status !== 'APROVADO') {
        alert("CONTA PENDENTE! Aguarde aprovação do Master.");
    } else {
        localStorage.setItem('usuarioLogado', data.usuario);
        // Redireciona
        window.location.href = data.nivel === 'MASTER' ? "admin/master.html" : "home.html";
    }
}

// Função de Toggle (para não quebrar seu index.html)
function toggleSenha() {
    let input = document.getElementById('pass');
    let btn = document.getElementById('btnMostrar');
    input.type = (input.type === 'password') ? 'text' : 'password';
    btn.innerText = (input.type === 'password') ? 'MOSTRAR' : 'OCULTAR';
}

async function verificarAcessoMaster() {
    const userLogado = localStorage.getItem('usuarioLogado');
    if (!userLogado) {
        window.location.href = "../index.html";
        return;
    }
    // Opcional: Adicionar verificação se o nível no banco ainda é MASTER
}

async function carregarPendentes() {
    const listaDiv = document.getElementById('listaUsuarios');
    
    const { data, error } = await _supabase
        .from('usuarios')
        .select('*')
        .eq('status', 'PENDENTE');

    if (error) {
        listaDiv.innerHTML = "Erro ao carregar: " + error.message;
        return;
    }

    if (data.length === 0) {
        listaDiv.innerHTML = "NENHUM USUÁRIO PENDENTE.";
        return;
    }

    let html = "";
    data.forEach(user => {
        html += `<div style="border:1px solid #E7272D; padding:10px; margin:5px;">
                    <p>NOME: ${user.nome || 'NÃO INFORMADO'}</p>
                    <p>USUÁRIO: ${user.usuario}</p>
                    <p>TELEFONE: ${user.telefone || 'NÃO INFORMADO'}</p>
                    <p>TOKEN: <b>${user.token || 'SEM TOKEN'}</b></p>
                    <button onclick="aprovarUsuario('${user.usuario}')">APROVAR</button>
                 </div>`;
    });
    listaDiv.innerHTML = html;
}

async function aprovarUsuario(usuario) {
    const { error } = await _supabase
        .from('usuarios')
        .update({ status: 'APROVADO' })
        .eq('usuario', usuario);

    if (error) {
        alert("Erro ao aprovar: " + error.message);
    } else {
        alert("USUÁRIO APROVADO!");
        carregarPendentes(); // Recarrega a lista
    }
}

// Função para gerar tokens aleatórios
function gerarToken(partes) {
    let formato = "";
    for (let i = 0; i < partes; i++) {
        formato += Math.random().toString(36).substring(2, 5).toUpperCase();
        if (i < partes - 1) formato += "-";
    }
    return formato;
}

// Função para gerar tokens aleatórios
function gerarToken(partes) {
    let formato = "";
    for (let i = 0; i < partes; i++) {
        formato += Math.random().toString(36).substring(2, 5).toUpperCase();
        if (i < partes - 1) formato += "-";
    }
    return formato;
}

async function solicitarCadastro() {
    let nome = document.getElementById('nome').value.trim();
    let user = document.getElementById('usuario').value.trim().toUpperCase();
    let pass = document.getElementById('senha').value.trim();
    let tel = document.getElementById('ddi').value + document.getElementById('telefone').value.trim();
    let tokenSolicitacao = gerarToken(3); // XXX-XXX-XXX

    const { error } = await _supabase.from('usuarios').insert([{ 
        nome, usuario: user, senha: pass, telefone: tel, 
        token: tokenSolicitacao, status: 'PENDENTE', nivel: 'COMUM' 
    }]);

    if (error) alert("Erro: " + error.message);
    else alert("SOLICITAÇÃO ENVIADA! Token: " + tokenSolicitacao);
}

async function ativarConta() {
    let user = document.getElementById('usuario').value.trim().toUpperCase();
    let tokenDigitado = document.getElementById('token').value.trim();

    // Busca o usuário pelo token único
    const { data, error } = await _supabase.from('usuarios')
        .select('*').eq('usuario', user).eq('token', tokenDigitado).maybeSingle();

    if (!data) { alert("TOKEN INVÁLIDO!"); return; }

    let novoTokenAtivacao = gerarToken(4); // XXX-XXX-XXX-XXX
    const { error: updateError } = await _supabase.from('usuarios')
        .update({ status: 'APROVADO', token: novoTokenAtivacao })
        .eq('usuario', user);

    if (updateError) alert("Erro ao ativar.");
    else {
        localStorage.setItem('usuarioLogado', user);
        alert("CONTA ATIVADA! Seu código de acesso único é: " + novoTokenAtivacao);
        window.location.href = "home.html";
    }
}
