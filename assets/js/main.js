// Inicializa o Supabase com segurança
const supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// Função do Olho para ver senha
function toggleSenha() {
    let inputPass = document.getElementById('pass');
    inputPass.type = (inputPass.type === 'password') ? 'text' : 'password';
}

// Função de Login atualizada
async function login() {
    let user = document.getElementById('user').value.toUpperCase();
    let pass = document.getElementById('pass').value;

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('usuario', user)
            .eq('senha', pass)
            .single();

        if (error || !data) {
            alert("USUÁRIO OU SENHA INCORRETOS!");
        } else {
            if (data.nivel === 'MASTER') {
                window.location.href = "admin/master.html";
            } else {
                alert("BEM-VINDO, " + data.nome);
            }
        }
    } catch (err) {
        alert("ERRO DE CONEXÃO: " + err.message);
    }
}
