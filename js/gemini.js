// gemini.js - Integração com Google Gemini API para análise de exames

const GEMINI_MODEL = 'gemini-1.5-flash'; // Modelo rápido e eficiente
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const Gemini = {
    _apiKey: null,

    init() {
        this._apiKey = localStorage.getItem('gemini_api_key');
    },

    setApiKey(key) {
        this._apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    },

    getApiKey() {
        return this._apiKey;
    },

    hasApiKey() {
        return !!this._apiKey;
    },

    clearApiKey() {
        this._apiKey = null;
        localStorage.removeItem('gemini_api_key');
    },

    async validarChave() {
        if (!this._apiKey) return false;
        try {
            const resp = await fetch(`${GEMINI_ENDPOINT}?key=${this._apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'OK' }] }],
                    generationConfig: { maxOutputTokens: 10 }
                })
            });
            return resp.ok;
        } catch {
            return false;
        }
    },

    PROMPT_SISTEMA: `Você é um assistente especializado em análise de exames laboratoriais brasileiros.

Analise o PDF do exame e extraia TODAS as informações de exames encontradas.

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem texto extra):

{
  "paciente": "nome completo do paciente",
  "data_coleta": "AAAA-MM-DD",
  "laboratorio": "nome do laboratório (se visível)",
  "exames": [
    {
      "categoria": "categoria do exame (ex: Hemograma, Perfil Lipídico, Glicêmico, Função Renal, Função Hepática, Hormônios, Vitaminas, Urina, etc)",
      "parametro": "nome do parâmetro (ex: Hemoglobina, Colesterol Total, TSH, etc)",
      "valor": 123.4,
      "unidade": "g/dL",
      "referencia": "13.5-17.5 ou <200 ou >40 ou Negativo",
      "flag": "N" ou "H" ou "L" (Normal, High, Low - se houver no laudo)
    }
  ]
}

REGRAS IMPORTANTES:
- valor deve ser número (use null se não conseguir extrair)
- referencia como string exata do laudo
- parametro em português claro
- Se não encontrar paciente ou data, deixe null
- Extraia TODOS os exames do laudo, não apenas alguns
- Se o valor tiver vírgula como separador decimal, converta para ponto (ex: 14,5 → 14.5)
- Para exames qualitativos (Negativo, Positivo, Ausente, etc), use valor: null e coloque o resultado em flag`,

    async analisarPDF(file) {
        if (!this._apiKey) {
            throw new Error('Chave da API Gemini não configurada');
        }

        // Ler PDF como base64
        const base64 = await this._lerArquivoBase64(file);

        // Chamar Gemini
        const response = await fetch(`${GEMINI_ENDPOINT}?key=${this._apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: this.PROMPT_SISTEMA },
                        {
                            inlineData: {
                                mimeType: file.type || 'application/pdf',
                                data: base64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 4096,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const erro = await response.text();
            throw new Error(`Erro Gemini: ${response.status} - ${erro}`);
        }

        const data = await response.json();

        // Extrair texto da resposta
        const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!texto) {
            throw new Error('Gemini não retornou dados');
        }

        // Limpar markdown JSON se houver
        const jsonStr = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
            const parsed = JSON.parse(jsonStr);
            return parsed;
        } catch (e) {
            // Tentar extrair JSON do texto
            const match = texto.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error('Não foi possível interpretar a resposta da IA: ' + texto.substring(0, 200));
        }
    },

    async _lerArquivoBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsDataURL(file);
        });
    },

    // Mapear parâmetro extraído para nossas categorias/ids
    mapearExame(exame) {
        // Normalizar nome
        const nome = exame.parametro?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
        
        // Tabela de mapeamento
        const mapa = {
            'hemoglobina': { cat: 'hemograma', id: 'hb' },
            'hematocrito': { cat: 'hemograma', id: 'hct' },
            'hb': { cat: 'hemograma', id: 'hb' },
            'hct': { cat: 'hemograma', id: 'hct' },
            'hcm': { cat: 'hemograma', id: 'hcm' },
            'vcm': { cat: 'hemograma', id: 'mcv' },
            'rdw': { cat: 'hemograma', id: 'rdw' },
            'eritrocitos': { cat: 'hemograma', id: 'rbc' },
            'leucocitos': { cat: 'hemograma', id: 'wbc' },
            'plaquetas': { cat: 'hemograma', id: 'plt' },
            'neutrofilos': { cat: 'hemograma', id: 'neu' },
            'linfocitos': { cat: 'hemograma', id: 'lin' },
            'monocitos': { cat: 'hemograma', id: 'mon' },
            'eosinofilos': { cat: 'hemograma', id: 'eos' },
            'basofilos': { cat: 'hemograma', id: 'bas' },
            'colesterol total': { cat: 'perfil_lipidico', id: 'ct' },
            'colesterol': { cat: 'perfil_lipidico', id: 'ct' },
            'hdl': { cat: 'perfil_lipidico', id: 'hdl' },
            'ldl': { cat: 'perfil_lipidico', id: 'ldl' },
            'vldl': { cat: 'perfil_lipidico', id: 'vldl' },
            'triglicerideos': { cat: 'perfil_lipidico', id: 'tg' },
            'glicemia': { cat: 'perfil_glicemico', id: 'gli' },
            'glicose': { cat: 'perfil_glicemico', id: 'gli' },
            'hemoglobina glicada': { cat: 'perfil_glicemico', id: 'hba1c' },
            'hba1c': { cat: 'perfil_glicemico', id: 'hba1c' },
            'insulina': { cat: 'perfil_glicemico', id: 'ins' },
            'creatinina': { cat: 'funcao_renal', id: 'cre' },
            'ureia': { cat: 'funcao_renal', id: 'ure' },
            'acido urico': { cat: 'funcao_renal', id: 'acu' },
            'tsh': { cat: 'hormonios_tireoide', id: 'tsh' },
            't4 livre': { cat: 'hormonios_tireoide', id: 't4_l' },
            't3 livre': { cat: 'hormonios_tireoide', id: 't3_l' },
            'testosterona': { cat: 'hormonios_sexuais', id: 'test' },
            'estradiol': { cat: 'hormonios_sexuais', id: 'est' },
            'lh': { cat: 'hormonios_sexuais', id: 'lh' },
            'fsh': { cat: 'hormonios_sexuais', id: 'fsh' },
            'prolactina': { cat: 'hormonios_sexuais', id: 'prol' },
            'vitamina d': { cat: 'vitaminas_minerais', id: 'vit_d' },
            'vitamina b12': { cat: 'vitaminas_minerais', id: 'vit_b12' },
            'ferro': { cat: 'vitaminas_minerais', id: 'fer' },
            'ferritina': { cat: 'vitaminas_minerais', id: 'ferr' },
            'calcio': { cat: 'vitaminas_minerais', id: 'calc' },
            'magnesio': { cat: 'vitaminas_minerais', id: 'mag' },
            'zinco': { cat: 'vitaminas_minerais', id: 'zinc' },
            'ast': { cat: 'funcao_hepatica', id: 'ast' },
            'alt': { cat: 'funcao_hepatica', id: 'alt' },
            'ggt': { cat: 'funcao_hepatica', id: 'ggt' },
            'bilirrubina': { cat: 'funcao_hepatica', id: 'bil_t' },
            'albumina': { cat: 'funcao_hepatica', id: 'alb' },
            'pcr': { cat: 'imunologia', id: 'pcr' },
            'vhs': { cat: 'imunologia', id: 'vhs' },
            'inr': { cat: 'coagulacao', id: 'inr' },
            'psa': { cat: 'marcadores_tumorais', id: 'psa' }
        };

        // Procurar no mapa
        for (const [chave, valor] of Object.entries(mapa)) {
            if (nome.includes(chave)) {
                return { ...exame, categoria: valor.cat, parametro_id: valor.id };
            }
        }

        // Se não mapeou, manter categoria original da IA
        return exame;
    }
};

Gemini.init();
