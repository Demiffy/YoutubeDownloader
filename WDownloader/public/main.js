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

  elementsToToggle.forEach(el => {
      if (isChecked) {
          el.classList.add('dark-mode');
      } else {
          el.classList.remove('dark-mode');
      }
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
  historyList.appendChild(listItem);
}
