const data = {
    db: null,
    dbName: 'ExamesDB',
    version: 1,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('membros')) {
                    db.createObjectStore('membros', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('exames')) {
                    db.createObjectStore('exames', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('medicoes')) {
                    db.createObjectStore('medicoes', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    },

    // CRUD Membros
    async addMembro(membro) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('membros', 'readwrite');
            const store = tx.objectStore('membros');
            const request = store.add(membro);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getMembros() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('membros', 'readonly');
            const store = tx.objectStore('membros');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async deleteMembro(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('membros', 'readwrite');
            const store = tx.objectStore('membros');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // CRUD Exames
    async addExame(exame) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('exames', 'readwrite');
            const store = tx.objectStore('exames');
            const request = store.add(exame);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getExames(filtros = {}) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('exames', 'readonly');
            const store = tx.objectStore('exames');
            const request = store.getAll();
            request.onsuccess = () => {
                let exames = request.result;
                if (filtros.membroId) {
                    exames = exames.filter(e => e.membroId === filtros.membroId);
                }
                if (filtros.categoria) {
                    exames = exames.filter(e => e.categoria === filtros.categoria);
                }
                if (filtros.parametro) {
                    exames = exames.filter(e => e.parametro === filtros.parametro);
                }
                // Ordenar por data decrescente
                exames.sort((a, b) => new Date(b.data) - new Date(a.data));
                resolve(exames);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async deleteExame(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('exames', 'readwrite');
            const store = tx.objectStore('exames');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // CRUD Medicoes
    async addMedicao(medicao) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('medicoes', 'readwrite');
            const store = tx.objectStore('medicoes');
            const request = store.add(medicao);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getMedicoes(filtros = {}) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('medicoes', 'readonly');
            const store = tx.objectStore('medicoes');
            const request = store.getAll();
            request.onsuccess = () => {
                let medicoes = request.result;
                if (filtros.membroId) {
                    medicoes = medicoes.filter(m => m.membroId === filtros.membroId);
                }
                medicoes.sort((a, b) => new Date(a.data) - new Date(b.data));
                resolve(medicoes);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async deleteMedicao(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('medicoes', 'readwrite');
            const store = tx.objectStore('medicoes');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // Helpers
    async exportarDados() {
        const membros = await this.getMembros();
        const exames = await this.getExames();
        const medicoes = await this.getMedicoes();
        return { membros, exames, medicoes, exportadoEm: new Date().toISOString() };
    },

    async importarDados(dados) {
        // Limpar dados existentes
        const tx = this.db.transaction(['membros', 'exames', 'medicoes'], 'readwrite');
        await tx.objectStore('membros').clear();
        await tx.objectStore('exames').clear();
        await tx.objectStore('medicoes').clear();
        
        // Inserir novos dados
        for (const membro of dados.membros || []) {
            await this.addMembro(membro);
        }
        for (const exame of dados.exames || []) {
            await this.addExame(exame);
        }
        for (const medicao of dados.medicoes || []) {
            await this.addMedicao(medicao);
        }
    }
};
