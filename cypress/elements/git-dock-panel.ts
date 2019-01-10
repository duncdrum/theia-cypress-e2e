export class GitDockPanelPageObject {
    private static readonly COMMIT_BUTTON_SELECTOR: string = "button.theia-button[title='Commit all the staged changes']";
    private static readonly GIT_TAB_BAR_BUTTON: string = "button.theia-button[title='Commit all the staged changes']";
    private static readonly STAGE_ALL_CHANGES_BUTTON: string = "a.toolbar-button[title='Stage All Changes']";
    private static readonly UNSTAGED_CHANGES_HEADER: string = "div#unstagedChanges>div";
    private static readonly GIT_COMMIT_MESSAGE_TEXT_AREA :string ="div.theia-git-commit-message-container>textarea";

    // command bur buutons of Theia git widget
    public static readonly COMMAND_BAR_BUTTON_REFRESH = 'Refresh';
    public static readonly COMMAND_BAR_BUTTON_ADD_SIGNED_OFF_BY = 'Add Signed-off-by';
    public static readonly COMMAND_BAR_BUTTON_MORE = 'More...';

    // More ... menu items
    public static readonly GIT_MORE_MENU_COMMIT_SIGNED_OFF_ITEM = 'git.commit.signOff';
    public static readonly GIT_MORE_MENU_PUSH_ITEM = 'git.push';

    //get commit button from Theie git commit widget as cy object
    getCommitButton() {
        return cy.get(GitDockPanelPageObject.COMMIT_BUTTON_SELECTOR);
    }

    clickOnStageAllChanges() {
        //need force click because: https://github.com/cypress-io/cypress/issues/1485
        cy.get(GitDockPanelPageObject.STAGE_ALL_CHANGES_BUTTON).click({ force: true });
    }

    clickOnCommandBarButton(buttonName: string) {
        cy.get(`div#commandBar a[title='${buttonName}']`).click();
    }

    clickOnMoreItemAndSelecItem(item: string) {
        this.clickOnCommandBarButton(GitDockPanelPageObject.COMMAND_BAR_BUTTON_MORE);
        cy.get(`li[data-command='${item}']>div.p-Menu-itemLabel`).trigger('mousemove');
        cy.get(`li.p-mod-active[data-command='${item}']`).click();
    }

    typeCommitMessage(commitMess: string){
        cy.get(GitDockPanelPageObject.GIT_COMMIT_MESSAGE_TEXT_AREA).type(commitMess);
    }

}

