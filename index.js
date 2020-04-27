(function() {
  let likesArray = [];
  const LOOP_COUNT = 20;

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

    /* alert(str); */

    return str;
  }

  function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b);
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

    function callback() {
      var divs = document.querySelectorAll(".qn-0x li:first-child");

      for (i = 0; i < divs.length; i++) {
        let value = divs[i].innerText;

        // remove whitespace
        value = value.replace(/ /g, "");
        value = value.replace(/,/g, "");

        if (value.indexOf("k") > 0) {
          value = value.replace(/k/g, "");
          value = parseFloat(value) * 1000;
        }

        //         console.log(value)
        likesArray.push(parseInt(value));
      }
    }

    simulateMouseover();

    callback();

    likesArray.sort(function(a, b) {
      return b - a;
    });
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
    console.clear();
    await main();
    console.log(JSON.stringify(removeDuplicates(likesArray), null, "\t"));
  })();
})();
