document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme setting on initial load
  const savedTheme = localStorage.getItem('theme');
  const isDarkMode = savedTheme === 'dark';
  const elementsToToggle = document.querySelectorAll('body, .container, .history-container, .popup-content, input[type="text"], button');

  // Apply the dark mode class based on the saved setting
  elementsToToggle.forEach(el => {
      el.classList.toggle('dark-mode', isDarkMode);
  });

  // Set the checkbox state based on the saved theme
  document.getElementById('darkModeToggle').checked = isDarkMode;

  // Load the download history from localStorage
  loadHistory();
});


function downloadVideo() {
  const url = document.getElementById('video-url').value;
  if (url) {
      displayLoadingState(true);
      fetch(`/videoInfo?url=${encodeURIComponent(url)}`)
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  addToHistory(url);
                  showPopup(data.info);
              } else {
                  alert('Failed to fetch video info: ' + data.message);
              }
          })
          .catch(error => {
              console.error('Error:', error);
              alert('An error occurred while fetching video info.');
          })
          .finally(() => {
              displayLoadingState(false);
          });
  } else {
      alert('Please enter a valid YouTube URL.');
  }
}

function displayLoadingState(isLoading) {
  const button = document.querySelector('.container button');
  button.textContent = isLoading ? 'Loading...' : 'Download';
  button.disabled = isLoading;
}

function showPopup(videoInfo) {
  document.getElementById('videoThumbnail').src = videoInfo.thumbnail;
  document.getElementById('videoTitle').textContent = videoInfo.title;
  document.getElementById('videoAuthor').textContent = videoInfo.author.name;
  
  const selector = document.getElementById('resolutionSelector');
  selector.innerHTML = '';
  videoInfo.formats.forEach(format => {
      const option = document.createElement('option');
      option.value = format.itag;
      option.textContent = `${format.qualityLabel} - ${format.container}`;
      selector.appendChild(option);
  });
  document.getElementById('downloadPopup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('downloadPopup').style.display = 'none';
}

function fetchVideo() {
  const itag = document.getElementById('resolutionSelector').value;
  const url = document.getElementById('video-url').value;
  window.location.href = `/download?url=${encodeURIComponent(url)}&itag=${itag}`;
}

function toggleDarkMode() {
  const isChecked = document.getElementById('darkModeToggle').checked;
  const elementsToToggle = document.querySelectorAll('body, .container, .history-container, .popup-content, input[type="text"], button');

  // Save theme preference
  localStorage.setItem('theme', isChecked ? 'dark' : 'light');

  elementsToToggle.forEach(el => {
      el.classList.toggle('dark-mode', isChecked);
  });
}

function addToHistory(url) {
  const historyList = document.getElementById('downloadHistory');
  if (!historyList) return;

  const listItem = document.createElement('li');
  listItem.textContent = url;
  listItem.onclick = function() {
      document.getElementById('video-url').value = url;
      downloadVideo();
  };

  // Manage history size
  const existingItems = historyList.getElementsByTagName('li');
  if (existingItems.length >= 5) {
      historyList.removeChild(existingItems[0]);
  }
  historyList.appendChild(listItem);

  // Update localStorage with new history
  updateHistoryStorage();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
  history.forEach(url => addToHistory(url));
}

function updateHistoryStorage() {
  const historyList = document.querySelectorAll('#downloadHistory li');
  const history = Array.from(historyList).map(li => li.textContent);
  localStorage.setItem('downloadHistory', JSON.stringify(history));
}
