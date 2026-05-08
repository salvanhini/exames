# Sistema de Exames - Família

Aplicativo web para armazenar, comparar e analisar exames laboratoriais da família.

## Funcionalidades

- **Cadastro de Familiares**: Adicione membros da família (nome, data de nascimento, sexo)
- **Registro de Exames**: Cadastre resultados de exames com data, categoria, parâmetro e valor
- **Parâmetros de Referência**: O sistema já vem com os parâmetros normais dos principais exames (Hemograma, Perfil Lipídico, Glicêmico, Renal, Hepático, Hormônios, Vitaminas, etc.)
- **Comparação de Exames**: Gráfico de evolução temporal para visualizar tendências
- **Curva de Crescimento**: Acompanhe o desenvolvimento da criança (altura, peso e IMC)
- **Alertas**: Destaque visual para valores fora da referência
- **Exportação/Importação**: Backup em JSON ou PDF para levar ao médico
- **Sincronização**: Suporte para Google Drive (requer configuração de API)
- **PWA (Progressive Web App)**: Funciona offline e pode ser instalado no celular

## Como Usar

### 1. Acesse o Sistema
Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge). Para uso no celular, recomendamos instalá-lo como aplicativo (veja seção PWA abaixo).

### 2. Cadastre a Família
- Vá até a aba **"Família"**
- Clique em **"Adicionar Membro"**
- Preencha nome, data de nascimento e sexo
- Clique em **"Salvar"**

### 3. Cadastre Exames
- Vá até a aba **"Exames"**
- Selecione o filtro de membro ou mantenha em branco para ver todos
- Clique em **"+ Novo Exame"**
- Escolha a categoria (ex: Hemograma)
- Escolha o parâmetro específico
- Digite o valor e a data
- Clique em **"Salvar"**

### 4. Veja o Dashboard
- Selecione um membro clicando em **"Selecionar"** na aba Família
- Vá para **"Dashboard"** para ver um resumo com alertas de valores fora da referência

### 5. Compare Exames
- Na aba **"Comparar"**, escolha o membro e o parâmetro
- Clique em **"Comparar"** para ver o gráfico de evolução

### 6. Curva de Crescimento
- Na aba **"Crescimento"**, selecione a criança
- Escolha entre Altura, Peso ou IMC
- Adicione medições periódicas com data, altura e peso

### 7. Backup e Sincronização
- **Exportar**: Clique em **"⬇️ Exportar"** para gerar um arquivo JSON com todos os dados
- **Importar**: Clique em **"⬆️ Importar"** para restaurar de um JSON anterior
- **PDF**: Vá em **"Config"** e clique em **"📄 Exportar PDF"**
- **Google Drive**: Configure as credenciais em `js/sync.js` para ativar a sincronização automática

### 8. Configurar Referências
- Na aba **"Config"**, edite os parâmetros de referência diretamente
- As alterações são salvas automaticamente no navegador
- Clique em **"Restaurar Padrão"** para voltar aos valores originais (quando implementado)

## Instalação PWA (Celular)

### Android:
1. Abra o site no Chrome
2. Toque nos 3 pontinhos (⋮)
3. Selecione **"Adicionar à tela inicial"** ou **"Instalar"**
4. O app aparecerá como um ícone na tela

### iOS (iPhone/iPad):
1. Abra o Safari
2. Toque no ícone de compartilhar (□→)
3. Selecione **"Adicionar à Tela de Início"**
4. O app aparecerá como um ícone na tela

## Estrutura de Arquivos

```
exames-sistema/
├── index.html              # Página principal
├── manifest.json           # Configuração PWA
├── sw.js                   # Service Worker (offline)
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   ├── data.js             # Banco de dados local (IndexedDB)
│   ├── config.js           # Parâmetros de referência
│   ├── app.js              # Lógica principal e navegação
│   ├── charts.js           # Funções para gráficos
│   ├── pdf.js              # Geração de relatórios PDF
│   └── sync.js             # Sincronização com Google Drive
└── data/
    └── reference.json      # Parâmetros de referência padrão
```

## Parâmetros de Referência Incluídos

- **Hemograma Completo**: Hb, Hct, RBC, WBC, Plaquetas, VCM, diferencial leucocitário
- **Perfil Lipídico**: CT, HDL, LDL, VLDL, Triglicerídeos
- **Glicêmico**: Glicemia, HbA1c, Insulina, Frutosamina
- **Função Renal**: Creatinina, Ureia, Ácido Úrico, Clearance
- **Função Hepática**: AST, ALT, GGT, Bilirrubinas, Albumina
- **Hormônios**: TSH, T4, T3, Testosterona, Estradiol, LH, FSH, etc.
- **Vitaminas**: Vit D, B12, Ferro, Ferritina
- **Coagulação**: TP, INR, TTPA, Fibrinogênio
- **Imunologia**: PCR, VHS, Fator Reumatoide

## Configuração do Google Drive

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto e ative a **Google Drive API**
3. Gere credenciais OAuth 2.0
4. Edite o arquivo `js/sync.js` e substitua:
   - `CLIENT_ID` com o ID de cliente do OAuth
   - `API_KEY` com a chave de API
5. A sincronização estará disponível na aba **"Config"**

## Notas Importantes

- Os dados são armazenados **localmente no navegador** (IndexedDB)
- **Limpar o cache do navegador pode apagar os dados** - sempre faça backup!
- Os parâmetros de referência são apenas informativos; sempre consulte um médico
- O sistema funciona offline após a primeira carga

## Licença

Uso familiar e pessoal. Desenvolvido com 💙 para família.
