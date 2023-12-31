const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const { readCert } = require('./utils');

function getGitHubToken() {
    const token = process.env.GH_TOKEN;
    if (!token) {
        throw new Error('Please set the GH_TOKEN environment variable.');
    }
    return token;
}

module.exports = async function uploadToGithub() {
    const octokit = new Octokit({
        auth: getGitHubToken(), // 请替换为你的个人访问令牌
    });
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
    const rootCrt = readCert('root.crt');
    const localhostCrt = readCert('localhost.crt');
    const localhostKey = readCert('localhost.key');
    console.log(rootCrt);
    console.log(localhostCrt);
    console.log(localhostKey);

    // 使用示例
    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        'certs/root.crt',
        'main',
        rootCrt
    );

    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        'certs/localhost.crt',
        'main',
        localhostCrt
    );

    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        'certs/localhost.key',
        'main',
        localhostKey
    );
};
