/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

//click on top nenu with  @topCommandName command and then click on @subCommandName in the opened command list
Cypress.Commands.add('theiaInvokeCommandFromMenu', (topCommandName: string, subCommandName: string) => {
  cy.get('div.p-MenuBar-itemLabel').contains(topCommandName).click().then(() => {
    cy.get('div.p-Menu-itemLabel').contains(subCommandName).trigger('mousemove').click();
  });
});

//click an item in Theia project tree by asolute path to item 
Cypress.Commands.add('openItemByPathInProjectTree', (pathToItem: string) => {
  cy.get(`div.theia-TreeNode[title="${pathToItem}"]`).click();
});

//click on item on left Theia tab bar
Cypress.Commands.add('openLeftTabBarItemByName', (tabBarItemName: string) => {
  cy.get(`ul.p-TabBar-content>li[title='${tabBarItemName}'][style~='height:']`).click();
});

// see more example of adding custom commands to Cypress TS interface
// in https://github.com/cypress-io/add-cypress-custom-command-in-typescript
// add new command to the existing Cypress interface
// tslint:disable-next-line no-namespace
declare namespace Cypress {
  // tslint:disable-next-line interface-name
  interface Chainable {
    theiaInvokeCommandFromMenu: (topCommandName: string, subCommandName: string) => void
    openItemByPathInProjectTree: (pathToItem: string) => void
    openLeftTabBarItemByName: (tabBarItemName: string) => void
  }
}

