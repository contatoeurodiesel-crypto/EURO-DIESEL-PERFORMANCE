// 1. Inicializa o Supabase (garanta que a biblioteca foi carregada no HTML)
const supabase = supabase.createClient('https://ygihkuvmmusrurgxzqjc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaWhrdXZtbXVzcnVyZ3h6cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzE5MjcsImV4cCI6MjA5NzA0NzkyN30.LdIJRiRlGgf7ijLjkv8Ts2zcKTg5tbwFyLNWgjF0yEc');

// 2. Função de Login
async function login() {
    let user = document.getElementById('user').value.toUpperCase();
    let pass = document.getElementById('pass').value;

    if (!user || !pass) {
        alert("PREENCHA USUÁRIO E SENHA!");
        return;
    }

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
    } catch (e) {
        console.error("Erro no login:", e);
        alert("ERRO AO CONECTAR COM O BANCO!");
    }
}
