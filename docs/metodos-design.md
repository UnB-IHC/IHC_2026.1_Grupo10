<style>
  .alert-info { background-color: #F0F9FF; border-left: 4px solid #0ea5e9; padding: 16px 20px; margin: 25px 0; border-radius: 4px; }
  .alert-info-title { color: #0369a1; font-size: 1rem; display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 10px; }
  .alert-info ul { margin: 0; font-size: 1.05rem; }
  
  .alert-tip { background-color: #F0FDF4; border-left: 4px solid #16a34a; padding: 16px 20px; margin: 25px 0; border-radius: 4px; }
  .alert-tip-title { color: #15803d; font-size: 1rem; display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 10px; }
  .alert-tip p { margin: 0; color: #111827; font-size: 1.05rem; }

  table { width: 100%; border-collapse: collapse; margin: 25px 0; border: 1px solid #E5E7EB; text-align: left;}
  th { background: #ffffff; padding: 15px; border-bottom: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; }
  td { padding: 15px; border-bottom: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; }
</style>

# Empatia, Codesign e Mapeamento

Para criar soluções que realmente funcionem, precisamos ir além dos requisitos técnicos. Este guia resume a mentalidade necessária para o Design Centrado no Usuário.

## 1. Empatia (A Base de Tudo)
Empatia em design não é apenas "ser legal". É a capacidade técnica de deixar de lado suas próprias suposições para entender as necessidades, dores e contexto de outra pessoa.

<div class="alert-info">
    <div class="alert-info-title">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Diferença Crítica
    </div>
    <ul>
        <li><strong>Simpatia:</strong> "Sinto muito que você tenha esse problema." (Distanciamento).</li>
        <li><strong>Empatia:</strong> "Eu entendo como você se sente e por que isso é um problema." (Conexão).</li>
    </ul>
</div>

### Como praticar no projeto?
* **Não julgue:** Se o usuário não consegue usar o botão, o erro é do design, não dele.
* **Imersão:** Tente usar o sistema nas mesmas condições que o usuário (ex: usar leitor de tela, internet lenta).
* **Escuta Ativa:** Nas entrevistas, ouça mais do que fale. Pergunte "Por quê?" repetidamente.



## 2. Codesign (Design Participativo)
Codesign é a mudança de mentalidade de desenhar **PARA** o usuário, para desenhar **COM** o usuário.

Em vez de tratar as pessoas apenas como objetos de pesquisa passivos, trazemos elas para a mesa de criação.

### Técnicas de Codesign
* **Card Sorting:** Peça para os usuários organizarem os menus do site com cartões de papel. Isso revela como *eles* estruturam a informação mentalmente.
* **Workshops de Criação:** Dê papel e caneta para o usuário desenhar como ele imagina a solução ideal (mesmo que seja feio, a ideia é o que vale).
* **Validar Rascunhos:** Mostre rabiscos iniciais, não telas prontas. Isso encoraja o usuário a criticar e dar ideias sem medo de "estragar" o trabalho final.



## 3. Métodos de Mapeamento (Mapping Methods)
Mapear é o ato de tornar visível o invisível. Transformamos dados complexos e experiências abstratas em diagramas que a equipe toda entende.

### Principais Mapas (Resumo)

| Tipo de Mapa | O que ele mostra? | Quando usar? |
| :--- | :--- | :--- |
| **Mapa de Empatia** | O que o usuário **Diz, Faz, Pensa e Sente**. | No início, para sintetizar entrevistas e criar Personas. |
| **Mapa de Stakeholders** | Quem são todas as pessoas envolvidas (internas e externas). | Para entender quem influencia ou é afetado pelo projeto. |
| **Jornada do Usuário** | A experiência cronológica do usuário (Macro). | [Veja nosso guia detalhado aqui](../IHC-A11yPocket/pages/fluxo-jornada.html). |
| **Service Blueprint** | Os bastidores operacionais do serviço. | [Veja nosso guia detalhado aqui](../IHC-A11yPocket/pages/service-blueprint.html). |

<div class="alert-tip">
    <div class="alert-tip-title">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        Visão Estratégica
    </div>
    <p>Mapas não são entregáveis finais para "ficar bonito na parede". Eles são <strong>ferramentas de trabalho</strong> vivas que devem ser atualizadas conforme descobrimos coisas novas.</p>
</div>



## Referência Bibliográfica
> STICKDORN, M.; SCHNEIDER, J. **This is Service Design Thinking**: Basics, Tools, Cases. Wiley, 2011.
> 
> BROWN, Tim. **Change by Design**: How Design Thinking Transforms Organizations and Inspires Innovation. Harper Business, 2009.
> 
> IDEO. **The Field Guide to Human-Centered Design**. 2015.