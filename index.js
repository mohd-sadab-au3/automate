const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const nrc = require('node-run-cmd');
const git = require('simple-git/promise');
const cmd = require('node-command-line');
const open = require('open');
//for cloaning only first time call this then comment it ...


//opening the repo in the browser for merging 
let githubRepo = () => {

    //change according to yours repo just need to change /avinash-bhuyan-au4/ this part else same
    var repo_url = [
        'https://github.com/attainu/avinash-bhuyan-au4/tree/dev',

        'https://github.com/attainu/bipul-yadav-au4/tree/dev',

        'https://github.com/attainu/divya-chhabra-au4/tree/dev',

        'https://github.com/attainu/aayush-jain-au4/tree/dev',

        'https://github.com/attainu/varun-inapakurthi-au4/tree/dev',

        'https://github.com/attainu/faruk-munshi-au4/tree/dev',

        'https://github.com/attainu/gaurav-singh-au4/tree/dev',

        'https://github.com/attainu/rajeev-ranjan-au4/tree/dev',

        'https://github.com/attainu/Rishu-raj-au4/tree/dev',

        'https://github.com/attainu/vivek-pa-au4/tree/dev'

    ]
    repo_url.forEach(async (element) => {
        await open(element, { app: 'firefox' });
    });

};


async function status(workingDir) {
    console.log("=================")
    console.log(workingDir);
    console.log("=================")

    let statusSummary = null;
    try {

        statusSummary = await git(workingDir).pull('origin', 'dev');
    }
    catch (e) {
        // handle the error
        console.log(e);
    }

    return statusSummary;
}

async function repo_Clone(working_dir, user, pass, repo) {


    const remote = `https://${user}:${pass}@${repo}/`

    git(working_dir).silent(true)
        .clone(remote)
        .then(() => {
            console.log("finished clone")
        })
        .catch(error => console.log(error));

}

function cloneRepo(stud_repo) {
    stud_repo.forEach(async (repo_name) => {
        var temp = path.join(__dirname, '../' + repo_name);
        await fs.promises.mkdir('../' + repo_name, { recursive: true }).catch(error => console.log(error));
        process.chdir(temp)
        console.log("current dir", process.cwd());
        let user_name = 'repo_username_mentor';
        let pass = 'repo_password';
        let repo = `github.com/attainu/${repo_name}`;
        await repo_Clone(temp, user_name, pass, repo)
    });
}


//pulling from repo

function pullFromRepo(stud_repo) {
    for (let i = 0; i < stud_repo.length; i++) {
        var temp = path.join(__dirname, '../' + stud_repo[i] + '/' + stud_repo[i]);
        status(temp).then(status => {
            //console.log(statuif(s)
            // cmd.run(``);

            if (status) {
                let work_file = status.files;
                work_file.forEach(async file => {

                    let folder = file.split("/")[0];
                    console.log("file is", file);

                    let file_type = file.split(".")[file.split(".").length - 1];
                    console.log("file-type is ", file_type);
                    // nrc.run('ls');
                    if (file_type.toLowerCase() === 'html') {

                        //console.log(`files is ${temp}+${file}`);
                        await open(`${temp}/${file}`, { app: 'firefox' });

                    }

                    // console.log("file-type is ", file_type);
                    if (file_type.toLowerCase() === 'js') {

                        var filename = file.split("/")[file.split("/").length - 1];
                        console.log("JS files is", file);

                        file = stud_repo[i] + '/' + stud_repo[i] + '/' + file;

                        //we can run javascript code by putting that file inside automate(curr folder index.js) and rename thefile as repo and use that name here for running that file
                        console.log("------------------");
                        console.log("repo name ", stud_repo[i]);
                        await cmd.run(`node ${file}`);
                        console.log("------------------");
                    }


                })
            }
        });
    }
    githubRepo();
}
// using the async function

console.log('Starting directory: ' + process.cwd());
try {
    //change according to yours
    let stud_repo = ['avinash-bhuyan-au4', 'bipul-yadav-au4', 'divya-chhabra-au4', 'aayush-jain-au4', 'faruk-munshi-au4', 'gaurav-singh-au4', 'rajeev-ranjan-au4', 'Rishu-raj-au4', 'varun-inapakurthi-au4', 'vivek-pa-au4'];

    // let stud_repo = ['avinash-bhuyan-au4'];
    //uncomment this when first time cloaning occours 

    //cloneRepo(stud_repo)

    //this is commented when cloaning occours
    pullFromRepo(stud_repo)

}
catch (err) {
    console.log('chdir: ' + err);
}