function showpage(tabId) {
    // Oculta todos os conteúdos
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.remove('active');
    });
  
    // Mostra o conteúdo da aba selecionada
    document.getElementById(tabId).classList.add('active');
  }