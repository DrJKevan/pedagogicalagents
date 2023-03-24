document.getElementById('submit-prompt').addEventListener('click', function() {
    const chatInput = document.getElementById('chat-input').value;
    if (chatInput.trim() === '') {
        alert('Please enter a prompt for ChatGPT.');
        return;
    }

    document.getElementById('loading-indicator').style.display = 'flex';

    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: chatInput }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('chat-output').value = data.response;
        document.getElementById('loading-indicator').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading-indicator').style.display = 'none';
        alert('An error occurred while processing the request.');
    });
});

document.getElementById("image-submit").addEventListener("click", async () => {
  const imagePrompt = document.getElementById("image-prompt").value;
  if (!imagePrompt) {
    alert("Please enter a prompt for the image.");
    return;
  }
  
  // Show the loader and hide previous results
  document.getElementById("image-loader").style.display = "block";
  document.getElementById("image-results").innerHTML = "";

  fetch('/api/dalle', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: imagePrompt }),
  })
  .then(response => response.json())
  .then(data => {
    displayImageResults(data.image_urls);
    document.getElementById('image-loader').style.display = 'none';
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('image-loader').style.display = 'none';
    alert('An error occurred while processing the request.');
  });
}); // Add closing brace here

function displayImageResults(imageUrls) {
  const imageContainer = document.getElementById("image-results");
  imageContainer.innerHTML = "";

  imageUrls.forEach((url, index) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    const image = document.createElement("img");
    image.src = url;
    image.classList.add("generated-image");
    imageWrapper.appendChild(image);

    const selectButton = document.createElement("button");
    selectButton.textContent = "Select";
    selectButton.classList.add("select-button");
    selectButton.addEventListener("click", () => {
      selectGeneratedImage(index);
    });
    imageWrapper.appendChild(selectButton);

    imageContainer.appendChild(imageWrapper);
  });
}

function selectGeneratedImage(index) {
  const images = document.getElementsByClassName("generated-image");
  const selectedImage = images[index];
  selectImage(selectedImage);
}

function selectImage(selectedImage) {
  const imageResultsContainer = document.getElementById("image-results");
  imageResultsContainer.innerHTML = "";
  const img = document.createElement("img");
  img.src = selectedImage.src;
  img.addEventListener("click", () => {
    downloadImage(img.src, "generated-image");
  });
  imageResultsContainer.appendChild(img);
}

function downloadImage(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }
  