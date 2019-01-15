import { TheiaCommands } from "../elements/theia-commands";
import { TheiaTabBarItems } from "../elements/theia-tab-bar-items";
import { GitDockPanelPageObject } from "../elements/git-dock-panel";

context('Clone project into Theia and commit project file', () => {
    // Set the path with env. varibles (see cypress.json file)
    const pathToClonedProject: string = Cypress.env('rootPath') + "/" + Cypress.env('projectName');
    const gitHubUrl: string = Cypress.env('gitHubTestRepoUrl');
    const currentDateInMillisec = new Date().valueOf().toString();
    const preffixPathToReadmeFile: string = "repos/maxura/simple-ts-module/readme?access_token="
    const gitHubReadMeFileApiUrl = Cypress.env('gitApiPreffix') + `/${preffixPathToReadmeFile}` + Cypress.env('authToken')
    before(() => {

    })

    // Go  to the Theia IDE, clone project and check just cloned items
    it('Test resetting', () => {
        cy.request('GET', gitHubReadMeFileApiUrl).then(reguest => {
            const sha = reguest.body.sha.toString();
            const content = {
              message: "my commit message2",
              committer: {
                name: "John Doe",
                email: "maxuran@ukr.met"
              },
              content: "bXkgdXBkYXRlZCBmaWxlIGNvbnRlbnQ=",
              sha: sha
            }
            cy.request('PUT', getGitHubUrlForUpdatingContent(), content);
          });
    });
   
    function getGitHubUrlForUpdatingContent() {
        return Cypress.env('gitApiPreffix') + "/repos/" +
          Cypress.env('githubOwnerPreffix') + "/" +
          Cypress.env('gitHubTestRepo') + "/contents/" + "README.md?access_token=c3cf151538a138d594f585d76fffde07f338cbbc"
      }
});
