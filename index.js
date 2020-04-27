(function() {
  let likesArray = [];
  const LOOP_COUNT = 100;
  const WEBSITE = "https://www.instagram.com";

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

    //     var str = date.getFullYear() + "-" + month + "-" + day + "_" +  hour + ":" + min + ":" + sec;

    var str = "Time - " + hour + ":" + min + ":" + sec;

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
       * and you may want to customize it to your needs
       */
      var result =
        b[property] < a[property] ? -1 : b[property] > a[property] ? 1 : 0;
      return result * sortOrder;
    };
  }
  function grabLikes() {
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

        var canceled = !locaterHandle.dispatchEvent(event);
      }
    }

    function getValuesFromCards() {
      var anchors = document.querySelectorAll(
        "main > div > div._2z6nI > article > div:nth-child(1) > div div div > a"
      );

      for (i = 0; i < anchors.length; i++) {
        let hrefValue = anchors[i].getAttribute("href");
        let likeCount = anchors[i].querySelector(".qn-0x li:first-child");

        let value = likeCount.innerText;

        // remove whitespace
        value = value.replace(/ /g, "");
        value = value.replace(/,/g, "");

        if (value.indexOf("k") > 0) {
          value = value.replace(/k/g, "");
          value = parseFloat(value) * 1000;
        }

        //         console.log(value)
        likesArray.push({
          href: WEBSITE + hrefValue,
          likes: parseInt(value)
        });
      }
    }

    simulateMouseover();

    getValuesFromCards();

    likesArray.sort(dynamicSort("likes"));
  }

  // console.clear();

  console.log(getFormattedDate());

  async function scrollToBottom() {
    return new Promise((resolve, reject) => {
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(() => resolve(), 2000);
    });
  }

  async function main() {
    for (let j = 0; j < LOOP_COUNT; j++) {
      grabLikes();
      await scrollToBottom();
    }
  }

  (async function() {
    try {
      console.clear();
      await main();
    } catch (e) {
    } finally {
      const output = removeDuplicates(likesArray);
      console.log(JSON.stringify(output, null, "\t"));
    }
  })();
})();
