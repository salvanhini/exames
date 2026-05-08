# 🩺 Sistema de Exames da Família - Guia Rápido

## ✨ Como Usar

### 1️⃣ Primeiro Acesso
1. Abra o arquivo `index.html` no seu navegador (Chrome, Edge ou Firefox)
2. O sistema carrega automaticamente

### 2️⃣ Cadastrar Família
1. Vá em **"Família"** no menu lateral
2. Clique em **"Adicionar Membro"**
3. Preencha:
   - Nome completo
   - Data de nascimento
   - Sexo (Masculino/Feminino)
4. Clique em **"Salvar"**

### 3️⃣ Adicionar Exames
1. Vá em **"Exames"** no menu
2. Clique **"+ Novo Exame"**
3. Preencha:
   - **Membro**: selecione a pessoa
   - **Categoria**: tipo de exame (Hemograma, Glicemia, etc)
   - **Parâmetro**: exame específico
   - **Valor**: resultado numérico
   - **Data**: quando foi feito
   - **Laboratório**: opcional
4. Clique **"Salvar Exame"**

### 4️⃣ Ver Dashboard
1. Volte em **"Família"**
2. Clique em **"Selecionar"** no membro desejado
3. O Dashboard mostrará:
   - Total de exames
   - Alertas de valores fora do padrão
   - Status geral

### 5️⃣ Comparar Evolução
1. Vá em **"Comparar"**
2. Selecione o membro
3. Escolha o parâmetro (ex: Hemoglobina)
4. Clique **"Comparar"**
5. Veja o gráfico da evolução temporal

### 6️⃣ Curva de Crescimento (Crianças)
1. Vá em **"Crescimento"**
2. Selecione a criança
3. Escolha: Altura, Peso ou IMC
4. Adicione medições periódicas
5. Acompanhe o desenvolvimento

### 7️⃣ Configurações
- **Parâmetros de Referência**: Edite os valores de referência
- **Sincronizar**: Google Drive (requer configuração)
- **Exportar PDF**: Gera relatório para o médico

## 🎨 Recursos Visuais

### 🌓 Dark Mode
- Clique no ícone de **Sol/Lua** no canto superior direito
- A preferência fica salva automaticamente

### 📱 Mobile
- No celular, o menu vira um hambúrguer no canto superior esquerdo
- Toque para abrir/fechar

### 🔔 Notificações
- Toasts aparecem no canto inferior direito ao salvar
- Alertas mostram valores fora do padrão em vermelho

## 💾 Backup e Importação

### Exportar Dados
1. Vá em **"Exames"**
2. Clique **"⬇️ Exportar"**
3. Salve o arquivo JSON

### Importar Dados
1. Vá em **"Exames"**
2. Clique **"⬆️ Importar"**
3. Selecione o arquivo JSON salvo

## ⚠️ Importante
- Os dados ficam **no seu navegador** (IndexedDB)
- **Sempre faça backup** antes de limpar o cache
- Use em navegadores modernos (Chrome, Edge, Firefox)

## 🎯 Dicas
- Use **filtros** para encontrar exames específicos
- **Valores fora da referência** aparecem em vermelho
- O **Dashboard** atualiza automaticamente ao selecionar alguém
- Use o **PDF** para levar ao médico

## 🔧 Solução de Problemas

| Problema | Solução |
|----------|---------|
| Não carrega | Atualize a página (F5) |
| Dados sumiram | Importe o último backup |
| Menu não abre | Atualize a página |
| Erro no PDF | Use Chrome ou Edge |

---

**Feito com 💙 para sua família**
