/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { TheiaCommands } from "../elements/theia-commands";
import { TheiaTabBarItems } from "../elements/theia-tab-bar-items";
import { GitDockPanelPageObject } from "../elements/git-dock-panel";



context('Clone project into Theia and commit project file', () => {
  let pathToClonedProject: string = Cypress.env('rootPath') + "/" + Cypress.env('projectName');

  before(() => {
    cy.visit(Cypress.env('baseUrl') + "/#" + Cypress.env('rootPath'));
  })
  //first test body   
  it('Open predefined workspace and clone the test project', () => {
    let gitDockerPanel = new GitDockPanelPageObject();
    let expItems = ['e2e', 'app.ts', 'app.js', 'index.html', 'package-lock.json'];
    cy.get('div#theia-app-shell', { timeout: 12000 });
    cy.theiaInvokeCommandFromMenu(TheiaCommands.VIEW, TheiaCommands.FIND_COMMAND);
    cy.get('div.monaco-inputbox>div.wrapper>input.input').type('git clone').then(() => {
      cy.get('div.quick-open-tree span.monaco-highlighted-label').contains('Git:').click();
      cy.get('div.monaco-icon-label-description-container').should('contain', 'Please provide a Git repository location.');
      cy.get('div.monaco-inputbox>div.wrapper>input.input').type('git@github.com:maxura/simple-ts-module.git').type('{enter}');
      cy.openLeftTabBarItemByName(TheiaTabBarItems.FILES);
      cy.get('div.theia-TreeContainer').as('items');
      expItems.forEach(function (value) {
        cy.get('@items').should('contain', value);
      });
      cy.get("ul.p-TabBar-content>li.p-TabBar-tab[title='Git'][style~='height:']").click();
      gitDockerPanel.getCommitButton().should('be.visible')
    })
  });

  //second test body 
  it('Edit file in the editor', () => {
    cy.openLeftTabBarItemByName(TheiaTabBarItems.FILES);
    cy.openItemByPathInProjectTree(pathToClonedProject + "/README.md");
    cy.get("div.view-lines[role='presentation'] div.view-line>span").first().then(function ($input) {
      $input[0].setAttribute('contenteditable', '')
    }).type('dasfsfsdf', { force: true });
  });

  //third test body 
  it('Commit changes to github side', () => {
    
    let currentDateInMillisec = new Date().valueOf().toString();
    let gitDockerPanel = new GitDockPanelPageObject();
    cy.get('div#theia-app-shell', { timeout: 12000 });
    cy.openLeftTabBarItemByName(TheiaTabBarItems.GIT);
    gitDockerPanel.clickOnStageAllChanges();
    gitDockerPanel.typeCommitMessage(currentDateInMillisec);
    gitDockerPanel.clickOnMoreItemAndSelecItem(GitDockPanelPageObject.GIT_MORE_MENU_COMMIT_SIGNED_OFF_ITEM);
    gitDockerPanel.clickOnMoreItemAndSelecItem(GitDockPanelPageObject.GIT_MORE_MENU_PUSH_ITEM);
    cy.get('div.monaco-inputbox>div.wrapper>input.input').type('origin').type('{enter}');
   cy.request('GET', 'https://api.github.com/repos/maxura/simple-ts-module/readme').
      then((resp) => {
        expect(atob(resp.body.content).toString()).to.include('simple');
   });
  });


    after(() => {
      cy.exec('rm -rf ' + pathToClonedProject);
    })

  });
