// Configuração do Supabase
const _supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// --- LOGIN E ACESSO ---
async function login() {
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();
    
    const { data, error } = await _supabase
        .from('usuarios')
        .select('usuario, senha, status, nivel')
        .eq('usuario', user)
        .eq('senha', pass)
        .maybeSingle();

    if (error) { alert("Erro no Banco: " + error.message); return; }

    if (!data) {
        alert("USUÁRIO OU SENHA INCORRETOS!");
    } else if (data.status !== 'APROVADO') {
        alert("CONTA PENDENTE! Aguarde aprovação do Master.");
    } else {
        localStorage.setItem('usuarioLogado', data.usuario);
        localStorage.setItem('nivel', data.nivel); // Guardamos o nível para verificar acesso
        window.location.href = data.nivel === 'MASTER' ? "admin/master.html" : "dashboard.html";
    }
}

function toggleSenha() {
    let input = document.getElementById('pass');
    let btn = document.getElementById('btnMostrar');
    input.type = (input.type === 'password') ? 'text' : 'password';
    btn.innerText = (input.type === 'password') ? 'MOSTRAR' : 'OCULTAR';
}

// --- GESTÃO DE USUÁRIOS (MASTER) ---
async function carregarPendentes() {
    const listaDiv = document.getElementById('listaUsuarios');
    const { data, error } = await _supabase.from('usuarios').select('*').eq('status', 'PENDENTE');
    if (error) { listaDiv.innerHTML = "Erro: " + error.message; return; }
    if (data.length === 0) { listaDiv.innerHTML = "NENHUM USUÁRIO PENDENTE."; return; }

    let html = "";
    data.forEach(user => {
        html += `<div style="border:1px solid #E7272D; padding:10px; margin:5px;">
                    <p>NOME: ${user.nome}</p><p>USUÁRIO: ${user.usuario}</p>
                    <button onclick="aprovarUsuario('${user.usuario}')">APROVAR</button>
                 </div>`;
    });
    listaDiv.innerHTML = html;
}

async function aprovarUsuario(usuario) {
    let codigoFinal = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const { error } = await _supabase.from('usuarios').update({ status: 'APROVADO', token: codigoFinal }).eq('usuario', usuario);
    if (error) alert("Erro ao aprovar: " + error.message);
    else { alert("USUÁRIO APROVADO! Token: " + codigoFinal); carregarPendentes(); }
}

// --- BUSCA DE PARÂMETROS (Dashboard.html) ---
async function filtrarParametros() {
    const termo = document.getElementById('search-input').value.trim().toUpperCase();
    const resultsDiv = document.getElementById('results');
    
    if (!termo) {
        resultsDiv.innerHTML = "";
        document.getElementById('count-match').innerText = "0";
        return;
    }

    // CORREÇÃO: Usando _supabase (instância correta)
    const { data, error } = await _supabase
        .from('parametros')
        .select('*')
        .or(`code.ilike.%${termo}%,instruction.ilike.%${termo}%`);

    if (error) { console.error("Erro na busca:", error); return; }

    resultsDiv.innerHTML = "";
    data.forEach(item => {
        resultsDiv.innerHTML += `
            <div class="card">
                <span><b>${item.code}</b></span>
                <span>${item.instruction}</span>
            </div>
        `;
    });
    document.getElementById('count-match').innerText = data.length;
}

// --- IMPORTAÇÃO MASTER ---
async function processarImportacao() {
    const texto = document.getElementById('import-data').value.trim();
    if (!texto) return alert("Cole os dados!");

    const linhas = texto.split('\n');
    const novosDados = linhas.map(l => {
        const p = l.split(';');
        return { code: p[0]?.trim().toUpperCase(), instruction: p[1]?.trim() };
    }).filter(d => d.code && d.instruction);

    const { error } = await _supabase.from('parametros').insert(novosDados);
    if (error) alert("Erro: " + error.message);
    else alert("Importado com sucesso!");
}

// --- VERIFICAÇÃO MASTER ---
function verificarAcessoMaster() {
    const nivel = localStorage.getItem('nivel');
    // Se for Master, libera o painel
    if (nivel === 'MASTER' && document.getElementById('master-zone')) {
        document.getElementById('master-zone').style.display = 'block';
    }
}

// Inicializa
window.onload = () => {
    if(typeof verificarAcessoMaster === 'function') verificarAcessoMaster();
};
