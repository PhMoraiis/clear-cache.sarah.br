// URL alvo para limpeza de cache
const urlClear = "https://www.youtube.com/";

// Cálculo para definir o período de 1 dia em milissegundos
const millisecondsPerDay = 1000 * 60 * 60 * 24;
const oneDayAgo = Date.now() - millisecondsPerDay;

// Opções de dados a serem limpos
const options = {
  cacheStorage: true,
  cookies: true,
  indexedDB: true,
  localStorage: true,
  serviceWorkers: true,
  webSQL: true,
};

// Armazena o ID da última aba onde o cache foi limpo
let lastClearedTabId = null;

// Listener para atualização de abas
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Verifica se a página foi completamente carregada e se a URL começa com a URL alvo
  if (changeInfo.status === "complete" && tab.url.startsWith(urlClear)) {
    // Evita limpar o cache repetidamente na mesma aba
    if (lastClearedTabId !== tabId) {
      // Remove os dados de navegação
      chrome.browsingData.remove(
        {
          since: oneDayAgo,
          origins: [urlClear],
        },
        options,
        function () {
          console.log("Cache limpo pela url");
          lastClearedTabId = tabId;

          // Recarrega a aba após limpar o cache
          chrome.tabs.reload(tabId, function () {
            console.log("Página recarregada depois de limpar o cache");
          });
        }
      );
    }
  }
});

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Verifica se a ação solicitada é para limpar o cache
  if (request.action === "clearCache") {
    // Remove os dados de navegação
    chrome.browsingData.remove(
      {
        since: oneDayAgo,
        origins: [urlClear],
      },
      options,
      function () {
        console.log("Cache limpo");
        sendResponse({ success: true });
      }
    );
    return true; // Indica que a resposta será assíncrona
  }
});
