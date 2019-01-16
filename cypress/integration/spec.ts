/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

/**
 * 1. In this testcase is implemented next scenario:
 * Go ti the Theia IDE, clone predefined project with ssh link
 * (push opeeration by https link - has not worked yet)
 * 2. After clonning, open README.md file, edit it, commit and push
 * 3. Check changes on github side and reset changes
 */
import { TheiaCommands } from "../elements/theia-commands";
import { TheiaTabBarItems } from "../elements/theia-tab-bar-items";
import { GitDockPanelPageObject } from "../elements/git-dock-panel";



context('Clone project into Theia and commit project file', () => {
  // Set the path with env. varibles (see cypress.json file)
  const pathToClonedProject: string = Cypress.env('rootPath') + "/" + Cypress.env('projectName');
  const gitHubUrl: string = getGithubHttsLinkWithToken();
  const preffixPathToReadmeFile: string = "repos/maxura/simple-ts-module/readme?access_token="
  const gitHubReadMeFileApiUrl = Cypress.env('gitApiPreffix') + `/${preffixPathToReadmeFile}` + Cypress.env('authToken');
  const currentDateInMillisec = new Date().valueOf().toString();
  let gitSha: string;

  before(() => {
    // Go to the Theia IDE (the base url and workspase are set by env. varibles cypress.json file)
    cy.visit(Cypress.env('baseUrl') + "/#" + Cypress.env('rootPath'));
  })

  // Go  to the Theia IDE, clone project and check just cloned items
  it('Open predefined workspace and clone the test project', () => {
    // Demo of using Page Object pattern (we should deside which approach is better for us Cypress custom command or Page Object...)
    const gitDockerPanel = new GitDockPanelPageObject();

    const expectedItems = ['e2e', 'app.ts', 'app.js', 'index.html', 'package-lock.json'];
    cy.get('div#theia-app-shell', { timeout: 12000 });

    // demo of using Cypress custom commands
    cy.theiaInvokeCommandFromMenu(TheiaCommands.VIEW, TheiaCommands.FIND_COMMAND);

    cy.get('div.monaco-inputbox>div.wrapper>input.input').type('git clone').then(() => {
      cy.get('div.quick-open-tree span.monaco-highlighted-label').contains('Git:').click();
      cy.get('div.monaco-icon-label-description-container').should('contain', 'Please provide a Git repository location.');
      cy.get('div.monaco-inputbox>div.wrapper>input.input').type(gitHubUrl).type('{enter}');
      cy.openLeftTabBarItemByName(TheiaTabBarItems.FILES);
      cy.get('div.theia-TreeContainer').as('items')
      expectedItems.forEach(function (value) {
        cy.get('@items', { timeout: 5000 }).should('contain', value);
      });
      cy.get("ul.p-TabBar-content>li.p-TabBar-tab[title='Git'][style~='height:']").click();
      gitDockerPanel.getCommitButton().should('be.visible')
    })
  });

  // Open README.md file and add current date in milisec.
  it('Edit file in the editor', () => {
    cy.openLeftTabBarItemByName(TheiaTabBarItems.FILES);
    cy.openItemByPathInProjectTree(pathToClonedProject + "/README.md");
    // workaround for typing into monaco editor, we add contenteditable attribute 
    cy.get("div.view-lines[role='presentation'] div.view-line>span").first().then(function ($input) {
      $input[0].setAttribute('contenteditable', '')
    }).type(currentDateInMillisec, { force: true });
  });

  // Add to index, commit, push changes. Check the changes on GitHub side by Github API
  it('Commit changes to github side', () => {

    let gitDockerPanel = new GitDockPanelPageObject();

    cy.get('div#theia-app-shell', { timeout: 12000 });
    cy.openLeftTabBarItemByName(TheiaTabBarItems.GIT);
    gitDockerPanel.clickOnStageAllChanges();
    gitDockerPanel.typeCommitMessage(currentDateInMillisec);
    gitDockerPanel.clickOnMoreItemAndSelecItem(GitDockPanelPageObject.GIT_MORE_MENU_COMMIT_SIGNED_OFF_ITEM);
    gitDockerPanel.clickOnMoreItemAndSelecItem(GitDockPanelPageObject.GIT_MORE_MENU_PUSH_ITEM);
    cy.get('div.monaco-inputbox>div.wrapper>input.input').type('origin').type('{enter}');
    
    // wait for pushing on Github side if network to slowly
    cy.wait(10000);
    cy.request('GET', gitHubReadMeFileApiUrl).
      then((resp) => {
        expect(atob(resp.body.content).toString()).to.include(currentDateInMillisec);
      });
  });

  after(() => {
    // remove cloned project on a file system
    cy.exec('rm -rf ' + pathToClonedProject);
    
    // reset content in changed file after testing
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
  })
});


// auxiliary function for getting github url for clonning and pushing
function getGithubHttsLinkWithToken(): string {
  const protocolWithOwner = "https://maxura:";
  return `${protocolWithOwner}` +
    Cypress.env('authToken') + "@github.com/" +
    Cypress.env('githubOwnerPreffix') + "/" +
    Cypress.env('gitHubTestRepo');
}
// auxiliary function for getting github API url for updating content
function getGitHubUrlForUpdatingContent() {
  return Cypress.env('gitApiPreffix') + "/repos/" +
    Cypress.env('githubOwnerPreffix') + "/" +
    Cypress.env('gitHubTestRepo') + "/contents/" + "README.md?access_token=" +
    Cypress.env('authToken')
}