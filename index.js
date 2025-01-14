const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

app.post('/validar-cpf', (req, res) => {
    const { cpf } = req.body;
    if (!cpf) {
        return res.status(400).json({ error: 'CPF é obrigatório' });
    }
    const isValid = validarCPF(cpf);
    const message = isValid ? 'O CPF é válido.' : 'O CPF não é válido.';
    res.json({ cpf, message });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
