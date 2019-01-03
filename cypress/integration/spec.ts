import { TheiaCommands } from "../elements/theia-commands";

/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/


context('Wait and open prject file', () => {
  before(() => {
    cy.visit('http://localhost:3000');
    // maybe it's possible to wait for an element being displayed/hidden

  })



  // 
  it('Wait project with file and open', () => {
    cy.get('div#theia-app-shell', { timeout: 12000 });
    cy.theiaInvokeCommandFromMenu(TheiaCommands.VIEW, TheiaCommands.FIND_COMMAND);
    cy.get('div.monaco-inputbox>div.wrapper>input.input').type('git clone').then(() => {
      cy.get('div.quick-open-tree span.monaco-highlighted-label').contains('Git:').click();
    });
  })
});



