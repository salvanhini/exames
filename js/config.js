// config.js - Parâmetros de referência (embutidos para funcionar em file://)

const DADOS_REFERENCIA = {
  "categorias": {
    "hemograma": {
      "nome": "Hemograma Completo",
      "parametros": [
        {"id": "hb", "nome": "Hemoglobina", "unidade": "g/dL", "ref_homem": "13.5-17.5", "ref_mulher": "12.0-15.0"},
        {"id": "hct", "nome": "Hematócrito", "unidade": "%", "ref_homem": "41-50", "ref_mulher": "36-44"},
        {"id": "rbc", "nome": "Eritrócitos", "unidade": "milhões/mm³", "ref_homem": "4.5-5.5", "ref_mulher": "4.0-4.9"},
        {"id": "wbc", "nome": "Leucócitos", "unidade": "mm³", "ref_geral": "4500-10000"},
        {"id": "plt", "nome": "Plaquetas", "unidade": "mm³", "ref_geral": "150000-450000"},
        {"id": "mcv", "nome": "VCM", "unidade": "fL", "ref_geral": "80-100"},
        {"id": "neu", "nome": "Neutrófilos", "unidade": "%", "ref_geral": "54-62"},
        {"id": "lin", "nome": "Linfócitos", "unidade": "%", "ref_geral": "25-33"},
        {"id": "mon", "nome": "Monócitos", "unidade": "%", "ref_geral": "3-7"},
        {"id": "eos", "nome": "Eosinófilos", "unidade": "%", "ref_geral": "1-3"},
        {"id": "bas", "nome": "Basófilos", "unidade": "%", "ref_geral": "0-0.75"}
      ]
    },
    "perfil_lipidico": {
      "nome": "Perfil Lipídico",
      "parametros": [
        {"id": "ct", "nome": "Colesterol Total", "unidade": "mg/dL", "ref_geral": "<200"},
        {"id": "hdl", "nome": "HDL (Bom)", "unidade": "mg/dL", "ref_homem": ">40", "ref_mulher": ">50"},
        {"id": "ldl", "nome": "LDL (Ruim)", "unidade": "mg/dL", "ref_geral": "<100"},
        {"id": "vldl", "nome": "VLDL", "unidade": "mg/dL", "ref_geral": "<30"},
        {"id": "tg", "nome": "Triglicerídeos", "unidade": "mg/dL", "ref_geral": "<150"}
      ]
    },
    "perfil_glicemico": {
      "nome": "Perfil Glicêmico",
      "parametros": [
        {"id": "gli", "nome": "Glicemia em Jejum", "unidade": "mg/dL", "ref_geral": "70-99"},
        {"id": "hba1c", "nome": "Hemoglobina Glicada", "unidade": "%", "ref_geral": "4-5.6"},
        {"id": "ins", "nome": "Insulina", "unidade": "µU/mL", "ref_geral": "2.6-24.9"},
        {"id": "fru", "nome": "Frutosamina", "unidade": "µmol/L", "ref_geral": "200-285"}
      ]
    },
    "funcao_renal": {
      "nome": "Função Renal",
      "parametros": [
        {"id": "cre", "nome": "Creatinina", "unidade": "mg/dL", "ref_homem": "0.7-1.2", "ref_mulher": "0.5-1.0"},
        {"id": "ure", "nome": "Ureia", "unidade": "mg/dL", "ref_geral": "7-25"},
        {"id": "acu", "nome": "Ácido Úrico", "unidade": "mg/dL", "ref_homem": "3.5-7.2", "ref_mulher": "2.6-6.0"},
        {"id": "pro", "nome": "Proteinúria", "unidade": "mg/24h", "ref_geral": "<150"},
        {"id": "ccr", "nome": "Clearance Creatinina", "unidade": "mL/min", "ref_homem": "97-137", "ref_mulher": "88-128"}
      ]
    },
    "funcao_hepatica": {
      "nome": "Função Hepática",
      "parametros": [
        {"id": "ast", "nome": "AST (TGO)", "unidade": "U/L", "ref_geral": "<35"},
        {"id": "alt", "nome": "ALT (TGP)", "unidade": "U/L", "ref_geral": "<35"},
        {"id": "fal", "nome": "Fosfatase Alcalina", "unidade": "U/L", "ref_geral": "30-120"},
        {"id": "ggt", "nome": "GGT", "unidade": "U/L", "ref_homem": "10-50", "ref_mulher": "8-40"},
        {"id": "bil_t", "nome": "Bilirrubina Total", "unidade": "mg/dL", "ref_geral": "0.3-1.2"},
        {"id": "bil_d", "nome": "Bilirrubina Direta", "unidade": "mg/dL", "ref_geral": "<0.3"},
        {"id": "alb", "nome": "Albumina", "unidade": "g/dL", "ref_geral": "3.5-5.5"},
        {"id": "pt", "nome": "Proteínas Totais", "unidade": "g/dL", "ref_geral": "6.0-8.0"}
      ]
    },
    "hormonios_tireoide": {
      "nome": "Hormônios Tireoidianos",
      "parametros": [
        {"id": "tsh", "nome": "TSH", "unidade": "µU/mL", "ref_geral": "0.4-4.0"},
        {"id": "t4_l", "nome": "T4 Livre", "unidade": "ng/dL", "ref_geral": "0.8-1.8"},
        {"id": "t4_t", "nome": "T4 Total", "unidade": "µg/dL", "ref_geral": "5.0-12.0"},
        {"id": "t3_l", "nome": "T3 Livre", "unidade": "pg/mL", "ref_geral": "2.3-4.2"},
        {"id": "t3_t", "nome": "T3 Total", "unidade": "ng/dL", "ref_geral": "80-180"},
        {"id": "antitpo", "nome": "Anti-TPO", "unidade": "UI/mL", "ref_geral": "<35"}
      ]
    },
    "hormonios_sexuais": {
      "nome": "Hormônios Sexuais",
      "parametros": [
        {"id": "test", "nome": "Testosterona Total", "unidade": "ng/dL", "ref_homem": "291-1100", "ref_mulher": "18-54"},
        {"id": "test_l", "nome": "Testosterona Livre", "unidade": "pg/mL", "ref_homem": "5.0-20.0", "ref_mulher": "0.5-2.0"},
        {"id": "est", "nome": "Estradiol", "unidade": "pg/mL", "ref_homem": "<50", "ref_mulher": "30-400"},
        {"id": "lh", "nome": "LH", "unidade": "mIU/mL", "ref_homem": "1.0-12.0", "ref_mulher": "2.0-10.0"},
        {"id": "fsh", "nome": "FSH", "unidade": "mIU/mL", "ref_homem": "1.0-12.0", "ref_mulher": "2.0-10.0"},
        {"id": "prol", "nome": "Prolactina", "unidade": "ng/mL", "ref_homem": "2.0-18.0", "ref_mulher": "2.0-29.0"},
        {"id": "prog", "nome": "Progesterona", "unidade": "ng/mL", "ref_mulher": "0.1-25.0"}
      ]
    },
    "vitaminas_minerais": {
      "nome": "Vitaminas e Minerais",
      "parametros": [
        {"id": "fer", "nome": "Ferro Sérico", "unidade": "µg/dL", "ref_homem": "60-170", "ref_mulher": "50-170"},
        {"id": "ferr", "nome": "Ferritina", "unidade": "ng/mL", "ref_homem": "20-300", "ref_mulher": "20-200"},
        {"id": "vit_d", "nome": "Vitamina D (25-OH)", "unidade": "ng/mL", "ref_geral": "30-100"},
        {"id": "vit_b12", "nome": "Vitamina B12", "unidade": "pg/mL", "ref_geral": "200-900"},
        {"id": "ac_fol", "nome": "Ácido Fólico", "unidade": "ng/mL", "ref_geral": "1.8-9.0"},
        {"id": "calc", "nome": "Cálcio Total", "unidade": "mg/dL", "ref_geral": "8.5-10.5"},
        {"id": "mag", "nome": "Magnésio", "unidade": "mg/dL", "ref_geral": "1.7-2.6"},
        {"id": "zinc", "nome": "Zinco", "unidade": "µg/dL", "ref_geral": "75-140"}
      ]
    },
    "coagulacao": {
      "nome": "Coagulação",
      "parametros": [
        {"id": "tp", "nome": "Tempo de Protrombina", "unidade": "seg", "ref_geral": "11-14"},
        {"id": "inr", "nome": "INR", "unidade": "", "ref_geral": "0.8-1.2"},
        {"id": "ttpa", "nome": "TTPA", "unidade": "seg", "ref_geral": "25-35"},
        {"id": "fibr", "nome": "Fibrinogênio", "unidade": "mg/dL", "ref_geral": "200-400"}
      ]
    },
    "imunologia": {
      "nome": "Imunologia",
      "parametros": [
        {"id": "pcr", "nome": "PCR", "unidade": "mg/L", "ref_geral": "<10"},
        {"id": "vhs", "nome": "VHS", "unidade": "mm/h", "ref_homem": "<15", "ref_mulher": "<20"},
        {"id": "fr", "nome": "Fator Reumatoide", "unidade": "UI/mL", "ref_geral": "<20"},
        {"id": "aso", "nome": "ASO", "unidade": "UI/mL", "ref_geral": "<200"}
      ]
    },
    "urina": {
      "nome": "Exame de Urina (EAS)",
      "parametros": [
        {"id": "ph", "nome": "pH", "unidade": "", "ref_geral": "5.0-7.5"},
        {"id": "dens", "nome": "Densidade", "unidade": "", "ref_geral": "1.005-1.030"},
        {"id": "uva_alb", "nome": "Proteínas", "unidade": "", "ref_geral": "Negativo"},
        {"id": "uva_gli", "nome": "Glicose", "unidade": "", "ref_geral": "Negativo"},
        {"id": "uva_cet", "nome": "Cetonas", "unidade": "", "ref_geral": "Negativo"}
      ]
    },
    "eletrolitos": {
      "nome": "Eletrólitos",
      "parametros": [
        {"id": "na", "nome": "Sódio", "unidade": "mEq/L", "ref_geral": "135-145"},
        {"id": "k", "nome": "Potássio", "unidade": "mEq/L", "ref_geral": "3.5-5.0"},
        {"id": "cl", "nome": "Cloreto", "unidade": "mEq/L", "ref_geral": "98-106"}
      ]
    },
    "enzimas_cardiacas": {
      "nome": "Enzimas Cardíacas",
      "parametros": [
        {"id": "ck_mb", "nome": "CK-MB", "unidade": "ng/mL", "ref_geral": "<5"},
        {"id": "trop", "nome": "Troponina I", "unidade": "ng/mL", "ref_geral": "<0.04"},
        {"id": "ldh", "nome": "LDH", "unidade": "U/L", "ref_geral": "140-280"}
      ]
    },
    "marcadores_tumorais": {
      "nome": "Marcadores Tumorais",
      "parametros": [
        {"id": "psa", "nome": "PSA Total", "unidade": "ng/mL", "ref_homem": "<4.0"},
        {"id": "ca125", "nome": "CA-125", "unidade": "U/mL", "ref_mulher": "<35"},
        {"id": "ca199", "nome": "CA 19-9", "unidade": "U/mL", "ref_geral": "<37"},
        {"id": "cea", "nome": "CEA", "unidade": "ng/mL", "ref_geral": "<5"}
      ]
    },
    "sorologias": {
      "nome": "Sorologias",
      "parametros": [
        {"id": "hbsag", "nome": "HBsAg (Hepatite B)", "unidade": "", "ref_geral": "Negativo"},
        {"id": "anti_hcv", "nome": "Anti-HCV (Hepatite C)", "unidade": "", "ref_geral": "Negativo"},
        {"id": "anti_hiv", "nome": "Anti-HIV", "unidade": "", "ref_geral": "Negativo"},
        {"id": "vdrl", "nome": "VDRL (Sífilis)", "unidade": "", "ref_geral": "Negativo"}
      ]
    },
    "fezes": {
      "nome": "Exame de Fezes",
      "parametros": [
        {"id": "so", "nome": "Sangue Oculto", "unidade": "", "ref_geral": "Negativo"},
        {"id": "parasitas", "nome": "Parasitas", "unidade": "", "ref_geral": "Ausentes"}
      ]
    },
    "hormonio_crescimento": {
      "nome": "Hormônio do Crescimento",
      "parametros": [
        {"id": "gh", "nome": "GH", "unidade": "ng/mL", "ref_geral": "<10"},
        {"id": "igf1", "nome": "IGF-1", "unidade": "ng/mL", "ref_geral": "100-300"}
      ]
    },
    "beta_hcg": {
      "nome": "Beta hCG",
      "parametros": [
        {"id": "bhcg", "nome": "Beta hCG", "unidade": "mIU/mL", "ref_mulher": "<5"}
      ]
    }
  }
};

const config = {
    parametros: null,

    async carregar() {
        // Tenta carregar da localStorage (se houver edições do usuário)
        const salvos = localStorage.getItem('parametros_referencia');
        if (salvos) {
            try {
                this.parametros = JSON.parse(salvos);
                return this.parametros;
            } catch (e) {
                // ignorar, usar padrão
            }
        }
        
        // Usa dados embutidos
        this.parametros = DADOS_REFERENCIA;
        return this.parametros;
    },

    obterCategorias() {
        if (!this.parametros || !this.parametros.categorias) return [];
        return Object.keys(this.parametros.categorias).map(id => ({
            id,
            nome: this.parametros.categorias[id].nome
        }));
    },

    obterParametros(categoriaId) {
        if (!this.parametros || !this.parametros.categorias || !this.parametros.categorias[categoriaId]) return [];
        return this.parametros.categorias[categoriaId].parametros || [];
    },

    obterReferencia(categoriaId, parametroId, sexo) {
        if (!this.parametros) return null;
        const cat = this.parametros.categorias[categoriaId];
        if (!cat) return null;
        const param = cat.parametros.find(p => p.id === parametroId);
        if (!param) return null;
        if (sexo === 'M' && param.ref_homem) return param.ref_homem;
        if (sexo === 'F' && param.ref_mulher) return param.ref_mulher;
        return param.ref_geral || param.ref_homem || param.ref_mulher;
    },

    salvarEdicao(categoriaId, parametroId, novoParam) {
        if (!this.parametros) return false;
        const cat = this.parametros.categorias[categoriaId];
        if (!cat) return false;
        const idx = cat.parametros.findIndex(p => p.id === parametroId);
        if (idx === -1) return false;
        cat.parametros[idx] = { ...cat.parametros[idx], ...novoParam };
        localStorage.setItem('parametros_referencia', JSON.stringify(this.parametros));
        return true;
    },

    restaurarPadrao() {
        localStorage.removeItem('parametros_referencia');
        this.parametros = DADOS_REFERENCIA;
        return this.parametros;
    }
};
