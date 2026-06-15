const _supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// Função de Login Simplificada
async function login() {
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();
    
    // Diagnóstico
    console.log("Tentando logar com:", user, pass);

    const { data, error } = await _supabase
        .from('usuarios')
        .select('usuario, senha, status, nivel')
        .eq('usuario', user)
        .eq('senha', pass)
        .maybeSingle();

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
