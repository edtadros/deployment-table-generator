document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('extract').addEventListener('click', extractData);
    document.getElementById('copy').addEventListener('click', copyToClipboard);
});

function extractData() {
    const queryUrl = document.getElementById('url').value;
    fetch(queryUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const tasks = doc.querySelectorAll('.phui-oi-table-row');
            let tableData = "== QA Results - Prod\n|**Verified**|**Task**|**Title**|**Test Results/Comments**|\n|--|--|--|--|\n";

            tasks.forEach(task => {
                const taskID = task.querySelector('.phui-oi-objname').textContent;
                const titleElement = task.querySelector('.phui-oi-name a');
                let taskTitle = titleElement.textContent;
                // Replace square brackets with parentheses
                taskTitle = taskTitle.replace(/\[/g, '(').replace(/\]/g, ')');
                const taskUrl = 'https://phabricator.wikimedia.org' + titleElement.getAttribute('href');
                tableData += `| ✅ ✔ ⬜ ❌ ❓ | ${taskID} | [[ ${taskUrl} | ${taskTitle} ]] | result |\n`;
            });

            document.getElementById('results').textContent = tableData;
        })
        .catch(err => {
            console.error('Error:', err);
            document.getElementById('results').textContent = 'Failed to fetch data. Please check the URL and try again.';
        });
}

function copyToClipboard() {
    const textToCopy = document.getElementById('results').textContent;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Text copied to clipboard!');
}
