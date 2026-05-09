const app = {
    membroAtual: null,
    graficoComparacao: null,
    graficoCrescimento: null,

    async init() {
        await data.init();
        await config.carregar();
        this.carregarFamilia();
        this.popularFiltros();
        this.navigate('familia');
    },

    // Navegação
    navigate(tela) {
        // Esconder todas as telas
        document.querySelectorAll('.tela').forEach(el => el.classList.add('hidden'));
        document.getElementById(`tela-${tela}`).classList.remove('hidden');
        
        // Atualizar menu lateral
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.nav === tela) {
                btn.classList.add('active');
            }
        });
        
        // Fechar menu mobile se estiver aberto
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
        }
        
        // Carregar dados da tela
        switch(tela) {
            case 'familia': this.carregarFamilia(); break;
            case 'dashboard': this.carregarDashboard(); break;
            case 'exames': this.carregarExames(); break;
            case 'comparar': this.prepararComparar(); break;
            case 'crescimento': this.prepararCrescimento(); break;
            case 'relatorios': this.prepararRelatorios(); break;
            case 'config': this.carregarConfig(); break;
        }
    },

    // Família
    async carregarFamilia() {
        const membros = await data.getMembros();
        const container = document.getElementById('familia-lista');
        
        if (membros.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                        <svg class="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300">Nenhum membro cadastrado</h3>
                    <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Comece adicionando um familiar</p>
                </div>
            `;
            return;
        }

        container.innerHTML = membros.map((m, idx) => `
            <div class="card card-hover animate-slide-up stagger-item" style="animation-delay: ${idx * 75}ms">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <button onclick="app.removerMembro(${m.id})" class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-red-400 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
                <h3 class="font-bold text-lg text-surface-800 dark:text-surface-100 mb-1">${m.nome}</h3>
                <div class="space-y-1.5 text-sm">
                    <p class="flex items-center gap-2 text-surface-500 dark:text-surface-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        ${this.formatarData(m.data_nascimento)}
                    </p>
                    <p class="flex items-center gap-2 text-surface-500 dark:text-surface-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        ${m.sexo === 'M' ? 'Masculino' : 'Feminino'}
                    </p>
                </div>
                <button onclick="app.selecionarMembro(${m.id})" class="mt-4 w-full py-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium text-sm hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
                    Selecionar
                </button>
            </div>
        `).join('');
    },

    mostrarFormFamilia() {
        document.getElementById('form-familia').classList.remove('hidden');
    },

    async salvarFamilia() {
        const nome = document.getElementById('fam-nome').value;
        const data_nascimento = document.getElementById('fam-nascimento').value;
        const sexo = document.getElementById('fam-sexo').value;
        
        if (!nome || !data_nascimento || !sexo) {
            alert('Preencha todos os campos');
            return;
        }

        await data.addMembro({ nome, data_nascimento, sexo });
        document.getElementById('form-familia').classList.add('hidden');
        document.getElementById('fam-nome').value = '';
        document.getElementById('fam-nascimento').value = '';
        document.getElementById('fam-sexo').value = '';
        this.carregarFamilia();
        this.popularFiltros();
        this.showToast('Membro cadastrado com sucesso!');
    },

    async selecionarMembro(id) {
        this.membroAtual = id;
        this.navigate('dashboard');
    },

    async removerMembro(id) {
        if (!confirm('Tem certeza que deseja remover este membro?')) return;
        await data.deleteMembro(id);
        this.carregarFamilia();
        this.popularFiltros();
    },

    // Dashboard
    async carregarDashboard() {
        if (!this.membroAtual) {
            document.getElementById('dashboard-resumo').innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                        <svg class="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300">Selecione um membro</h3>
                    <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Clique em "Família" para escolher</p>
                </div>
            `;
            return;
        }

        const membros = await data.getMembros();
        const membro = membros.find(m => m.id === this.membroAtual);
        const exames = await data.getExames({ membroId: this.membroAtual });
        
        const ultimosExames = {};
        exames.forEach(e => {
            if (!ultimosExames[e.parametro] || new Date(e.data) > new Date(ultimosExames[e.parametro].data)) {
                ultimosExames[e.parametro] = e;
            }
        });

        // Alertas
        const alertas = [];
        for (const [param, exame] of Object.entries(ultimosExames)) {
            const ref = config.obterReferencia(exame.categoria, exame.parametro, membro.sexo);
            if (ref && this.isForaReferencia(exame.valor, ref)) {
                alertas.push({ parametro: this.obterNomeParametro(exame.categoria, exame.parametro), valor: exame.valor, referencia: ref });
            }
        }

        document.getElementById('dashboard-resumo').innerHTML = `
            <div class="card">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-surface-500 dark:text-surface-400">Exames</span>
                </div>
                <p class="text-3xl font-bold text-surface-800 dark:text-surface-100">${Object.keys(ultimosExames).length}</p>
            </div>
            <div class="card">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-surface-500 dark:text-surface-400">Próximos</span>
                </div>
                <p class="text-3xl font-bold text-surface-400">—</p>
            </div>
            <div class="card">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-xl ${alertas.length > 0 ? 'bg-red-100 dark:bg-red-500/10' : 'bg-emerald-100 dark:bg-emerald-500/10'}">
                        <svg class="w-5 h-5 ${alertas.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-surface-500 dark:text-surface-400">Alertas</span>
                </div>
                <p class="text-3xl font-bold ${alertas.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">${alertas.length}</p>
            </div>
        `;

        document.getElementById('alertas-lista').innerHTML = alertas.length === 0 
            ? `<div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Tudo dentro dos parâmetros</span>
            </div>`
            : alertas.map(a => `
                <div class="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                    <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <div>
                        <p class="font-semibold text-red-800 dark:text-red-300 text-sm">${a.parametro}</p>
                        <p class="text-red-600 dark:text-red-400 text-xs mt-0.5">${a.valor} <span class="opacity-75">(ref: ${a.referencia})</span></p>
                    </div>
                </div>
            `).join('');
    },

    // Exames
    async carregarExames() {
        // Garante que as categorias e parâmetros estão carregados
        this.popularFormExame();
        
        const membroId = document.getElementById('filtro-membro')?.value;
        const categoria = document.getElementById('filtro-categoria')?.value;
        const dataFiltro = document.getElementById('filtro-data')?.value;
        
        const filtros = {};
        if (membroId) filtros.membroId = parseInt(membroId);
        if (categoria) filtros.categoria = categoria;
        
        const exames = await data.getExames(filtros);
        
        // Filtra por data se selecionada
        let examesFiltrados = exames;
        if (dataFiltro) {
            examesFiltrados = exames.filter(e => e.data === dataFiltro);
        }

        const container = document.getElementById('exames-lista');
        if (examesFiltrados.length === 0) {
            container.innerHTML = '<div class="p-8 text-center"><svg class="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg><p class="text-surface-400 dark:text-surface-500">Nenhum exame encontrado</p></div>';
            return;
        }

        const membros = await data.getMembros();

        container.innerHTML = `
            <table class="w-full text-sm">
                <thead class="bg-surface-50 dark:bg-surface-900/50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Data</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Membro</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Exame</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Valor</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Laboratório</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
                    ${examesFiltrados.map(e => {
                        const membro = membros.find(m => m.id === e.membroId);
                        const ref = config.obterReferencia(e.categoria, e.parametro, membro?.sexo);
                        return `
                            <tr class="hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors duration-150">
                                <td class="px-4 py-3 text-surface-600 dark:text-surface-400">${this.formatarData(e.data)}</td>
                                <td class="px-4 py-3 font-medium">${membro?.nome || 'N/A'}</td>
                                <td class="px-4 py-3">${this.obterNomeParametro(e.categoria, e.parametro)}</td>
                                <td class="px-4 py-3 font-bold ${this.getStatusClasse(e.valor, ref)}">${e.valor}</td>
                                <td class="px-4 py-3">${this.getStatusBadge(e.valor, ref)}</td>
                                <td class="px-4 py-3 text-surface-500 dark:text-surface-400">${e.laboratorio || '-'}</td>
                                <td class="px-4 py-3">
                                    <button onclick="app.removerExame(${e.id})" class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },

    mostrarFormExame() {
        this.popularFormExame();
        document.getElementById('form-exame').classList.remove('hidden');
    },

    async popularFiltros() {
        const membros = await data.getMembros();
        const cats = config.obterCategorias();
        
        // Filtro de membros
        const htmlMembros = membros.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
        document.getElementById('filtro-membro') && (document.getElementById('filtro-membro').innerHTML = '<option value="">Todos</option>' + htmlMembros);
        document.getElementById('ex-membro') && (document.getElementById('ex-membro').innerHTML = htmlMembros);
        document.getElementById('comp-membro') && (document.getElementById('comp-membro').innerHTML = htmlMembros);
        document.getElementById('crianca-membro') && (document.getElementById('crianca-membro').innerHTML = '<option value="">Selecione</option>' + htmlMembros);
        document.getElementById('rel-membro') && (document.getElementById('rel-membro').innerHTML = '<option value="">Todos</option>' + htmlMembros);

        // Filtro de categorias
        const htmlCats = cats.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
        document.getElementById('filtro-categoria') && (document.getElementById('filtro-categoria').innerHTML = '<option value="">Todas</option>' + htmlCats);
        document.getElementById('rel-categoria') && (document.getElementById('rel-categoria').innerHTML = '<option value="">Todas as categorias</option>' + htmlCats);
    },

    async popularFormExame() {
        const membros = await data.getMembros();
        const htmlMembros = membros.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
        document.getElementById('ex-membro') && (document.getElementById('ex-membro').innerHTML = htmlMembros);
        
        const cats = config.obterCategorias();
        if (cats && cats.length > 0) {
            document.getElementById('ex-categoria') && (document.getElementById('ex-categoria').innerHTML = '<option value="">Selecione</option>' + cats.map(c => `<option value="${c.id}">${c.nome}</option>`).join(''));
        }
        this.carregarParametros();
    },

carregarParametros() {
        const categoria = document.getElementById('ex-categoria')?.value;
        if (!categoria) {
            document.getElementById('ex-parametro') && (document.getElementById('ex-parametro').innerHTML = '<option value="">Selecione a categoria primeiro</option>');
            return;
        }
        const parametros = config.obterParametros(categoria);
        if (parametros && parametros.length > 0) {
            document.getElementById('ex-parametro') && (document.getElementById('ex-parametro').innerHTML = parametros.map(p => `<option value="${p.id}" data-unidade="${p.unidade}">${p.nome} (${p.unidade})</option>`).join(''));
        } else {
            document.getElementById('ex-parametro') && (document.getElementById('ex-parametro').innerHTML = '<option value="">Nenhum parâmetro</option>');
        }
    },

    async salvarExame() {
        const membroId = document.getElementById('ex-membro').value;
        const categoria = document.getElementById('ex-categoria').value;
        const parametro = document.getElementById('ex-parametro').value;
        const valor = parseFloat(document.getElementById('ex-valor').value);
        const dataExame = document.getElementById('ex-data').value;
        const laboratorio = document.getElementById('ex-laboratorio').value;

        if (!membroId || !categoria || !parametro || (!valor && valor !== 0) || !dataExame) {
            this.showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        await data.addExame({
            membroId: parseInt(membroId),
            categoria,
            parametro,
            valor,
            data: dataExame,
            laboratorio
        });

        // Limpar formulário
        document.getElementById('ex-valor').value = '';
        document.getElementById('ex-laboratorio').value = '';
        document.getElementById('form-exame').classList.add('hidden');
        this.carregarExames();
        this.showToast('Exame cadastrado com sucesso!');
    },

    async removerExame(id) {
        if (!confirm('Tem certeza que deseja remover este exame?')) return;
        await data.deleteExame(id);
        this.carregarExames();
        this.showToast('Exame removido!');
    },

    async removerMembro(id) {
        if (!confirm('Tem certeza que deseja remover este membro? Todos os exames associados serão removidos.')) return;
        await data.deleteMembro(id);
        this.carregarFamilia();
        this.popularFiltros();
        this.showToast('Membro removido!');
    },

    // IA - Análise de PDF/TXT com Gemini ou DeepSeek
    verificarEAnalisarPDF() {
        const provider = document.getElementById('ia-provider')?.value || 'gemini';
        this.iaProviderAtual = provider;
        const servico = provider === 'deepseek' ? DeepSeek : Gemini;

        if (!servico.hasApiKey()) {
            const nome = provider === 'deepseek' ? 'DeepSeek' : 'Gemini';
            document.getElementById('modal-api-key').classList.remove('hidden');
            document.getElementById('modal-api-key').classList.add('flex');
            document.getElementById('modal-api-key-title').textContent = `Chave da API ${nome}`;
            document.getElementById('input-api-key').placeholder = `Cole sua chave API do ${nome} aqui`;
            document.getElementById('input-api-key').value = '';
            document.getElementById('input-api-key').focus();
        } else {
            document.getElementById('pdf-exame-input').click();
        }
    },

    salvarApiKey() {
        const key = document.getElementById('input-api-key').value.trim();
        const provider = this.iaProviderAtual || document.getElementById('ia-provider')?.value || 'gemini';
        if (!key) {
            this.showToast('Informe a chave da API', 'error');
            return;
        }
        if (provider === 'gemini' && !key.startsWith('AIza')) {
            this.showToast('Chave Gemini inválida. Deve começar com "AIza..."', 'error');
            return;
        }
        if (provider === 'deepseek') DeepSeek.setApiKey(key);
        else Gemini.setApiKey(key);
        this.fecharModalApiKey();
        this.showToast('Chave salva! Selecione o PDF do exame.');
        document.getElementById('pdf-exame-input').click();
    },

    fecharModalApiKey() {
        document.getElementById('modal-api-key').classList.add('hidden');
        document.getElementById('modal-api-key').classList.remove('flex');
    },

    async analisarExamePDF(input) {
        const file = input.files[0];
        if (!file) return;

        const provider = this.iaProviderAtual || document.getElementById('ia-provider')?.value || 'gemini';
        const nome = provider === 'deepseek' ? 'DeepSeek' : 'Gemini';
        this.mostrarLoading(true, `Analisando exame com ${nome}...`);

        try {
            const resultado = provider === 'deepseek'
                ? await DeepSeek.analisarArquivo(file)
                : await Gemini.analisarPDF(file);
            resultado._provider = provider;
            this.mostrarResultadoIA(resultado);
        } catch (err) {
            this.showToast('Erro na análise: ' + err.message.substring(0, 100), 'error');
        } finally {
            this.mostrarLoading(false);
            input.value = '';
        }
    },

    mostrarLoading(mostrar, texto) {
        const overlay = document.getElementById('loading-overlay');
        const textEl = document.getElementById('loading-text');
        if (mostrar) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            if (texto) textEl.textContent = texto;
        } else {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    },

    mostrarResultadoIA(resultado) {
        const container = document.getElementById('confirmacao-conteudo');
        const membros = []; // será populado
        data.getMembros().then(m => {
            membros.push(...m);

            let html = '';
            const categorias = config.obterCategorias();
            const examesMapeados = (resultado.exames || []).map(exame => {
                const mapeado = Gemini.mapearExame(exame);
                const categoriaValida = categorias.some(c => c.id === mapeado.categoria);
                const categoria = categoriaValida ? mapeado.categoria : '';
                const parametroValido = categoria
                    ? config.obterParametros(categoria).some(p => p.id === mapeado.parametro_id)
                    : false;
                return {
                    ...exame,
                    _categoriaSugerida: categoria,
                    _parametroSugerido: parametroValido ? mapeado.parametro_id : ''
                };
            });
            resultado.exames = examesMapeados;

            // Informações do paciente
            html += `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-900/50">
                    <div>
                        <label class="label-field">Paciente</label>
                        <select id="ia-membro" class="input-field mt-1">
                            ${membros.map(m => `<option value="${m.id}">${m.nome}</option>`).join('')}
                            <option value="">— Novo paciente (editar depois) —</option>
                        </select>
                    </div>
                    <div>
                        <label class="label-field">Data do Exame</label>
                        <input type="date" id="ia-data" class="input-field mt-1" value="${resultado.data_coleta || ''}">
                    </div>
                    <div>
                        <label class="label-field">Laboratório</label>
                        <input type="text" id="ia-laboratorio" class="input-field mt-1" value="${resultado.laboratorio || ''}" placeholder="Opcional">
                    </div>
                    <div class="flex items-end">
                        <p class="text-xs text-surface-500">${resultado.exames?.length || 0} parâmetros encontrados</p>
                    </div>
                </div>
            `;

            // Tabela de exames extraídos
            if (resultado.exames && resultado.exames.length > 0) {
                html += `
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-surface-50 dark:bg-surface-900/50">
                                <tr>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Parâmetro</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Valor</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Referência</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Incluir</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
                                ${resultado.exames.map((exame, idx) => `
                                    <tr class="hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors">
                                        <td class="px-3 py-2">
                                            <div class="font-medium">${exame.parametro || exame.categoria || '?'}</div>
                                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                <select id="ia-categoria-${idx}" class="input-field py-1 px-2 text-xs" onchange="app.atualizarParametrosIA(${idx})">
                                                    <option value="">Categoria</option>
                                                    ${categorias.map(c => `<option value="${c.id}" ${c.id === exame._categoriaSugerida ? 'selected' : ''}>${c.nome}</option>`).join('')}
                                                </select>
                                                <select id="ia-parametro-${idx}" class="input-field py-1 px-2 text-xs"></select>
                                            </div>
                                        </td>
                                        <td class="px-3 py-2">
                                            <input type="number" step="any" value="${exame.valor !== null && exame.valor !== undefined ? exame.valor : ''}" 
                                                class="input-field py-1 px-2 text-sm w-24" id="ia-valor-${idx}" 
                                                placeholder="${exame.flag || '—'}">
                                        </td>
                                        <td class="px-3 py-2 text-xs text-surface-500">${exame.referencia || '—'}</td>
                                        <td class="px-3 py-2">
                                            <input type="checkbox" checked class="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500" id="ia-chk-${idx}">
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

                // Salvar dados para referência
                container._iaResultado = resultado;
                container._iaMembros = membros;
            }

            container.innerHTML = html;
            resultado.exames.forEach((exame, idx) => {
                this.atualizarParametrosIA(idx, exame._parametroSugerido);
            });
            document.getElementById('confirmacao-status').textContent = `${resultado.exames?.length || 0} parâmetros extraídos — desmarque os que não quiser salvar`;
            document.getElementById('modal-confirmacao-ia').classList.remove('hidden');
            document.getElementById('modal-confirmacao-ia').classList.add('flex');
        });
    },

    atualizarParametrosIA(idx, selecionado = '') {
        const categoria = document.getElementById(`ia-categoria-${idx}`)?.value;
        const select = document.getElementById(`ia-parametro-${idx}`);
        if (!select) return;

        if (!categoria) {
            select.innerHTML = '<option value="">Parâmetro</option>';
            return;
        }

        const parametros = config.obterParametros(categoria);
        select.innerHTML = '<option value="">Parâmetro</option>' + parametros.map(p => {
            const unidade = p.unidade ? ` (${p.unidade})` : '';
            return `<option value="${p.id}" ${p.id === selecionado ? 'selected' : ''}>${p.nome}${unidade}</option>`;
        }).join('');
    },

    fecharModalConfirmacao() {
        document.getElementById('modal-confirmacao-ia').classList.add('hidden');
        document.getElementById('modal-confirmacao-ia').classList.remove('flex');
    },

    async salvarDadosIA() {
        const container = document.getElementById('confirmacao-conteudo');
        const resultado = container._iaResultado;
        const membros = container._iaMembros;

        if (!resultado || !resultado.exames) {
            this.showToast('Nenhum dado para salvar', 'error');
            return;
        }

        const membroId = parseInt(document.getElementById('ia-membro').value);
        const dataExame = document.getElementById('ia-data').value;
        const laboratorio = document.getElementById('ia-laboratorio').value;

        if (!membroId) {
            this.showToast('Selecione o paciente', 'error');
            return;
        }
        if (!dataExame) {
            this.showToast('Informe a data do exame', 'error');
            return;
        }

        let salvos = 0;
        for (let i = 0; i < resultado.exames.length; i++) {
            const chk = document.getElementById(`ia-chk-${i}`);
            if (!chk || !chk.checked) continue;

            const exame = resultado.exames[i];
            const valorInput = document.getElementById(`ia-valor-${i}`);
            const valor = valorInput ? parseFloat(valorInput.value) : exame.valor;
            if (!valor && valor !== 0) continue;

            const categoria = document.getElementById(`ia-categoria-${i}`)?.value;
            const parametro = document.getElementById(`ia-parametro-${i}`)?.value;
            if (!categoria || !parametro) continue;

            await data.addExame({
                membroId,
                categoria,
                parametro,
                valor,
                data: dataExame,
                laboratorio
            });
            salvos++;
        }

        this.fecharModalConfirmacao();
        this.carregarExames();
        this.showToast(`${salvos} exames salvos com sucesso!`);
    },

    // Comparar
    async prepararComparar() {
        this.popularFiltros();
        this.carregarParametrosComparar();
    },

    carregarParametrosComparar() {
        const cats = config.obterCategorias();
        let html = '';
        cats.forEach(c => {
            const params = config.obterParametros(c.id);
            params.forEach(p => {
                html += `<option value="${c.id}|${p.id}">${c.nome} - ${p.nome}</option>`;
            });
        });
        document.getElementById('comp-parametro').innerHTML = html;
    },

    async compararExames() {
        const membroId = document.getElementById('comp-membro').value;
        const [categoria, parametro] = document.getElementById('comp-parametro').value.split('|');
        
        if (!membroId || !categoria || !parametro) return;

        const exames = await data.getExames({ membroId: parseInt(membroId), categoria, parametro });
        exames.sort((a, b) => new Date(a.data) - new Date(b.data));

        const labels = exames.map(e => this.formatarData(e.data));
        const valores = exames.map(e => e.valor);

        if (this.graficoComparacao) {
            this.graficoComparacao.destroy();
        }

        const ctx = document.getElementById('grafico-comparacao').getContext('2d');
        this.graficoComparacao = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: parametro,
                    data: valores,
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },

    // Crescimento
    async prepararCrescimento() {
        this.popularFiltros();
        this.carregarCrescimento();
    },

    async carregarCrescimento() {
        const membroId = document.getElementById('crianca-membro')?.value;
        if (!membroId) {
            document.getElementById('growth-empty').classList.remove('hidden');
            document.getElementById('growth-chart-container').classList.add('hidden');
            this.carregarTabelaMedicoes([]);
            return;
        }

        const tipo = document.getElementById('tipo-curva').value;
        const todasMedicoes = await data.getMedicoes({ membroId: parseInt(membroId) });

        if (todasMedicoes.length === 0) {
            document.getElementById('growth-empty').classList.remove('hidden');
            document.getElementById('growth-chart-container').classList.add('hidden');
            this.carregarTabelaMedicoes(todasMedicoes);
            return;
        }

        document.getElementById('growth-empty').classList.add('hidden');
        document.getElementById('growth-chart-container').classList.remove('hidden');

        const membros = await data.getMembros();
        const membro = membros.find(m => m.id === parseInt(membroId));

        // Calcular idade em meses para cada medição
        const medicoes = todasMedicoes.map(m => ({
            ...m,
            meses: WHO.idadeEmMeses(membro.data_nascimento, m.data)
        }));

        // Extrair labels (idade em meses)
        const labels = medicoes.map(m => `${Math.floor(m.meses)}m`);

        // Extrair valores, pulando dados inválidos (0 = não medido)
        const valores = medicoes.map(m => {
            let val = null;
            if (tipo === 'altura') val = m.altura || null;
            else if (tipo === 'peso') val = m.peso || null;
            else if (tipo === 'imc') {
                val = (m.altura > 0 && m.peso > 0)
                    ? parseFloat((m.peso / ((m.altura / 100) ** 2)).toFixed(1))
                    : null;
            }
            return val;
        });

        // Filtrar pontos com dados válidos para o gráfico
        const pontosValidos = [];
        const labelsValidos = [];
        medicoes.forEach((m, i) => {
            if (valores[i] !== null && valores[i] > 0) {
                pontosValidos.push(valores[i]);
                labelsValidos.push(labels[i]);
            }
        });

        const titulo = tipo === 'altura' ? 'Altura (cm)' : tipo === 'peso' ? 'Peso (kg)' : 'IMC';
        const cor = tipo === 'altura' ? 'rgb(59, 130, 246)' : tipo === 'peso' ? 'rgb(16, 185, 129)' : 'rgb(245, 158, 11)';

        // Curvas de referência da OMS
        const tabelaRef = WHO.obterCurva(membro.sexo, tipo);
        const labelsRef = tabelaRef ? tabelaRef.map(r => `${r[0]}m`) : [];
        const p3Data = tabelaRef ? tabelaRef.map(r => r[1]) : [];
        const p50Data = tabelaRef ? tabelaRef.map(r => r[3]) : [];
        const p97Data = tabelaRef ? tabelaRef.map(r => r[4]) : [];

        // Percentil da última medição VÁLIDA
        let ultimoPercentil = '';
        if (tabelaRef && pontosValidos.length > 0) {
            const ultimoIdx = medicoes.length - 1;
            const ultima = medicoes[ultimoIdx];
            let valor;
            if (tipo === 'altura') valor = ultima.altura;
            else if (tipo === 'peso') valor = ultima.peso;
            else if (tipo === 'imc') {
                valor = (ultima.altura > 0 && ultima.peso > 0)
                    ? parseFloat((ultima.peso / ((ultima.altura / 100) ** 2)).toFixed(1))
                    : null;
            }
            if (valor && valor > 0) {
                const perc = WHO.calcularPercentil(valor, tabelaRef, ultima.meses);
                if (perc) {
                    ultimoPercentil = `
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
                            <span class="text-2xl font-bold" style="color: ${perc.cor}">${perc.percentil}</span>
                            <div>
                                <p class="text-sm font-medium">Percentil ${perc.percentil}</p>
                                <p class="text-xs text-surface-500">${WHO.descricaoPercentil(perc.percentil)}</p>
                                <p class="text-xs text-surface-500 mt-1">Última: ${this.formatarData(ultima.data)} | ${Math.floor(ultima.meses)} meses | ${valor} ${tipo === 'altura' ? 'cm' : tipo === 'peso' ? 'kg' : ''}</p>
                            </div>
                        </div>`;
                }
            }
        }
        document.getElementById('percentil-info').innerHTML = ultimoPercentil;

        if (this.graficoCrescimento) this.graficoCrescimento.destroy();

        const ctx = document.getElementById('grafico-crescimento').getContext('2d');
        const datasets = [];

        // Faixa OMS (P3-P97) - área sombreada entre P3 e P97
        if (tabelaRef && labelsRef.length > 0) {
            datasets.push({
                label: '',
                data: p3Data,
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderDash: [3, 3],
                pointRadius: 0,
                fill: false,
                borderWidth: 1
            });
            datasets.push({
                label: '',
                data: p97Data,
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderDash: [3, 3],
                pointRadius: 0,
                fill: '-1',
                backgroundColor: 'rgba(99, 102, 241, 0.06)',
                borderWidth: 1
            });
            datasets.push({
                label: 'P50 (média)',
                data: p50Data,
                borderColor: 'rgba(99, 102, 241, 0.35)',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                borderWidth: 1.5
            });
        }

        // Dados da criança (só pontos válidos)
        if (pontosValidos.length > 0) {
            datasets.push({
                label: `${membro.nome}`,
                data: pontosValidos,
                borderColor: cor,
                backgroundColor: cor.replace('rgb', 'rgba').replace(')', ', 0.15)'),
                pointBackgroundColor: cor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.3,
                borderWidth: 3,
                fill: false,
                spanGaps: false
            });
        }

        this.graficoCrescimento = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsRef.length > 0 ? labelsRef : labelsValidos,
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 16,
                            font: { size: 11 },
                            filter: (item) => item.text !== ''
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}${tipo === 'altura' ? ' cm' : tipo === 'peso' ? ' kg' : ''}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxRotation: 45, font: { size: 10 } },
                        title: { display: true, text: 'Idade (meses)', font: { size: 11 } }
                    },
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        title: { display: true, text: titulo, font: { size: 11 } }
                    }
                }
            }
        });

        this.carregarTabelaMedicoes(medicoes, membro);
    },

    carregarTabelaMedicoes(medicoes, membro) {
        const container = document.getElementById('medicoes-tabela');
        if (!medicoes || medicoes.length === 0) {
            container.classList.add('hidden');
            return;
        }
        container.classList.remove('hidden');

        const linhas = medicoes.map(m => {
            const imc = (m.altura > 0 && m.peso > 0)
                ? (m.peso / ((m.altura / 100) ** 2)).toFixed(1)
                : (m.altura > 0 && m.peso > 0) === false && m.altura > 0 !== m.peso > 0 ? '—' : '—';

            // Percentil se disponível
            let percBadge = '';
            if (membro && m.peso > 0 && m.altura > 0) {
                const tabelaPeso = WHO.obterCurva(membro.sexo, 'peso');
                if (tabelaPeso) {
                    const perc = WHO.calcularPercentil(m.peso, tabelaPeso, m.meses || 0);
                    if (perc) percBadge = `<span class="inline-block w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style="background:${perc.cor}">${perc.percentil}</span>`;
                }
            }

            return {
                data: m.data,
                altura: m.altura > 0 ? `${m.altura} cm` : '—',
                peso: m.peso > 0 ? `${m.peso} kg` : '—',
                imc,
                percBadge,
                id: m.id
            };
        });

        container.innerHTML = `
            <h3 class="text-lg font-semibold mb-3">Histórico de Medições (${linhas.length})</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-surface-50 dark:bg-surface-900/50">
                        <tr>
                            <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Data</th>
                            <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Altura</th>
                            <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Peso</th>
                            <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">IMC</th>
                            <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase">Percentil</th>
                            <th class="px-3 py-2 text-left text-xs font-semibold text-surface-500 uppercase"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
                        ${linhas.reverse().map(m => `
                            <tr class="hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors">
                                <td class="px-3 py-2 text-surface-600">${this.formatarData(m.data)}</td>
                                <td class="px-3 py-2 font-medium">${m.altura}</td>
                                <td class="px-3 py-2 font-medium">${m.peso}</td>
                                <td class="px-3 py-2">${m.imc}</td>
                                <td class="px-3 py-2">${m.percBadge}</td>
                                <td class="px-3 py-2">
                                    <button onclick="app.removerMedicao(${m.id})" class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    async salvarMedicao() {
        const membroId = document.getElementById('crianca-membro').value;
        const dataMed = document.getElementById('med-data').value;
        const altura = parseFloat(document.getElementById('med-altura').value) || 0;
        const peso = parseFloat(document.getElementById('med-peso').value) || 0;

        if (!membroId || !dataMed) {
            this.showToast('Selecione a criança e a data', 'error');
            return;
        }
        if (!altura && !peso) {
            this.showToast('Preencha pelo menos altura ou peso', 'error');
            return;
        }

        // Verificar se já existe medição na mesma data
        const existentes = await data.getMedicoes({ membroId: parseInt(membroId) });
        const duplicata = existentes.find(m => m.data === dataMed);
        if (duplicata) {
            if (!confirm(`Já existe uma medição em ${this.formatarData(dataMed)}. Deseja adicionar outra mesmo assim?`)) return;
        }

        await data.addMedicao({
            membroId: parseInt(membroId),
            data: dataMed,
            altura,
            peso
        });

        document.getElementById('med-altura').value = '';
        document.getElementById('med-peso').value = '';
        document.getElementById('med-data').value = '';
        this.carregarCrescimento();
        this.showToast(`Medição salva! (Altura: ${altura || '—'} cm | Peso: ${peso || '—'} kg)`);
    },

    async removerMedicao(id) {
        if (!confirm('Remover esta medição do histórico?')) return;
        await data.deleteMedicao(id);
        this.carregarCrescimento();
        this.showToast('Medição removida');
    },

    // Relatórios
    async prepararRelatorios() {
        this.popularFiltros();
        // Data inicial padrão: 1 ano atrás
        const inicio = new Date();
        inicio.setFullYear(inicio.getFullYear() - 1);
        document.getElementById('rel-data-inicio').value = inicio.toISOString().split('T')[0];
        document.getElementById('rel-data-fim').value = new Date().toISOString().split('T')[0];
        document.getElementById('relatorio-visualizacao').classList.add('hidden');
    },

    async gerarRelatorio(tipo) {
        const membroId = document.getElementById('rel-membro').value;
        const dataInicio = document.getElementById('rel-data-inicio').value;
        const dataFim = document.getElementById('rel-data-fim').value;
        const categoria = document.getElementById('rel-categoria').value;

        this.mostrarLoading(true, 'Gerando relatório...');

        try {
            const dadosRelatorio = await pdf.gerarRelatorio({
                tipo,
                membroId: membroId ? parseInt(membroId) : null,
                dataInicio,
                dataFim,
                categoria
            });

            // Salvar para download posterior
            this._relatorioGerado = dadosRelatorio;

            // Mostrar prévia
            const container = document.getElementById('relatorio-conteudo');
            container.innerHTML = `
                <div class="space-y-3">
                    <h3 class="text-lg font-bold">${dadosRelatorio.titulo}</h3>
                    <p class="text-sm text-surface-500">${dadosRelatorio.subtitulo}</p>
                    <p class="text-sm text-surface-500">${dadosRelatorio.exames.length} exames encontrados</p>
                    <div class="max-h-64 overflow-y-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-surface-50 dark:bg-surface-900/50">
                                <tr>
                                    <th class="px-2 py-1 text-left text-xs font-semibold text-surface-500 uppercase">Data</th>
                                    <th class="px-2 py-1 text-left text-xs font-semibold text-surface-500 uppercase">Exame</th>
                                    <th class="px-2 py-1 text-left text-xs font-semibold text-surface-500 uppercase">Valor</th>
                                    <th class="px-2 py-1 text-left text-xs font-semibold text-surface-500 uppercase">Ref</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
                                ${dadosRelatorio.exames.map(e => `
                                    <tr class="${e.fora ? 'bg-red-50 dark:bg-red-500/5' : ''}">
                                        <td class="px-2 py-1">${e.data}</td>
                                        <td class="px-2 py-1 font-medium">${this.obterNomeParametro(e.categoria, e.parametro)}</td>
                                        <td class="px-2 py-1 font-bold ${e.fora ? 'text-red-600' : ''}">${e.valor}</td>
                                        <td class="px-2 py-1 text-xs text-surface-500">${e.referencia || '—'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            document.getElementById('relatorio-visualizacao').classList.remove('hidden');
            this.showToast(`Relatório gerado: ${dadosRelatorio.exames.length} exames`);
        } catch (e) {
            this.showToast('Erro ao gerar relatório: ' + e.message, 'error');
        } finally {
            this.mostrarLoading(false);
        }
    },

    async baixarRelatorioPDF() {
        if (!this._relatorioGerado) {
            this.showToast('Gere um relatório primeiro', 'error');
            return;
        }
        try {
            await pdf.baixar(this._relatorioGerado);
            this.showToast('PDF baixado!');
        } catch (e) {
            this.showToast('Erro ao baixar: ' + e.message, 'error');
        }
    },

    // Config
    carregarConfig() {
        const cats = config.obterCategorias();
        const container = document.getElementById('config-parametros');
        
        container.innerHTML = cats.map(c => {
            const params = config.obterParametros(c.id);
            return `
                <div class="border-b border-surface-200 dark:border-surface-700 pb-3 mb-2">
                    <h4 class="font-bold text-surface-700 dark:text-surface-200 text-sm mb-2">${c.nome}</h4>
                    ${params.map(p => {
                        const ref = p.ref_geral || p.ref_homem || p.ref_mulher || '';
                        const unidade = p.unidade ? `(${p.unidade})` : '';
                        return `
                            <div class="ml-2 mt-1.5 text-sm flex items-center gap-2 flex-wrap">
                                <span class="font-medium text-surface-700 dark:text-surface-200">${p.nome}:</span>
                                <input type="text" value="${ref}" 
                                    class="input-field py-1 px-2 w-28 text-sm"
                                    onchange="app.atualizarReferencia('${c.id}', '${p.id}', this.value)">
                                <span class="text-surface-500 dark:text-surface-400 text-xs">${unidade}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }).join('');

        // Carregar status das APIs de IA
        this.atualizarStatusIA();
    },

    atualizarStatusIA() {
        this.atualizarStatusProvedorIA('gemini', Gemini);
        this.atualizarStatusProvedorIA('deepseek', DeepSeek);
    },

    atualizarStatusProvedorIA(provider, servico) {
        const keyInput = document.getElementById(`config-${provider}-key`);
        const statusDiv = document.getElementById(`config-${provider}-status`);
        if (keyInput && servico.hasApiKey()) {
            keyInput.value = servico.getApiKey();
            statusDiv.innerHTML = '<span class="text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Chave configurada</span>';
        } else if (statusDiv) {
            statusDiv.innerHTML = '<span class="text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg> Nenhuma chave configurada</span>';
        }
    },

    salvarApiKeyConfig(provider = 'gemini') {
        const input = document.getElementById(`config-${provider}-key`);
        const key = input.value.trim();
        if (!key) {
            this.showToast('Informe a chave da API', 'error');
            return;
        }
        if (provider === 'gemini' && !key.startsWith('AIza')) {
            this.showToast('Chave Gemini inválida. Deve começar com "AIza..."', 'error');
            return;
        }
        if (provider === 'deepseek') DeepSeek.setApiKey(key);
        else Gemini.setApiKey(key);
        this.atualizarStatusIA();
        this.showToast(`Chave da API ${provider === 'deepseek' ? 'DeepSeek' : 'Gemini'} salva!`);
    },

    limparApiKeyConfig(provider = 'gemini') {
        if (provider === 'deepseek') DeepSeek.clearApiKey();
        else Gemini.clearApiKey();
        document.getElementById(`config-${provider}-key`).value = '';
        this.atualizarStatusIA();
        this.showToast('Chave removida');
    },

    // Export/Import
    async exportarJSON() {
        const dados = await data.exportarDados();
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exames_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    async importarJSON(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const dados = JSON.parse(e.target.result);
                await data.importarDados(dados);
                this.showToast('Dados importados com sucesso!');
                this.carregarFamilia();
                this.popularFiltros();
            } catch (err) {
                this.showToast('Erro ao importar: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    },

    // PDF
    async exportarPDF() {
        try {
            const dados = await pdf.gerarRelatorio({ membroId: this.membroAtual || undefined });
            await pdf.baixar(dados);
        } catch (e) {
            this.showToast('Erro ao gerar PDF: ' + e.message, 'error');
        }
    },

    // Cancelar formulário
    cancelarForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.classList.add('hidden');
            form.querySelectorAll('input, select').forEach(el => {
                if (el.type === 'text' || el.type === 'number' || el.tagName === 'SELECT') {
                    if (el.tagName === 'SELECT') {
                        el.selectedIndex = 0;
                    } else {
                        el.value = '';
                    }
                }
            });
        }
    },

    // Google Drive Sync
    async syncDrive() {
        try {
            await sync.sync();
        } catch (e) {
            alert('Erro na sincronização: ' + e.message);
        }
    },

    // Helpers
    formatarData(dataStr) {
        if (!dataStr) return '';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    },

    obterNomeParametro(categoriaId, parametroId) {
        const param = config.obterParametros(categoriaId).find(p => p.id === parametroId);
        return param ? param.nome : parametroId;
    },

    showToast(mensagem, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 translate-y-0 opacity-100 ${
            tipo === 'success' 
                ? 'bg-emerald-500 text-white' 
                : tipo === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-surface-800 text-white'
        }`;
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                ${tipo === 'success' ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : ''}
                ${tipo === 'error' ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : ''}
                <span class="font-medium">${mensagem}</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateY(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    isForaReferencia(valor, referencia) {
        if (!referencia || (!valor && valor !== 0)) return false;

        // Verificar se a referência tem formato "min-max"
        let min, max;

        if (referencia.includes('-')) {
            const partes = referencia.split('-');
            min = parseFloat(partes[0].replace('<', '').replace('>', ''));
            max = parseFloat(partes[1]);
        } else if (referencia.startsWith('<')) {
            max = parseFloat(referencia.substring(1));
            return valor >= max;
        } else if (referencia.startsWith('>')) {
            min = parseFloat(referencia.substring(1));
            return valor <= min;
        }

        if (min !== undefined && max !== undefined) {
            return valor < min || valor > max;
        }

        return false;
    },

    getStatusBadge(valor, referencia) {
        if (!referencia) return '<span class="badge badge-info">N/A</span>';
        const fora = this.isForaReferencia(valor, referencia);
        if (fora) {
            return '<span class="badge badge-danger">Fora</span>';
        }
        return '<span class="badge badge-success">Normal</span>';
    },

    getStatusClasse(valor, referencia) {
        if (!referencia) return '';
        return this.isForaReferencia(valor, referencia) ? 'text-red-600 dark:text-red-400 font-bold' : 'text-emerald-600 dark:text-emerald-400';
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Service Worker (funciona apenas em servidor HTTP)
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    
    // Carregar preferência de tema
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Alternar tema
    const toggle = document.getElementById('dark-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            }
        });
    }
    
    app.init();
});
