🚀 Aqui está um **README.md** bonito e completo para o teu app, já explicando tudo o que ele faz e como usar:

---

# 🎫 App de Validação de Convidados

Aplicação web para validação de convidados em eventos, com QR Code, lista personalizada e controle de presença.

---

## 📋 Funcionalidades

✅ Upload da lista de convidados via link (WeTransfer ou outro).
✅ Ativação do scanner QR Code apenas após carregar a lista.
✅ Marcação automática dos convidados validados.
✅ Contagem de total, validados e restantes.
✅ Aba administrativa com opções adicionais.
✅ Dados salvos localmente no navegador (persistência).
✅ Interface moderna e responsiva.

---

## 🚀 Como usar

### 🎯 Para o cliente

1️⃣ Abra o site no navegador (recomenda-se no telemóvel).
2️⃣ Cole o link enviado pela organização no campo *"Cole aqui o link"* e clique em *Carregar lista*.
3️⃣ Após carregar a lista, o campo desaparece e o botão para escanear QR Code é ativado.
4️⃣ Clique em *Escanear QR Code (Tela Cheia)* para validar os convidados.
5️⃣ À medida que os convidados são validados, aparecem na lista e a barra de progresso é atualizada.

---

### 🔒 Para o administrador

1️⃣ Clique na aba *Admin*.
2️⃣ Insira a senha de administrador (padrão: `2025Invites`).
3️⃣ Acesso a funções extras:

* Adicionar convidado manualmente.
* Carregar lista via arquivo `.txt`.
* Ativar *modo override* (permite validar códigos já usados).
* Exportar lista de convidados validados.

---

## 📄 Formato do arquivo `.txt`

O arquivo de convidados deve ter uma lista no seguinte formato:

```
CÓDIGO,NOME
ABC123,João Silva
DEF456,Maria Santos
GHI789,Carlos Oliveira
```

Separador pode ser vírgula, dois-pontos, ponto-e-vírgula ou tabulação.

---

## 💻 Tecnologias

* HTML, CSS e JavaScript puros
* Biblioteca [Html5Qrcode](https://github.com/mebjas/html5-qrcode) para leitura de QR Codes
* `localStorage` para persistência no navegador

---

## 🎨 Sugestões de melhoria

* Relatório completo com presença e ausência.
* PWA para instalação no telemóvel.
* Animações e sons na validação.
* Sincronização online para múltiplos validadores.

---

## 📧 Suporte

Caso tenha dúvidas ou sugestões, entre em contacto com a organização através do e-mail:
📩 **[araujocataca16@gmail.com](mailto:araujocataca16@gmail.com)**

---

Se quiser, posso também gerar este README.md num ficheiro e incluir no teu projeto..
Queres que eu já o prepare para download?
