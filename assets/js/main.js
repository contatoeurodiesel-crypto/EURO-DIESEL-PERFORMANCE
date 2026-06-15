// Inicializa o cliente do Supabase
const supabaseUrl = 'https://ygihkuvmmusrurgxzqjc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Olho da senha
function toggleSenha() {
    let inputPass = document.getElementById('pass');
    inputPass.type = (inputPass.type === 'password') ? 'text' : 'password';
}

// Login
async function login() {
    let user = document.getElementById('user').value.trim().toUpperCase();
    let pass = document.getElementById('pass').value.trim();

    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', user)
        .eq('senha', pass)
        .maybeSingle(); // Usamos maybeSingle para evitar erro caso não encontre

    if (error) {
        alert("Erro no banco: " + error.message);
    } else if (!data) {
        alert("USUÁRIO OU SENHA INCORRETOS!");
    } else {
        alert("BEM-VINDO, " + data.nome);
        if (data.nivel === 'MASTER') {
            window.location.href = "admin/master.html";
        }
    }
}
