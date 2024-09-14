const GITHUB_API_URL = 'https://api.github.com';
const ORG_NAME = 'CodeDaitya';
const TAG_NAME = 'publish';

async function fetchRepositories() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/orgs/${ORG_NAME}/repos?type=public`);
        const repositories = await response.json();
        
        return repositories.message ? [] : repositories;
    } catch (error) {
        console.error(error);
    }
    
    return [];
}

async function fetchRepoTopics(repoName) {
    const response = await fetch(`${GITHUB_API_URL}/repos/${ORG_NAME}/${repoName}/topics`, {
        headers: {
            'Accept': 'application/vnd.github.mercy-preview+json'
        }
    });
    const data = await response.json();
    return data.names;
}

function createRepoCard(repo, ghPagesUrl) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.innerHTML = `
        <h2>${repo.name}</h2>
        <p>${repo.description || 'No description available.'}</p>
        <a href="${ghPagesUrl}" target="_blank">Visit Project</a>
    `;
    return card;
}

async function displayRepositories() {
    const repoList = document.getElementById('repo-list');
    const repositories = await fetchRepositories();
    let projectsCount = 0;

    for (const repo of repositories) {
        try {
            const topics = await fetchRepoTopics(repo.name);
            
            if (topics.includes(TAG_NAME)) {
                const ghPagesUrl = `https://${ORG_NAME}.github.io/${repo.name}`;
                const card = createRepoCard(repo, ghPagesUrl);
                repoList.appendChild(card);
                
                ++projectsCount;
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    if (!projectsCount) {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
            <h2>No published projects available</h2>
            <p>Either there are no published project at this time, or there was a problem fetching them</p>
        `;
        
        repoList.appendChild(card);
    }
}

displayRepositories();
