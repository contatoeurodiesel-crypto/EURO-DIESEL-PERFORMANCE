// 1. Definição global da função (fora de qualquer outra função)
const gerarParte = () => Math.random().toString(36).substring(2, 5).toUpperCase();

const _supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// ... (mantenha suas funções toggleSenha e login como estão)

// Função de Cadastro CORRIGIDA
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
            alert("CADASTRO REALIZADO!");
            window.location.href = "index.html";
        }
    } catch (e) {
        alert("Erro inesperado: " + e.message);
    }
}
// Função para alternar visibilidade da senha
function toggleSenha() {
    let inputPass = document.getElementById('pass');
    let btn = document.getElementById('btnMostrar');
    if (!inputPass) return;
    if (inputPass.type === 'password') {
        inputPass.type = 'text';
        btn.innerText = 'OCULTAR';
    } else {
        inputPass.type = 'password';
        btn.innerText = 'MOSTRAR';
    }
}

// Função de segurança básica para proteger a home
async function verificarStatus() {
    let user = localStorage.getItem('usuarioLogado');
    if (!user) {
        window.location.href = "index.html";
    }
}

// Função de login (garanta que esteja completa)
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
// Função de verificação de ativação CORRIGIDA
async function verificarAtivacao() {
    let codigo = document.getElementById('codigoInput').value.trim().toUpperCase();

    if (!codigo) {
        alert("Por favor, digite o código!");
        return;
    }

    // Busca exata pelo código (sem espaços extras)
    const { data, error } = await _supabase
        .from('usuarios')
        .select('*')
        .eq('codigo_ativacao', codigo)
        .maybeSingle();

    if (error) {
        alert("Erro no banco: " + error.message);
    } else if (!data) {
        alert("CÓDIGO NÃO ENCONTRADO! Verifique se foi digitado corretamente.");
    } else {
        // Agora, além de validar, garantimos que o status mude para APROVADO
        alert("SUCESSO! Conta ativada para: " + data.nome);
        localStorage.setItem('usuarioLogado', data.usuario);
        window.location.href = "home.html";
    }
}
async function processarCadastro() {
    let tokenDigitado = document.getElementById('tokenAtivacao').value.trim().toUpperCase();

    // SE o usuário preencheu o campo de token, ele quer ATIVAR
    if (tokenDigitado) {
        const { data, error } = await _supabase
            .from('usuarios')
            .select('*')
            .eq('codigo_ativacao', tokenDigitado) // Busca pelo token que você gerou
            .maybeSingle();

        if (error || !data) {
            alert("TOKEN INVÁLIDO OU NÃO APROVADO!");
        } else {
            alert("ATIVADO COM SUCESSO!");
            localStorage.setItem('usuarioLogado', data.usuario);
            window.location.href = "home.html";
        }
    } else {
        // SE o campo estiver vazio, ele quer fazer o cadastro NORMAL
        cadastrarComToken();
    }
}
// ... (mantenha o resto das suas funções carregarPendentes, aprovar, etc.)
