// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  // Busca o botão de limpar cache pelo ID
  const btnClearCache = document.getElementById("btnClearCache");

  // Verifica se o botão foi encontrado
  if (btnClearCache) {
    // Adiciona um listener de clique ao botão
    btnClearCache.addEventListener("click", () => {
      // Envia uma mensagem para o script de background para limpar o cache
      chrome.runtime.sendMessage({ action: "clearCache" }, (response) => {
        // Verifica se a limpeza do cache foi bem-sucedida
        if (response && response.success) {
          console.log("Cache limpo com sucesso");

          // Busca a aba ativa na janela atual
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Verifica se existe uma aba ativa
            if (tabs[0]) {
              // Recarrega a aba ativa
              chrome.tabs.reload(tabs[0].id);
              console.log("Página recarregada depois de limpar o cache");
            }
          });
        } else {
          // Loga erro se a limpeza do cache falhar
          console.log("Falha ao limpar o cache");
        }
      });
    });
  } else {
    // Loga erro se o botão não for encontrado
    console.log("O elemento com ID 'btnClearCache' não foi encontrado.");
  }
});
