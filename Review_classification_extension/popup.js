// popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == 'updateComments') {
      var commentsArray = request.comments;
      // Hiển thị commentsArray trong div có id="commentsContainer"
      var commentsContainer = document.getElementById('commentsContainer');
      commentsContainer.textContent = commentsArray.join('\n');
    }
  }
);
