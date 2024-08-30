document.addEventListener("DOMContentLoaded", () => {
  const btnClearCache = document.getElementById("btnClearCache");

  if (btnClearCache) {
    btnClearCache.addEventListener("click", () => {
      let urlClear = "https://www.youtube.com/";
      if (chrome && chrome.browsingData) {
        const options = {
          cacheStorage: true,
          cookies: true,
          indexedDB: true,
          localStorage: true,
          serviceWorkers: true,
          webSQL: true,
        };
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const oneDayAgo = Date.now() - millisecondsPerDay;

        chrome.browsingData.remove(
          {
            since: oneDayAgo,
            origins: [urlClear],
          },
          options,
          function () {
            console.log("Cache limpo");
          }
        );

        // Recarregar a página depois de limpar o cache
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0]) {
              chrome.tabs.reload(tabs[0].id);
              console.log("Página recarregada depois de limpar o cache");
            }
          }
        );
      } else {
        console.error("API chrome.browsingData não está disponível");
      }
    });
  } else {
    console.error("O elemento com ID 'btnClearCache' não foi encontrado.");
  }
});
