// Adicione isto no topo do arquivo para ficar acessível globalmente
const gerarParte = () => Math.random().toString(36).substring(2, 5).toUpperCase();
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
    // ADICIONE ESTA LINHA:
    localStorage.setItem('usuarioLogado', user); 
    
    if (data.nivel === 'MASTER') {
        window.location.href = "admin/master.html";
    } else {
        window.location.href = "home.html"; // Redireciona usuários comuns
    }
}
    } catch (e) {
        alert("Erro inesperado: " + e.message);
    }
}

// Cadastro com Geração de Token e Envio via WhatsApp
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

    let dadosParaInserir = { 
        nome: nome, 
        usuario: user, 
        senha: pass, 
        telefone: ddi + tel, 
        token: `${gerarParte()}-${gerarParte()}-${gerarParte()}`, 
        status: 'PENDENTE' 
    };

    try {
        const { error } = await _supabase.from('usuarios').insert([dadosParaInserir]);

        if (error) {
            alert("Erro ao cadastrar: " + error.message);
        } else {
            // MENSAGEM PARA VOCÊ NO WHATSAPP
            let mensagem = `*SOLICITAÇÃO DE ACESSO*%0A%0ANome: ${nome}%0AUsuário: ${user}%0AToken: ${dadosParaInserir.token}%0A%0APor favor, ative este cadastro!`;
            let linkWhatsApp = `https://wa.me/5569981128233?text=${encodeURIComponent(mensagem)}`;

            alert("CADASTRO REALIZADO! Redirecionando para enviar o token ao Administrador.");
            window.open(linkWhatsApp, '_blank');
            window.location.href = "index.html"; // Volta para o login
        }
    } catch (e) {
        alert("Erro inesperado: " + e.message);
    }
}
// Função para carregar usuários pendentes no Painel Master
async function carregarPendentes() {
    const { data, error } = await _supabase
        .from('usuarios')
        .select('*')
        .eq('status', 'PENDENTE');

    if (error) {
        alert("Erro ao buscar: " + error.message);
        return;
    }

    let lista = document.getElementById('listaUsuarios');
    lista.innerHTML = ''; // Limpa a lista

    data.forEach(user => {
        // CORREÇÃO: Agora passamos os 3 parâmetros que a função aprovar precisa
        lista.innerHTML += `
            <div style="border: 1px solid #E7272D; padding: 10px; margin: 10px 0; color: #fff;">
                <p>NOME: ${user.nome}</p>
                <p>TELEFONE: ${user.telefone}</p>
                <p>TOKEN: ${user.token}</p>
                <button onclick="aprovar('${user.id}', '${user.nome}', '${user.telefone}')" 
                        style="background: #E7272D; color: #fff; border: none; padding: 10px; cursor: pointer;">
                    APROVAR E ENVIAR CÓDIGO
                </button>
            </div>
        `;
    });
}

// Função para o MASTER gerar o Código de Ativação (Formato XXX-XXX-XXX-XXX)
async function aprovar(id, nome, telefone) {
    // 1. Gerar Código no formato XXX-XXX-XXX-XXX
    const gerarParte = () => Math.random().toString(36).substring(2, 5).toUpperCase();
    let codigoAtivacao = `${gerarParte()}-${gerarParte()}-${gerarParte()}-${gerarParte()}`;

    // 2. Atualizar no banco
    const { error } = await _supabase
        .from('usuarios')
        .update({ status: 'APROVADO', codigo_ativacao: codigoAtivacao })
        .eq('id', id);

    if (error) {
        alert("Erro ao aprovar: " + error.message);
    } else {
        // 3. Link para enviar o código final ao usuário via WhatsApp
        let mensagem = `*CADASTRO APROVADO!*%0A%0AOlá ${nome}, seu acesso foi liberado.%0A%0A*Seu código de ativação:* ${codigoAtivacao}%0A%0AInsira este código no aplicativo para iniciar.`;
        let linkWhatsApp = `https://wa.me/${telefone.replace('+', '').replace(' ', '')}?text=${mensagem}`;

        window.open(linkWhatsApp, '_blank');
        alert("CÓDIGO " + codigoAtivacao + " GERADO E ENVIADO!");
        carregarPendentes();
    }
}
// Função de Proteção: Verifica se o usuário é MASTER
async function verificarAcessoMaster() {
    // Busca o usuário logado (assumindo que você salve o nome dele no localStorage no login)
    let usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        window.location.href = "../index.html"; // Expulsa se não estiver logado
        return;
    }

    const { data, error } = await _supabase
        .from('usuarios')
        .select('nivel')
        .eq('usuario', usuarioLogado)
        .single();

    if (error || data.nivel !== 'MASTER') {
        alert("ACESSO NEGADO! Você não é um administrador.");
        window.location.href = "../index.html";
    }
}
async function verificarAtivacao() {
    let codigo = document.getElementById('codigoInput').value.trim().toUpperCase();

    if (!codigo) {
        alert("Por favor, digite o código!");
        return;
    }

    // Busca o usuário pelo código de ativação
    const { data, error } = await _supabase
        .from('usuarios')
        .select('*')
        .eq('codigo_ativacao', codigo)
        .maybeSingle();

    if (error) {
        alert("Erro ao buscar código: " + error.message);
    } else if (!data) {
        alert("CÓDIGO INVÁLIDO!");
    } else {
        // Se achou, o sistema agora sabe que esse usuário está ATIVADO
        alert("PARABÉNS! " + data.nome + ", sua conta foi ativada.");
        localStorage.setItem('usuarioLogado', data.usuario);
        window.location.href = "home.html";
    }
}
