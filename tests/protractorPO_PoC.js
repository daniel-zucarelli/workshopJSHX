let assert = require("assert");

describe('Protractor in Javascript Workshop Hx QC', () => {

  it(' ####### Test de ejemplo ;) ####### ', async() => {
    console.log( ":::: Test Start!! ::::" );
    let searchBar = await helper.getElement("#top-menu-nav #top-menu a[href='https://www.ultimateqa.com/work-with-us/']");
    let actualLinkText = await searchBar.getText();
    let expectedLinkText = "Work with us";

    assert.equal(expectedLinkText, actualLinkText, "HAY UN BUG!!!!\nExpected link text :: " + expectedLinkText + "\nActual link text :: " + actualLinkText);
    console.log( ":::: Test Finished!! ::::" );
  });

});
