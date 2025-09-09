# Guia do Modo de Edição - MinhaGrana

## Visão Geral

A landing page do MinhaGrana agora possui um sistema de edição integrado que permite modificar textos e conteúdos diretamente na página, sem necessidade de editar o código HTML.

## Como Usar

### 1. Autenticação

**Credenciais de Acesso:**
- **Email**: `pablocosta.consultor@gmail.com`
- **Senha**: `pablocosta1q2w3e4r`

### 2. Ativar o Modo de Edição

- Clique no botão **✏️** no cabeçalho da página (ao lado do menu de navegação)
- Se não estiver autenticado, um modal de login será exibido
- Digite as credenciais de acesso e clique em "Entrar"
- O botão mudará para "Sair" quando o modo estiver ativo
- Todos os elementos editáveis serão destacados com uma borda tracejada verde

### 3. Editar Conteúdo

- Com o modo de edição ativo, clique em qualquer elemento destacado
- Um modal será aberto com campos para editar o título e conteúdo
- Faça suas alterações e clique em "Salvar"
- As mudanças serão aplicadas imediatamente na página

### 4. Elementos Editáveis

Os seguintes elementos podem ser editados:

- **Título Principal (Hero)**: "Controle financeiro simples, colaboração real"
- **Descrição Principal**: Texto explicativo sobre o MinhaGrana
- **Títulos de Seções**: "Por que o MinhaGrana?", "Como funciona", etc.
- **Descrições de Seções**: Textos explicativos de cada seção
- **Formulário de Contato**: Título e descrição da seção de interesse

### 5. Gerenciamento de Sessão

- **Duração da Sessão**: 30 minutos de inatividade
- **Auto-logout**: Sessão expira automaticamente após o tempo limite
- **Persistência**: Login mantido entre recarregamentos da página (dentro do prazo)
- **Segurança**: Dados de autenticação armazenados localmente com timestamp

### 6. Salvamento Automático

- Todas as edições são salvas automaticamente no navegador (localStorage)
- As alterações persistem entre sessões
- Para reverter às configurações originais, limpe o localStorage do navegador

## Funcionalidades Técnicas

### Sistema de Autenticação
- Verificação de credenciais local (email/senha)
- Armazenamento seguro de sessão com timestamp
- Auto-logout após 30 minutos de inatividade
- Chave de armazenamento: `minhagrana-auth`

### Sistema de Persistência
- Utiliza `localStorage` para salvar as edições
- Chave de armazenamento: `minhagrana-edit-data`
- Formato JSON com mapeamento de IDs para conteúdo

### Identificação de Elementos
- Cada elemento editável possui um `data-edit-id` único
- Sistema de classes CSS para destacar elementos editáveis
- Modo visual ativado via classe `edit-mode` no body

### Interface Responsiva
- Botão de edição adaptado para mobile
- Modal responsivo com campos de entrada
- Estilos otimizados para diferentes tamanhos de tela

## Estrutura dos Dados

```json
{
  "hero-title": "Novo título personalizado",
  "hero-description": "Nova descrição personalizada",
  "beneficios-title": "Título da seção benefícios",
  "beneficios-description": "Descrição da seção benefícios"
}
```

## Limitações

- Apenas elementos com classe `editable` podem ser editados
- Não é possível editar imagens ou elementos complexos
- As edições são locais (não sincronizam entre dispositivos)
- Requer JavaScript habilitado
- **Segurança**: Autenticação baseada em credenciais locais (não é um sistema de segurança robusto para produção)

## Desenvolvimento

### Adicionando Novos Elementos Editáveis

1. Adicione a classe `editable` ao elemento HTML
2. Adicione o atributo `data-edit-id` com um ID único
3. Adicione o atributo `data-edit-type="text"`

Exemplo:
```html
<h2 class="section-title editable" data-edit-type="text" data-edit-id="novo-titulo">
  Título Editável
</h2>
```

### Personalizando Estilos

Os estilos do modo de edição estão definidos no CSS interno da página:

- `.edit-mode-btn`: Estilo do botão de edição
- `.edit-mode .editable`: Estilo dos elementos editáveis
- `.edit-mode .editable:hover`: Efeito hover nos elementos editáveis

## Suporte

Para dúvidas ou problemas com o sistema de edição, verifique:

1. Se o JavaScript está habilitado
2. Se o localStorage está disponível
3. Se não há conflitos com outros scripts da página

---

**Versão**: 1.0  
**Data**: Dezembro 2024  
**Compatibilidade**: Navegadores modernos com suporte a ES6+
