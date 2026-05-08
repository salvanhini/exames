// pdf.js - Gerador de Relatórios Profissionais
const pdf = {
    async gerarRelatorio(opcoes = {}) {
        const { tipo, membroId, dataInicio, dataFim, categoria } = opcoes;

        // Buscar dados
        const todosExames = await data.getExames();
        const membros = await data.getMembros();
        const medicoes = await data.getMedicoes();

        // Filtrar
        let exames = todosExames.filter(e => {
            if (membroId && e.membroId !== membroId) return false;
            if (dataInicio && e.data < dataInicio) return false;
            if (dataFim && e.data > dataFim) return false;
            if (categoria && e.categoria !== categoria) return false;
            return true;
        });

        // Ordenar por data
        exames.sort((a, b) => new Date(a.data) - new Date(b.data));

        const membro = membroId ? membros.find(m => m.id === membroId) : null;
        const nomePaciente = membro ? membro.nome : 'Todos os membros';
        const periodo = dataInicio && dataFim
            ? `${this.formatarData(dataInicio)} a ${this.formatarData(dataFim)}`
            : 'Todo período';

        // Enriquecer exames com referências
        const examesEnriquecidos = exames.map(e => {
            const m = membros.find(mem => mem.id === e.membroId);
            const ref = config.obterReferencia(e.categoria, e.parametro, m?.sexo);
            const fora = ref ? !!(app.isForaReferencia ? app.isForaReferencia(e.valor, ref) : false) : false;
            // Pegar nome da categoria
            const cats = config.obterCategorias();
            const catObj = cats.find(c => c.id === e.categoria);
            return {
                ...e,
                nomeMembro: m?.nome || 'N/A',
                nomeCategoria: catObj?.nome || e.categoria,
                referencia: ref || '—',
                fora
            };
        });

        // Agrupar por categoria para relatório completo
        const porCategoria = {};
        examesEnriquecidos.forEach(e => {
            if (!porCategoria[e.nomeCategoria]) porCategoria[e.nomeCategoria] = [];
            porCategoria[e.nomeCategoria].push(e);
        });

        // Títulos conforme tipo
        const titulos = {
            completo: 'Relatório Completo de Exames',
            comparativo: 'Relatório Comparativo de Exames',
            evolucao: 'Evolução de Parâmetros',
            crescimento: 'Curva de Crescimento'
        };

        const titulo = titulos[tipo] || 'Relatório de Exames';
        const subtitulo = membroId
            ? `${nomePaciente} | ${periodo}`
            : `Todos os membros | ${periodo}`;

        return {
            titulo,
            subtitulo,
            tipo,
            nomePaciente,
            periodo,
            membro,
            membros,
            exames: examesEnriquecidos,
            porCategoria,
            medicoes,
            dataGeracao: new Date().toLocaleDateString('pt-BR'),
            horaGeracao: new Date().toLocaleTimeString('pt-BR')
        };
    },

    async baixar(dadosRelatorio) {
        const doc = new jspdf.jsPDF('p', 'mm', 'a4');
        const pageW = 210; // mm
        const margin = 20;
        const contentW = pageW - 2 * margin;
        let y = margin;

        // ===================== CABEÇALHO =====================
        // Barra colorida no topo
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.rect(0, 0, pageW, 8, 'F');

        y = 16;

        // Título principal
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(18);
        doc.text(dadosRelatorio.titulo, margin, y);

        y += 8;
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(dadosRelatorio.subtitulo, margin, y);

        // Linha separadora
        y += 4;
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageW - margin, y);

        y += 6;

        // Informações do paciente
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont(undefined, 'bold');

        if (dadosRelatorio.membro) {
            const m = dadosRelatorio.membro;
            doc.text(`Paciente: ${m.nome}`, margin, y); y += 5;
            doc.setFont(undefined, 'normal');
            doc.text(`Nascimento: ${app.formatarData ? app.formatarData(m.data_nascimento) : m.data_nascimento}`, margin, y); y += 5;
            doc.text(`Sexo: ${m.sexo === 'M' ? 'Masculino' : 'Feminino'}`, margin, y); y += 5;
        } else {
            doc.setFont(undefined, 'normal');
            doc.text('Paciente: Todos os membros da família', margin, y); y += 5;
        }

        doc.text(`Período: ${dadosRelatorio.periodo}`, margin, y); y += 5;
        doc.text(`Gerado em: ${dadosRelatorio.dataGeracao} às ${dadosRelatorio.horaGeracao}`, margin, y); y += 5;
        doc.text(`Total de exames: ${dadosRelatorio.exames.length}`, margin, y);

        y += 8;

        // ===================== TABELA DE EXAMES =====================
        doc.setFontSize(9);

        const colData = 8;
        const colMembro = tipo === 'completo' ? 30 : 0;
        let colX = margin;
        const colExame = margin + colData + (colMembro || 2);
        const colValor = colExame + 55;
        const colRef = colValor + 22;
        const colStatus = colRef + 25;
        const larguraUtil = contentW - colData - 55 - 22 - 25 - (colMembro || 2);

        // Cabeçalho da tabela
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y - 4, contentW, 6, 'F');
        doc.setTextColor(71, 85, 105);
        doc.setFont(undefined, 'bold');

        let cx = margin;
        doc.text('Data', cx, y); cx += colData;
        if (tipo === 'completo') { doc.text('Membro', cx, y); cx += colMembro; }
        doc.text('Exame', cx, y); cx += 55;
        doc.text('Valor', cx, y); cx += 22;
        doc.text('Referência', cx, y); cx += 25;
        doc.text('Status', cx, y);

        y += 8;
        doc.setFont(undefined, 'normal');
        doc.setTextColor(15, 23, 42);

        let examesMostrados = 0;

        if (tipo === 'completo' || !tipo) {
            // Agrupar por categoria
            for (const [catNome, examesCat] of Object.entries(dadosRelatorio.porCategoria)) {
                if (y > 270) {
                    doc.addPage();
                    y = margin + 10;
                }

                // Título da categoria
                doc.setFillColor(238, 242, 255);
                doc.rect(margin, y - 4, contentW, 6, 'F');
                doc.setTextColor(79, 70, 229);
                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(catNome, margin, y);
                doc.setFontSize(9);
                doc.setTextColor(15, 23, 42);
                doc.setFont(undefined, 'normal');
                y += 8;

                // Itens da categoria
                for (const exame of examesCat) {
                    if (y > 270) {
                        doc.addPage();
                        y = margin + 10;
                    }

                    cx = margin;
                    doc.setTextColor(100, 116, 139);
                    doc.text(this._formatarData(exame.data), cx, y); cx += colData;

                    if (tipo === 'completo') {
                        doc.text(exame.nomeMembro, cx, y); cx += colMembro;
                    }

                    doc.setTextColor(15, 23, 42);
                    doc.text(exame.parametro, cx, y); cx += 55;

                    // Valor - vermelho se fora da referência
                    if (exame.fora) {
                        doc.setTextColor(220, 38, 38);
                        doc.setFont(undefined, 'bold');
                    }
                    doc.text(String(exame.valor), cx, y); cx += 22;
                    doc.setFont(undefined, 'normal');
                    doc.setTextColor(100, 116, 139);
                    doc.text(exame.referencia, cx, y); cx += 25;

                    // Status badge
                    if (exame.fora) {
                        doc.setTextColor(220, 38, 38);
                        doc.text('⚠ ALTERADO', cx, y);
                    } else {
                        doc.setTextColor(22, 163, 74);
                        doc.text('✓ Normal', cx, y);
                    }
                    doc.setTextColor(15, 23, 42);

                    y += 5.5;
                    examesMostrados++;
                }
                y += 2;
            }
        }

        if (examesMostrados === 0) {
            doc.setTextColor(100, 116, 139);
            doc.text('Nenhum exame encontrado para os filtros selecionados.', margin, y);
        }

        // ===================== RODAPÉ =====================
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            // Barra inferior
            doc.setFillColor(79, 70, 229);
            doc.rect(0, 293, pageW, 4, 'F');
            // Número da página
            doc.setFontSize(7);
            doc.setTextColor(255, 255, 255);
            doc.text(`Página ${i} de ${totalPages}`, pageW - margin - 30, 296);
            doc.text('Sistema de Exames da Família', margin, 296);
        }

        doc.save(`relatorio_${dadosRelatorio.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
    },

    _formatarData(dataStr) {
        if (!dataStr) return '';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    },

    formatarData(dataStr) {
        return this._formatarData(dataStr);
    }
};

// Adicionar referencia a app para uso no relatório
if (typeof app === 'undefined') {
    console.warn('pdf.js: app não está disponível');
}
