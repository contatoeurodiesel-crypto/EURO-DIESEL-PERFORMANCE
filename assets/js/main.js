function login() {
    let user = document.getElementById('user').value;
    let pass = document.getElementById('pass').value;

    // Verificação do Admin Master
    if (user === "LEANDRIN" && pass === "Is@belly 1985") {
        alert("BEM-VINDO, MASTER!");
        window.location.href = "admin/master.html";
    } else {
        alert("LOGIN DE USUÁRIO COMUM AINDA EM DESENVOLVIMENTO");
    }
}