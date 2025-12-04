(function(){
  const QUICK_OPTIONS = [
    { label: "Sou paciente", value: "paciente" },
    { label: "Sou enfermeiro", value: "enfermeiro" },
    { label: "Sou administrador", value: "admin" }
  ];

  const ROLE_RESPONSES = {
    paciente:
      "Que bom ter você aqui! Para cadastrar vagas, vá até 'Registrar vaga' e preencha o formulário contando o contexto do paciente. Depois, acompanhe os profissionais interessados em 'Vagas públicas'.",
    enfermeiro:
      "Bem-vindo! Reforce que seu perfil está completo e visite o painel do enfermeiro para ver indicadores e vagas recomendadas. Use 'Vagas públicas' ou seu painel para simular candidaturas.",
    admin:
      "Para acessar o painel administrativo, utilize o token único 0781 no login e será direcionado ao monitoramento. Lá você mostra indicadores, alertas e o checklist de conformidade do MVP."
  };

  function createElement(tag, className, text){
    const el = document.createElement(tag);
    if(className) el.className = className;
    if(text) el.textContent = text;
    return el;
  }

  function initChatbot(){
    if(document.querySelector(".chatbot-toggle")) return;

    const toggle = createElement("button","chatbot-toggle","Assistente");
    const windowEl = createElement("div","chatbot-window");
    const header = createElement("div","chatbot-header","Assistente IT.Nursing");
    const body = createElement("div","chatbot-body");
    const inputWrap = createElement("div","chatbot-input");
    const input = createElement("textarea");
    input.placeholder = "Digite sua pergunta";
    const sendBtn = createElement("button","btn btn-primary","Enviar");

    inputWrap.append(input, sendBtn);
    windowEl.append(header, body, inputWrap);
    document.body.append(toggle, windowEl);

    toggle.addEventListener("click", () => {
      windowEl.classList.toggle("open");
      toggle.classList.toggle("open");
      if(windowEl.classList.contains("open")) input.focus();
    });

    function addMessage(sender,text){
      const msg = createElement("div",`chatbot-msg ${sender}`);
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function renderQuickOptions(){
      const wrapper = createElement("div","chatbot-quick-options");
      QUICK_OPTIONS.forEach(opt => {
        const btn = createElement("button","btn btn-secondary",opt.label);
        btn.addEventListener("click",()=>handleMessage(opt.value));
        wrapper.appendChild(btn);
      });
      body.appendChild(wrapper);
      body.scrollTop = body.scrollHeight;
    }

    function handleMessage(value){
      const text = value || input.value.trim();
      if(!text) return;
      addMessage("user",text);
      input.value = "";
      const normalized = text.toLowerCase();
      const roleKey = Object.keys(ROLE_RESPONSES).find(role => normalized.includes(role));
      if(roleKey){
        addMessage("bot",ROLE_RESPONSES[roleKey]);
        addMessage("bot","Posso ajudar em algo mais? Diga seu perfil novamente ou descreva sua dúvida.");
        renderQuickOptions();
        return;
      }
      if(normalized.includes("vaga")){
        addMessage("bot","Para cadastrar novas oportunidades, acesse a tela 'Registrar vaga'. L� voc� mostra como o paciente descreve o contexto.");
        return;
      }
      if(normalized.includes("login") || normalized.includes("token")){
        addMessage("bot","Pacientes e enfermeiros usam e-mail + senha. Para administradores basta informar o token 0781 no bloco de acesso administrativo da tela inicial.");
        return;
      }
      addMessage("bot","Não entendi. Você é paciente, enfermeiro ou administrador? Posso te guiar com base nisso.");
      renderQuickOptions();
    }

    sendBtn.addEventListener("click", ()=>handleMessage());
    input.addEventListener("keydown", e => {
      if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        handleMessage();
      }
    });

    addMessage("bot","Olá! Sou o assistente do MVP IT.Nursing. Você é paciente, enfermeiro ou administrador?");
    renderQuickOptions();
  }

  document.addEventListener("DOMContentLoaded", initChatbot);
})();
