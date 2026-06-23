import os
import json
import re
import argparse
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv('../.env')

class NpsAiFlow:
    def __init__(self, model=None):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.prompts_path = "../src/main/resources/prompts/"

    def call_openai(self, prompt, json_mode=False):
        response_format = { "type": "json_object" } if json_mode else None
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            response_format=response_format
        )
        return response.choices[0].message.content

    def load_prompt(self, filename):
        path = os.path.join(self.prompts_path, filename)
        if not os.path.exists(path):
            # Fallback para .md se não for .txt
            if filename.endswith('.txt'):
                path = path.replace('.txt', '.md')
            elif not filename.endswith('.md'):
                path = path + '.md'
            
        if not os.path.exists(path):
            raise FileNotFoundError(f"Prompt não encontrado: {path}")
            
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()

    def clean_json(self, text):
        match = re.search(r'\{.*\}', text, re.DOTALL)
        return match.group(0) if match else text

    def run_flow(self, chat_text):
        print("--- Iniciando Fluxo de IA ---")
        
        # 1. Metadados
        print("1. Extraindo Metadados...")
        prompt_meta = self.load_prompt("Extrair Metadados")
        metadata = json.loads(self.clean_json(self.call_openai(prompt_meta.replace("{{input}}", chat_text), json_mode=True)))

        # 2. Tagueamento
        print("2. Tagueamento (Serviço e Erros)...")
        tag_prompt = """
        Analise o atendimento abaixo e identifique:
        1. Serviço principal (Ex: FGTS, Folha, Impostos, Admissão, etc. - Máximo 2 palavras)
        2. Marcadores de erro (Lista de erros encontrados no formato #Erro, ex: #ErroCalculo #Esquecimento)

        Retorne apenas um JSON:
        {
          "servico_principal": "",
          "marcadores": []
        }

        Texto:
        """
        tags = json.loads(self.clean_json(self.call_openai(tag_prompt + chat_text, json_mode=True)))

        # 3 & 4. Score das Dimensões
        dimensoes = [
            "Comunicação e Clareza",
            "Profissionalismo e Conformidade",
            "Resolução e Eficiência"
        ]
        scores = []
        for dim in dimensoes:
            print(f"3/4. Avaliando dimensão: {dim}...")
            prompt_dim = self.load_prompt(dim)
            prompt_dim = prompt_dim.replace("{{input}}", chat_text)
            prompt_dim = prompt_dim.replace("{{contexto_feedback}}", "")
            prompt_dim = prompt_dim.replace("{{contexto_global}}", "")
            
            res_dim = json.loads(self.clean_json(self.call_openai(prompt_dim, json_mode=True)))
            res_dim["dimensao"] = dim
            scores.append(res_dim)

        # 5. Consolidação
        print("5. Consolidando resultados...")
        notas = [s.get('nota', 0) for s in scores]
        media = sum(notas) / len(notas) if notas else 0

        # 6. Resposta
        print("6. Gerando Resumo e Resposta Final...")
        prompt_resumo = self.load_prompt("Resumir Atendimento")
        resumo = self.call_openai(prompt_resumo.replace("{{input}}", chat_text))

        final_result = {
            "metadata": metadata,
            "tags": tags,
            "scores": scores,
            "media": round(media, 2),
            "resumo": resumo
        }
        
        return final_result

    def format_output(self, result):
        m = result['metadata']
        t = result['tags']
        
        output = f"""
==================================================
RESULTADO DA AVALIAÇÃO
==================================================
Atendimento: {m.get('numero_atendimento', 'N/A')}
Atendente: {m.get('atendente_principal', 'N/A')}
Cliente: {m.get('nome_cliente', 'N/A')}
Serviço: {t.get('servico_principal', 'N/A')}
Marcadores: {' '.join(t.get('marcadores', []))}

Nota FINAL: {result['media']}
Resumo: {result['resumo']}

DETALHAMENTO POR DIMENSÃO:
"""
        for s in result['scores']:
            output += f"- {s['dimensao']}: Nota {s['nota']}\n  Justificativa: {s['justificativa']}\n"
            
        output += "=================================================="
        return output

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Testa o fluxo de IA do NPS Inteligente')
    parser.add_argument('--chat', type=str, help='Texto do chat para avaliar')
    parser.add_argument('--file', type=str, help='Caminho para arquivo txt com o chat')
    
    args = parser.parse_args()
    
    chat_input = ""
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            chat_input = f.read()
    elif args.chat:
        chat_input = args.chat
    else:
        # Exemplo padrão
        chat_input = """
        Cliente: Bom dia, minha folha veio errada.
        Atendente: Olá, vou verificar. Realmente, houve um erro no cálculo das horas extras.
        Atendente: Já corrigi e estou enviando a nova guia. Peço desculpas.
        Cliente: Obrigado pela rapidez.
        """

    flow = NpsAiFlow()
    result = flow.run_flow(chat_input)
    print(flow.format_output(result))
