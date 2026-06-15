// 1. Definição global da função
const gerarParte = () => Math.random().toString(36).substring(2, 5).toUpperCase();

const _supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// Função de Cadastro NORMAL
async function cadastrarComToken() {
    let nome = document.getElementById('nome').value;
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();
    let ddi = document.getElementById('ddi').value;
    let tel = document.getElementById('telefone').value;

    if (!nome || !user || !pass || !tel) {
        alert("POR FAVOR, PREENCHA TODOS OS CAMPOS!");
        return;
    }

    let tokenGerado = `${gerarParte()}-${gerarParte()}-${gerarParte()}`;

    let dadosParaInserir = { 
        nome: nome, 
        usuario: user, 
        senha: pass, 
        telefone: ddi + tel, 
        token: tokenGerado, 
        status: 'PENDENTE' 
    };

    try {
        const { error } = await _supabase.from('usuarios').insert([dadosParaInserir]);
        if (error) {
            alert("Erro ao cadastrar: " + error.message);
        } else {
            let mensagem = `*SOLICITAÇÃO DE ACESSO*%0A%0ANome: ${nome}%0AUsuário: ${user}%0AToken: ${tokenGerado}%0A%0APor favor, ative este cadastro!`;
            window.open(`https://wa.me/5569981128233?text=${mensagem}`, '_blank');
            alert("CADASTRO REALIZADO! AGUARDE APROVAÇÃO.");
            window.location.href = "index.html";
        }
    } catch (e) {
        alert("Erro inesperado: " + e.message);
    }
}

// Altere esta parte no seu main.js para refletir o nome real da coluna no Supabase
async function processarCadastro() {
    let tokenDigitado = document.getElementById('tokenAtivacao').value.trim().toUpperCase();

    if (tokenDigitado) {
        const { data, error } = await _supabase
            .from('usuarios')
            .select('*')
            .eq('token_ativo', tokenDigitado) // Mude aqui para o nome exato da coluna que você criou
            .maybeSingle();

        // ... resto da função
    }
}

// Função de Login
async function login() {
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();
    
    const { data, error } = await _supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', user)
        .eq('senha', pass)
        .maybeSingle();

    if (data && data.status === 'APROVADO') {
        localStorage.setItem('usuarioLogado', data.usuario);
        window.location.href = data.nivel === 'MASTER' ? "admin/master.html" : "home.html";
    } else {
        alert("LOGIN INVÁLIDO OU CONTA PENDENTE!");
    }
}

// Utilitários
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

async function verificarStatus() {
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.href = "index.html";
    }
}
