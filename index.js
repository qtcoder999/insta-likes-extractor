(function() {
  let likesArray = [];
  const WEBSITE = "https://www.instagram.com";
  const watchedElement = document.querySelector("article.ySN3v");
  const DEBOUNCED_RATE = 3000;

  function debounce(n,t,u){var e;return function(){var i=this,o=arguments;clearTimeout(e),e=setTimeout(function(){e=null,u||n.apply(i,o)},t),u&&!e&&n.apply(i,o)}}

  const observeDOM = (function() {
    var MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver;

    return function(obj, callback) {
      if (!obj || !obj.nodeType === 1) return;
      // validation

      if (MutationObserver) {
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer) {
          callback(mutations);
        });
        // have the observer observe foo for changes in children
        obs.observe(obj, {
          childList: true,
          subtree: true
        });
      } else if (window.addEventListener) {
        obj.addEventListener("DOMNodeInserted", callback, false);
        obj.addEventListener("DOMNodeRemoved", callback, false);
      }
    };
  })();

  function getFormattedDate() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str =
      "Timestamp - " +
      day +
      "-" +
      month +
      "-" +
      date.getFullYear() +
      "_" +
      hour +
      ":" +
      min +
      ":" +
      sec;

    //         var str = "Time - " + hour + ":" + min + ":" + sec;

    return str;
  }

  function removeDuplicates(arr) {
    const uniqueArray = arr.filter((thing, index) => {
      const _thing = JSON.stringify(thing);
      return (
        index ===
        arr.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
        })
      );
    });

    return uniqueArray;
  }
  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs */

      var result =
        b[property] < a[property] ? -1 : b[property] > a[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  function convertToNumber(value) {
    // remove whitespace
    value = value.replace(/ /g, "");
    value = value.replace(/,/g, "");

    if (value.indexOf("k") > 0) {
      value = value.replace(/k/g, "");
      value = parseFloat(value) * 1000;
    } else if (value.indexOf("m") > 0) {
      value = value.replace(/m/g, "");
      value = parseFloat(value) * 1000000;
    }
    return value;
  }

  async function grabLikes() {
    function simulateMouseover() {
      let i = 0;

      const rowlength = document.querySelectorAll(
        "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div div.Nnq7C.weEfm"
      ).length;

      for (i = 0; i < rowlength * 3; i++) {
        var event = new MouseEvent("mouseover", {
          "view": window,
          "bubbles": true,
          "cancelable": true
        });

        const rowNumber = parseInt(i / 3) + 1;
        const columnNumber = (i % 3) + 1;

        const cssSelector =
          "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(" +
          rowNumber +
          ") > div:nth-child(" +
          columnNumber +
          ") > a > div.eLAPa";
        var locaterHandle = document.querySelector(cssSelector);
        if (locaterHandle) var canceled = !locaterHandle.dispatchEvent(event);
      }
    }

    function getValuesFromCards() {
      var anchors = document.querySelectorAll(
        "main > div > div._2z6nI > article > div:nth-child(1) > div div div > a"
      );

      for (i = 0; i < anchors.length; i++) {
        let hrefValue = anchors[i].getAttribute("href");
        let likeCount = anchors[i].querySelector(".qn-0x li:first-child");
        let commentCount = anchors[i].querySelector(".qn-0x li:nth-child(2)");

        likeCount = likeCount.innerText;

        likeCount = convertToNumber(likeCount);

        commentCount = commentCount.innerText;

        commentCount = convertToNumber(commentCount);

        //         console.log(value)
        likesArray.push({
          href: WEBSITE + hrefValue,
          likeCount: parseInt(likeCount),
          commentCount: parseInt(commentCount)
        });
      }
    }
    return new Promise(resolve => {
      simulateMouseover();

      getValuesFromCards();

      likesArray.sort(dynamicSort("likeCount"));

      resolve();
    });
  }

  // console.clear();

  async function scrollToBottom() {
    return new Promise((resolve, reject) => {
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(() => resolve(), 2000);
    });
  }

  observeDOM(watchedElement, async function(m) {
    await main();
  });

  const printOutput = () => {
    const output = removeDuplicates(likesArray);
    console.log(JSON.stringify(output, null, "\t"));
  };

  const debouncedPrintOutput = debounce(printOutput, DEBOUNCED_RATE);

  async function main() {
    debouncedPrintOutput();
    await grabLikes();
    await scrollToBottom();
  }

  (async function() {
    try {
      console.clear();
      console.log(window.location.href);
      console.log(getFormattedDate());

      await main();
    } catch (e) {
      console.log(e);
    } finally {
      debouncedPrintOutput();
    }
  })();
})();
