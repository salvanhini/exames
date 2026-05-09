// deepseek.js - Integracao com DeepSeek API para extrair exames a partir de texto/PDF

const DEEPSEEK_MODEL = 'deepseek-v4-flash';
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';

const DeepSeek = {
    _apiKey: null,

    init() {
        this._apiKey = localStorage.getItem('deepseek_api_key');
    },

    setApiKey(key) {
        this._apiKey = key;
        localStorage.setItem('deepseek_api_key', key);
    },

    getApiKey() {
        return this._apiKey;
    },

    hasApiKey() {
        return !!this._apiKey;
    },

    clearApiKey() {
        this._apiKey = null;
        localStorage.removeItem('deepseek_api_key');
    },

    PROMPT_SISTEMA: Gemini.PROMPT_SISTEMA,

    async analisarArquivo(file) {
        if (!this._apiKey) {
            throw new Error('Chave da API DeepSeek nao configurada');
        }

        const texto = await this._extrairTexto(file);
        if (!texto.trim()) {
            throw new Error('Nao foi possivel extrair texto do arquivo. Tente enviar o PDF pelo Gemini ou use um PDF com texto selecionavel.');
        }

        const response = await fetch(DEEPSEEK_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this._apiKey}`
            },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    { role: 'system', content: this.PROMPT_SISTEMA },
                    { role: 'user', content: `Texto extraido do exame:\n\n${texto}` }
                ],
                temperature: 0.1,
                max_tokens: 4096,
                response_format: { type: 'json_object' },
                thinking: { type: 'disabled' }
            })
        });

        if (!response.ok) {
            const erro = await response.text();
            throw new Error(`Erro DeepSeek: ${response.status} - ${erro}`);
        }

        const data = await response.json();
        const textoResposta = data?.choices?.[0]?.message?.content;
        if (!textoResposta) {
            throw new Error('DeepSeek nao retornou dados');
        }

        try {
            return JSON.parse(textoResposta);
        } catch {
            const match = textoResposta.match(/\{[\s\S]*\}/);
            if (match) return JSON.parse(match[0]);
            throw new Error('Nao foi possivel interpretar a resposta da IA: ' + textoResposta.substring(0, 200));
        }
    },

    async _extrairTexto(file) {
        if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
            return file.text();
        }

        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            return this._extrairTextoPDF(file);
        }

        throw new Error('Formato nao suportado pelo DeepSeek. Use PDF ou TXT.');
    },

    async _extrairTextoPDF(file) {
        if (!window.pdfjsLib) {
            throw new Error('Leitor de PDF nao carregado');
        }

        if (window.pdfjsLib.GlobalWorkerOptions) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const buffer = await file.arrayBuffer();
        const pdfDoc = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const paginas = [];

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            paginas.push(content.items.map(item => item.str).join(' '));
        }

        return paginas.join('\n\n');
    },

    mapearExame(exame) {
        return Gemini.mapearExame(exame);
    }
};

DeepSeek.init();
