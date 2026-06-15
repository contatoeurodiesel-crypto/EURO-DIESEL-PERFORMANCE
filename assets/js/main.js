// A biblioteca já cria a variável 'supabase', não precisamos recriar aqui.
const _supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// Função de Mostrar/Ocultar Senha
function toggleSenha() {
    let inputPass = document.getElementById('pass');
    let btn = document.getElementById('btnMostrar');
    
    if (inputPass.type === 'password') {
        inputPass.type = 'text';
        btn.innerText = 'OCULTAR';
    } else {
        inputPass.type = 'password';
        btn.innerText = 'MOSTRAR';
    }
}

// Login
async function login() {
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();

    try {
        const { data, error } = await _supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', user)
            .eq('senha', pass)
            .maybeSingle();

        if (error) {
            alert("Erro de conexão: " + error.message);
        } else if (!data) {
            alert("USUÁRIO OU SENHA INCORRETOS!");
        } else {
            alert("BEM-VINDO, " + data.nome);
            if (data.nivel === 'MASTER') {
                window.location.href = "admin/master.html";
            }
        }
    } catch (e) {
        alert("Erro inesperado: " + e.message);
    }
}

// Cadastro (Única versão correta)
async function cadastrar() {
    let nome = document.getElementById('nome').value;
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();

    if (!nome || !user || !pass) {
        alert("POR FAVOR, PREENCHA TODOS OS CAMPOS!");
        return;
    }

    try {
        const { error } = await _supabase
            .from('usuarios')
            .insert([{ nome: nome, usuario: user, senha: pass, nivel: 'COMUM' }]);

        if (error) {
            alert("Erro ao cadastrar: " + error.message);
        } else {
            alert("CADASTRO REALIZADO COM SUCESSO!");
            window.location.href = "index.html";
        }
    } catch (e) {
        alert("Erro inesperado: " + e.message);
    }
}
