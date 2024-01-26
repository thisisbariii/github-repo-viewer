let selectedRepoCount = 6; // Default value
let repos = []; // Declare repos as a global variable

function searchGithubUser() {
    const githubId = document.getElementById('githubIdInput').value;

    // Show loader while fetching user details
    showLoader();

    // Use the GitHub API to get user details
    fetch(`https://api.github.com/users/${githubId}`)
        .then(response => response.json())
        .then(data => {
            if (data.message && data.message.toLowerCase() === 'not found') {
                throw new Error('User not found');
            }

            // Update profile information
            document.getElementById('profileImage').src = data.avatar_url;
            document.getElementById('profileName').innerText = data.name || githubId;
            document.getElementById('githubLink').href = data.html_url;

            // Fetch user repositories
            fetch(`https://api.github.com/users/${githubId}/repos`)
                .then(response => response.json())
                .then(reposData => {
                    // Hide loader once repositories are fetched
                    hideLoader();
                    repos = reposData; // Update the global repos variable
                    updateRepos(repos);
                })
                .catch(error => {
                    console.error('Error fetching GitHub repositories:', error);

                    // Hide loader in case of an error
                    hideLoader();

                    // Show an alert for invalid username
                    if (error.message === 'User not found') {
                        alert('Invalid GitHub username. Please enter a valid username.');
                    }
                });
        })
        .catch(error => {
            console.error('Error fetching GitHub user data:', error);

            // Hide loader in case of an error
            hideLoader();

            // Show an alert for invalid username
            if (error.message === 'User not found') {
                alert('Invalid GitHub username. Please enter a valid username.');
            }
        });
}

function showLoader() {
    // Display loader (you can customize the loader display style)
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    // Hide loader
    document.getElementById('loader').style.display = 'none';
}

function updateRepos(repos) {
  const reposContainer = document.getElementById("reposContainer");
  const pagination = document.getElementById("pagination");

  // Clear existing content
  reposContainer.innerHTML = "";
  pagination.innerHTML = "";

  // Get the selected number from the dropdown
  selectedRepoCount = parseInt(
      document.getElementById("repoCountInput").value || 10, // Set default to 10 if not selected
      10
  );

  // Limit the selectedRepoCount to a maximum of 100
  selectedRepoCount = Math.min(selectedRepoCount, 100);

  // Paginate repositories
  const totalPages = Math.ceil(repos.length / selectedRepoCount);
  for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * selectedRepoCount;
      const end = start + selectedRepoCount;
      const reposPage = repos.slice(start, end);

      // Create a pagination button
      const pageButton = document.createElement("li");
      pageButton.className = "page-item";
      const pageLink = document.createElement("a");
      pageLink.className = "page-link";
      pageLink.href = "#";
      pageLink.innerText = page;
      pageLink.addEventListener("click", function () {
          displayRepos(reposPage);
      });
      pageButton.appendChild(pageLink);
      pagination.appendChild(pageButton);
  }

  // Display the first page of repositories
  displayRepos(repos.slice(0, selectedRepoCount));
}
function displayRepos(repos) {
    const reposContainer = document.getElementById("reposContainer");
    reposContainer.innerHTML = "";
  
    // Display repositories
    repos.forEach((repo) => {
      const repoBox = document.createElement("div");
      repoBox.className = "flex-box";
  
      // Display repository name
      const repoName = document.createElement("div");
      repoName.innerText = repo.name;
      repoBox.appendChild(repoName);
  
      // Display repository topics
      const repoTopics = document.createElement("div");
      repoTopics.innerText = `Topics: ${repo.topics.join(', ') || 'N/A'}`;
      repoBox.appendChild(repoTopics);
  
      // Add click event to redirect to the repository
      repoBox.addEventListener("click", function () {
        window.location.href = repo.html_url;
      });
  
      reposContainer.appendChild(repoBox);
    });
  
    // Update pagination after displaying repositories
    updatePagination();
  }
  
function updatePagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Paginate repositories
    const totalPages = Math.ceil(repos.length / selectedRepoCount);
    for (let page = 1; page <= totalPages; page++) {
        const start = (page - 1) * selectedRepoCount;
        const end = start + selectedRepoCount;
        const reposPage = repos.slice(start, end);

        // Create a pagination button
        const pageButton = document.createElement("li");
        pageButton.className = "page-item";
        const pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.href = "#";
        pageLink.innerText = page;
        pageLink.addEventListener("click", function () {
            displayRepos(reposPage);
        });
        pageButton.appendChild(pageLink);
        pagination.appendChild(pageButton);
    }
}

// Ensure this script is executed after the DOM content has loaded
document.addEventListener("DOMContentLoaded", function () {});
