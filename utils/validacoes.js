function validarEmail(email) {
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validarPassword(string = '') {
    if (string.length < 8) {
        return false;
    }
    return true;
    // let temLetra = false;
    // let temNumero = false;
    // for (let i = 0; i < string.length; i++) {
    //     const char = string.charAt(i);
    //     if (/[a-zA-Z]/.test(char)) {
    //         temLetra = true;
    //     } else if (/[0-9]/.test(char)) {
    //         temNumero = true;
    //     }
    // }
    // return temLetra && temNumero;
}

function validarNome(string){
    return string.split(' ').length > 1
}

export {
    validarEmail,
    validarPassword,
    validarNome
}