// Код сборки финальной закладки
const fullBookmarkletCode = "(function(){" + window.p1 + window.p2 + "window.updateGame();})();";
const dragBtn = document.getElementById("drag-btn");
if(dragBtn){
    dragBtn.href = "javascript:" + encodeURIComponent(fullBookmarkletCode);
    dragBtn.innerText = "🚀 КИБЕР-ОТРЯД: СТИКМЕН В ЗАКЛАДКУ";
}
