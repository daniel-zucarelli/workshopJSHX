
const To = require('await-to-js');
const to = To.to;

const IMPLICIT_WAIT = 120;
const isHTMLIdRegex = /^#[\d\w-@.\\/#&'´+^~\(\)\[\]]*$/;
const isHTMLNameRegex = /^[^#][\d\w-@.\\/&#'´+^~\(\)\[\]]*$/;

function Helpers() {

}

Helpers.prototype.constructor = Helpers;

Helpers.prototype.getElement = async function(locator){
    return await this.WaitForElementPresent(locator);
}

Helpers.prototype.WaitForElementPresent = async function(locator, waitLimit = IMPLICIT_WAIT){
    [err, byType] = this.getLocatorType(locator);
    console.log("<<<  " + locator + "  >>>" + " ====>> " + byType[1]);
    let complete_locator = byType[0](locator);
    let elementToSearch = await element( complete_locator );
    await browser.wait( ExpectedConditions.elementToBeClickable( elementToSearch ), waitLimit * 1000, "ELEMENT NOT FOUND WITH LOCATOR: << " + locator + " >>" );
    return elementToSearch;
}

Helpers.prototype.WaitForElementNotPresent = async function(locator, waitLimit = IMPLICIT_WAIT){
  var byType = await this.getLocatorType(locator);
  var searchElement = await byType(locator);
  await browser.wait( ExpectedConditions.not( ExpectedConditions.elementToBeClickable( element( searchElement ) ), waitLimit * 1000  ));
  return await searchElement;
}

Helpers.prototype.isElementPresent = async function(locator){
  var foundElement = await element(await this.WaitForElementPresent(locator));
  if (await foundElement.isPresent() ){
    return true;
  }
  else{
    return false;
  }
}

Helpers.prototype.hoverOver = async function(locator){
  var element = await this.getElement(locator);
  browser.actions().mouseMove(element).perform();
}

Helpers.prototype.clickAndRetry = async function(locator, times = 4){
  let _element = await this.getElement(locator);
  await browser.wait(ExpectedConditions.not(ExpectedConditions.visibilityOf(browser.element(by.css("div[class='loadingView messageDialog']"))), 10)).catch(e => console.log("no loading"));
  await browser.wait(ExpectedConditions.not(ExpectedConditions.visibilityOf(browser.element(by.css("div[class='popup-body ']"))), 10)).catch(e => console.log("no pop-budy"));
  await browser.wait(ExpectedConditions.not(ExpectedConditions.visibilityOf(browser.element(by.id("fancybox-overlay"))), 10)).catch(e => console.log("no fancybox-overlay"));
  return await _element.click();
}

Helpers.prototype.wait = function wait(seconds) {
  return new Promise(resolve => setTimeout(() => resolve(), seconds * 1000 ));
}

Helpers.prototype.isId = function(locator){
  return isHTMLIdRegex.test(locator);
}

Helpers.prototype.isName = function(locator){
  return isHTMLNameRegex.test(locator);
}

Helpers.prototype.isCSS = function(locator){
    try {
        window.document.activeElement.matches( locator );
        return [null, true, " >>> IS CSS LOCATOR", locator];
    }
    catch( err ) {
      console.log(err.name + " :: " + err.message);
      return [err, false, "Error in parsing CSS: " + err, locator];
    }
  }

Helpers.prototype.isXPath = function(locator){
    try {
        let xPathResult = window.document.evaluate(locator, document, null, 0, null);
        let is_xpath = false;

        if (xPathResult){
          is_xpath = true;
        }
        return [null, is_xpath, " >>> IS XPATH LOCATOR", locator ];
    }
    catch( err ) {
      console.log(err.name + " :: " + err.message);
      return [err, false, "Error in parsing XPath: " + err, locator];
    }
  }

Helpers.prototype.getLocatorType = function(locator){
  try {
    let by_type;
    let available_locators = {id:false, name:false, css:false, xpath:false};

    available_locators.id = this.isId(locator);
    available_locators.name = this.isName(locator);
    available_locators.css = this.isCSS(locator)[1];
    available_locators.xpath = this.isXPath(locator)[1];

    for (available_locator in available_locators) {
      if(available_locators[available_locator] == true){
        let instructions = "return [By." + available_locator + ", ' IS " + available_locator.toUpperCase() + " LOCATOR']";
        let build_locator = new Function(instructions);
        by_type = build_locator();
        break;
      }
    }
    return [null, by_type];
  } catch (err) {
    // console.log("ERROR OCCURRED: " + err);
    return [err, null];
  }
}


module.exports = new Helpers();
