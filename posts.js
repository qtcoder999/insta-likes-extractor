(function() {
	let likesArray = [];
	const WEBSITE = "https://www.instagram.com";
	const watchedElement = document.querySelector("article.ySN3v");
	const DEBOUNCED_RATE = 4000;
	const DEBOUNCED_EXCEPTION_RATE = 10000;
	let disconnect = false;
	let CSS_Selectors = {
		pageTitle: "#react-root > section > main > div > header > section > div.nZSzR > h2",
		pageType: "posts",
		route: "/",
		row: "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div div.Nnq7C.weEfm",
		column: "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(¬) > div:nth-child(¬) > a > div.eLAPa",
		anchors: "main > div > div._2z6nI > article > div:nth-child(1) > div div div > a",
		likeCount: ".qn-0x li:first-child",
		commentCount: ".qn-0x li:nth-child(2)",
		postType: "div.u7YqG"
	};

	function debounce(n, t, u) {
		var e;
		return function() {
			var i = this,
				o = arguments;
			clearTimeout(e),
				e = setTimeout(function() {
					e = null,
						u || n.apply(i, o)
				}, t),
				u && !e && n.apply(i, o)
		}
	}
	const observeDOM = (function() {
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		return function(obj, callback) {
			if (!obj || !obj.nodeType === 1) return;
			// validation
			if (MutationObserver) {
				// define a new observer
				var obs = new MutationObserver(function(mutations, observer) {
					if (!disconnect) {
						callback(mutations);
					} else {
						observer.disconnect();
					}
				});
				obs.observe(obj, {
					childList: true,
					subtree: true
				});
			} else if (window.addEventListener && !disconnect) {
				obj.addEventListener("DOMNodeInserted", callback, false);
				obj.addEventListener("DOMNodeRemoved", callback, false);
			} else {
				obj.removeEventListener("DOMNodeInserted", callback, false);
				obj.removeEventListener("DOMNodeRemoved", callback, false);
			}
		};
	})();

	function getFormattedDate() {
		var e = new Date,
			t = e.getMonth() + 1,
			a = e.getDate(),
			g = e.getHours(),
			n = e.getMinutes(),
			r = e.getSeconds();
		return g = (g < 10 ? "0" : "") + g,
			n = (n < 10 ? "0" : "") + n,
			r = (r < 10 ? "0" : "") + r, (a = (a < 10 ? "0" : "") + a) + "-" + (t = (t < 10 ? "0" : "") + t) + "-" + e.getFullYear() + "_" + g + ":" + n + ":" + r
	}

	function removeDuplicates(n) {
		return n.filter((i, r) => {
			const t = JSON.stringify(i);
			return r === n.findIndex(n => JSON.stringify(n) === t)
		})
	}

	function dynamicSort(n) {
		var r = 1;
		return "-" === n[0] && (r = -1, n = n.substr(1)),
			function(t, u) {
				return (u[n] < t[n] ? -1 : u[n] > t[n] ? 1 : 0) * r
			}
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
		} else if (value.indexOf("b") > 0) {
			value = value.replace(/b/g, "");
			value = parseFloat(value) * 1000000000;
		}
		return value;
	}

	function stopExecutionOnTooMuchDelay() {
		throw new Error('Request Timeout');
	}
	const debouncedStopExecution = debounce(stopExecutionOnTooMuchDelay, DEBOUNCED_EXCEPTION_RATE);
	async function grabLikes() {
		function simulateMouseover() {
			let i = 0;
			const rowlength = document.querySelectorAll(CSS_Selectors.row).length;
			for (i = 0; i < rowlength * 3; i++) {
				var event = new MouseEvent("mouseover", {
					"view": window,
					"bubbles": true,
					"cancelable": true
				});
				const rowNumber = parseInt(i / 3) + 1;
				const columnNumber = (i % 3) + 1;
				let columnSelector = CSS_Selectors.column.split("¬");
				columnSelector = columnSelector[0] + rowNumber + columnSelector[1] + columnNumber + columnSelector[2];
				var locaterHandle = document.querySelector(columnSelector);
				if (locaterHandle) var canceled = !locaterHandle.dispatchEvent(event);
			}
		}

		function getValuesFromCards() {
			var anchors = document.querySelectorAll(CSS_Selectors.anchors);
			for (i = 0; i < anchors.length; i++) {
				let hrefValue = anchors[i].getAttribute("href");
				let likeCount = anchors[i].querySelector(CSS_Selectors.likeCount);
				let commentCount = anchors[i].querySelector(CSS_Selectors.commentCount);
				let postType = anchors[i].querySelector(CSS_Selectors.postType);
				if (postType != null && postType != undefined) {
					postType = "video";
				} else {
					postType = "photo";
				}
				if (likeCount != null && likeCount != undefined) {
					likeCount = likeCount.innerText;
					likeCount = convertToNumber(likeCount);
				} else {
					likeCount = null;
				}
				if (commentCount != null && commentCount != undefined) {
					commentCount = commentCount.innerText
					commentCount = convertToNumber(commentCount);
				} else {
					commentCount = null;
				}
				likesArray.push({
					href: WEBSITE + hrefValue,
					likeCount: parseInt(likeCount),
					commentCount: parseInt(commentCount),
					postType
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
	async function scrollToBottom() {
		return new Promise((resolve, reject) => {
			window.scrollTo(0, document.body.scrollHeight);
			setTimeout(() => resolve(), 2000);
		});
	}

	function getPageTitle() {
		return (((document.querySelector(CSS_Selectors.pageTitle).textContent) || "Result") + "_" + getFormattedDate() + ".csv")
	}
	debouncedStopExecution();
	observeDOM(watchedElement, async function(m) {
		debouncedStopExecution();
		await main();
	});

	function downloadFile(exportedFileName, csv) {
		var blob = new Blob([csv], {
			type: 'text/csv;charset=utf-8;'
		});
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, exportedFileName);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", exportedFileName);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	function convertToCSV(objArray) {
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		var str = '';
		// insert headers
		const headers = Object.keys(objArray[0]).join(',');
		str = headers + "\r\n";
		for (var i = 0; i < array.length; i++) {
			var line = '';
			for (var index in array[i]) {
				if (line != '') line += ','
				line += array[i][index];
			}
			str += line + '\r\n';
		}
		return str;
	}
	const printOutput = () => {
		disconnect = true;
		const output = removeDuplicates(likesArray);
		console.log(JSON.stringify(output, null, "\t"));
		const CSV = convertToCSV(output);
		downloadFile(getPageTitle(), CSV);
	}
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
				console.log("Timestamp - " + getFormattedDate());
				await main();
			} catch (e) {
				console.log(e);
				printOutput();
			} finally {
				debouncedPrintOutput();
			}
		})();
})();
