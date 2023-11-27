const { Octokit } = require('@octokit/rest');
const fs = require('fs');

function getGitHubToken() {
    const token = process.env.GH_TOKEN;
    console.log('token', token);
    if (!token) {
        throw new Error('Please set the GH_TOKEN environment variable.');
    }
    return token;
}

const octokit = new Octokit({
    auth: getGitHubToken(), // 请替换为你的个人访问令牌
});

module.exports = async function saveAndDelete() {
    // 保存证书到本地
    async function uploadFileToGitHubRepo(
        owner,
        repo,
        filePath,
        branch,
        message
    ) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const contentEncoded = Buffer.from(fileContent).toString('base64');

        try {
            const response = await octokit.repos.createOrUpdateFileContents({
                owner: owner,
                repo: repo,
                path: filePath,
                message: message,
                content: contentEncoded,
                branch: branch,
            });
            console.log(
                'File uploaded to GitHub:',
                response.data.content.html_url
            );
        } catch (error) {
            console.error('Error uploading file to GitHub:', error.message);
        }
    }
    const rootCrt = fs.readFileSync('root.crt', 'utf-8');
    const localhostCrt = fs.readFileSync('localhost.pem', 'utf-8');
    const localhostKey = fs.readFileSync('localhost.key', 'utf-8');
    console.log(rootCrt);
    console.log(localhostCrt);
    console.log(localhostKey);

    // 使用示例
    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        'root.crt',
        'main',
        fs.readFileSync('root.crt', 'utf-8')
    );

    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        'localhost.pem',
        'main',
        fs.readFileSync('localhost.pem', 'utf-8')
    );

    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        'localhost.key',
        'main',
        fs.readFileSync('localhost.key', 'utf-8')
    );
};
