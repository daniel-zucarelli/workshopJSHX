let assert = require("assert");

describe('Protractor proof of concepts', () => {

  it('Can perform a single login and logout 02', async() => {
    let searchCriteria = "wikipedia";
    let expectedItemFound = "";

    console.log( ":::: Test Start!! ::::" );
    let searchBar = Helpers.getElement("");
    searchBar.sendKeys(searchCriteria);




    // assert.equal( actualUserName, expectedUserName, "WRONG USERNAME OR PASSWORD: Actual= " + actualUserName + " :::");
    // await userSettingsPage.logout();
    // actualSignInbuttonText = await websitePage.getSignInbuttonText();
    // assert.equal( actualSignInbuttonText, expectedSignInbuttonText, "WRONG BUTTON NAME!!!: Actual= " + actualUserName + " :::");
    console.log( ":::: Test Finished!! ::::" );
  });

});
