// sync.js - Sincronização com Google Drive (placeholder para futura implementação)
const sync = {
    CLIENT_ID: 'SEU_CLIENT_ID.apps.googleusercontent.com',
    API_KEY: 'SUA_API_KEY',
    SCOPES: 'https://www.googleapis.com/auth/drive.file',
    fileName: 'exames-dados.json',
    token: null,

    // Inicializa a API do Google
    async init() {
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        apiKey: this.API_KEY,
                        clientId: this.CLIENT_ID,
                        scope: this.SCOPES
                    });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    },

    // Login com Google
    async login() {
        try {
            const auth = gapi.auth2.getAuthInstance();
            const user = await auth.signIn();
            this.token = user.getAuthResponse().access_token;
            return true;
        } catch (e) {
            console.error('Erro no login:', e);
            return false;
        }
    },

    // Verifica se está autenticado
    isLogged() {
        return gapi.auth2?.getAuthInstance()?.isSignedIn.get() || false;
    },

    // Upload para Google Drive
    async upload() {
        if (!this.isLogged()) {
            const ok = await this.login();
            if (!ok) return false;
        }

        const dados = await data.exportarDados();
        const conteudo = JSON.stringify(dados, null, 2);
        const blob = new Blob([conteudo], { type: 'application/json' });
        
        const metadata = {
            name: this.fileName,
            mimeType: 'application/json'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);

        try {
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: { Authorization: `Bearer ${this.token}` },
                body: form
            });
            return response.ok;
        } catch (e) {
            console.error('Erro no upload:', e);
            return false;
        }
    },

    // Download do Google Drive
    async download() {
        if (!this.isLogged()) {
            const ok = await this.login();
            if (!ok) return null;
        }

        try {
            // Busca o arquivo
            const searchResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=name='${this.fileName}'`,
                { headers: { Authorization: `Bearer ${this.token}` } }
            );
            const searchData = await searchResponse.json();
            
            if (!searchData.files || searchData.files.length === 0) {
                return null; // Arquivo não existe ainda
            }

            const fileId = searchData.files[0].id;
            
            // Baixa o conteúdo
            const contentResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                { headers: { Authorization: `Bearer ${this.token}` } }
            );
            
            const dados = await contentResponse.json();
            await data.importarDados(dados);
            return dados;
        } catch (e) {
            console.error('Erro no download:', e);
            return null;
        }
    },

    // Sincronização completa
    async sync() {
        const btn = document.querySelector('button[onclick="app.syncDrive()"]');
        if (btn) {
            btn.textContent = '🔄 Sincronizando...';
            btn.disabled = true;
        }

        try {
            // Tenta fazer upload (envia dados locais para a nuvem)
            // Em uma implementação completa, verificar timestamps e resolver conflitos
            const ok = await this.upload();
            if (ok) {
                alert('Sincronização concluída! Dados salvos no Google Drive.');
            } else {
                alert('Falha na sincronização.');
            }
        } catch (e) {
            console.error('Erro na sincronização:', e);
            alert('Erro na sincronização: ' + e.message);
        } finally {
            if (btn) {
                btn.textContent = '🔄 Sincronizar';
                btn.disabled = false;
            }
        }
    }
};

// Observação: Para usar a API do Google Drive,
// você precisa criar credenciais em https://console.cloud.google.com/
// e substituir CLIENT_ID e API_KEY acima.
