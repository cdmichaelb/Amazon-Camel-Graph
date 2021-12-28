// ==UserScript==
// @name           Amazon Camel Graph Revived/Fixed Again
// @author         cdmichaelb
// @downloadURL    https://raw.githubusercontent.com/cdmichaelb/Amazon-Camel-Graph/main/camel3amazon.user.js
// @version        2.0.5
// @description    Add CamelCamelCamel graph + link to Amazon product pages.
// @namespace      AmazonCamelGraph
// @include        https://*amazon.*/*
// @include        https://*.camelcamelcamel.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @run-at document-end
// ==/UserScript==

var width = 600; // width of the graph
var height = 250; // height of the graph
var heightmod = 0.96; //don't edit this
var height2; //don't edit this
var chart = "amazon-new"; //Possible other values are "amazon", "new", "used", "new-used", & "amazon-new-used"

(function (doc) {
	// ASIN.0 in kindle store
	var asin = doc.getElementById("ASIN") || doc.getElementsByName("ASIN.0")[0];
	var productTitle = doc.getElementById("productTitle").innerHTML; // title of the product

	var words = productTitle.split(" "); // split the title into words
	words = words.filter(function (e) {
		// remove empty strings
		return e; // return true if the element is not empty
	});

	var wordCount = words.length; // number of words in the title
	if (wordCount > 6) {
		// if there are more than 6 words in the title
		heightmod = 0.9; // make the graph shorter
	}
	if (wordCount > 14) {
		// if there are more than 14 words in the title
		heightmod = 0.85; // make the graph shorter
	}
	if (wordCount > 24) {
		// if there are more than 24 words in the title
		heightmod = 0.78; // make the graph shorter
	}
	height2 = height * heightmod; // calculate the height of the graph

	if (asin) {
		asin = asin.value; // get the ASIN
		history.replaceState(null, "", "/dp/" + asin + "/"); // change the URL to the ASIN
	}
})(document); // run the function on the current page

var arr = document.domain.split("."); // split the domain into parts
var country = arr[arr.length - 1]; // get the last part of the domain
if (country == "com") {
	// if the country is US
	country = "us"; // set the country to US
}

var element = $(':input[id="ASIN"]'); // get the ASIN input
var asin = $.trim(element.attr("value")); // get the ASIN

if (asin == "") {
	// if the ASIN is empty
	element = $(':input[id="ASIN"]'); // get the ASIN input
	asin = $.trim(element.attr("value")); // get the ASIN
}

// Generate the link and graph
var link2 =
	"<a target='blank' href='https://" +
	country +
	".camelcamelcamel.com/product/" +
	asin +
	"'><div id='toasty-image' class='m-0 p-0'; z-index: 15000; style='position: absolute; height: " +
	height2 +
	"px;  width: " +
	width +
	"px;  background: url(https://charts.camelcamelcamel.com/" +
	country +
	"/" +
	asin +
	"/" +
	`${chart}.png?force=1&zero=0&w=${width}&h=${height}&desired=false&legend=1&ilt=1&tp=all&fo=0) no-repeat bottom;  background-size: 100% auto;'></div></a><div class="p-0 m-0" style="position: absolute;width: fit-content"><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close">X</button></div>`;
var camelurl = `https://${country}.camelcamelcamel.com/product/${asin}`; // create the CamelCamelCamel URL
// Generate the bootstrap divs
var bootstrap = `<button type="button" class="btn bg-dark text-light m-0 p-0" id="liveToastBtn">Price History</button>
<div class="p-0 m-0" style="position:relative;z-index: 15000">
  <div id="liveToast" class="toast translate-middle-x m-0 p-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute;width: fit-content;z-index: 15000">
    <div class="toast-body m-0 p-0" style="position: absolute;width: fit-content;z-index: 15000">
      ${link2}
    </div>
  </div>
</div>`;
// Bootstrap Script
var bootstrapScript = `
<script>var toastTrigger = document.getElementById('liveToastBtn') // get the button
var toastGraph = document.getElementById('liveToast') // get the toast
var toastImage = document.getElementById('toasty-image') // get the image
if (toastTrigger) { // if the button exists

  toastTrigger.addEventListener('click', function () { // add event listener to the button
    var toast = new bootstrap.Toast(toastGraph)
    toast.show() // show the toast
  });
  toastTrigger.addEventListener('mouseover', function () { // show the toast on mouseover
    var toast = new bootstrap.Toast(toastGraph)
    toast.show() // show the toast
  });
  window.onload = function() { // when the page loads
    var toast = new bootstrap.Toast(toastGraph)
    toast.show() // show the toast
};
}</script>
`;

GM_xmlhttpRequest({
	method: "GET",
	url: camelurl,

	onload: function () {
		// when the page is loaded
		$("body").prepend(
			// add the bootstrap divs
			"<div id='camelcamelcamel' class='p-0 m-0' style='margin-top: 0px; margin-left: 0px'><div class='p-0 m-0' style='position:absolute;top:150px;left:55vw;z-index: 15000'>" +
				bootstrap +
				"</div></div>"
		);
		$("body").append(bootstrapScript); // add the bootstrap script
		$("head").prepend(
			// add the custom bootstrap styles
			`<link rel="stylesheet" href="https://cdmichaelb.github.io/css/c3a.css" type="text/css" />`
		);
		$("head").append(
			// add the bootstrap script
			`<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>`
		);
	},
});

function thisCodeProduct() {
	var url = decodeURI(location.href);
	var pattern =
		"https://([a-z]{0,2}).?camelcamelcamel.com/(.*)/product/B([A-Z0-9]{9}).*";
	var exp = new RegExp(pattern, "gi");
	return url.replace(exp, "$3");
}

var url = decodeURI(location.href);
var pattern = "https://([a-z]{0,2}).?camelcamelcamel.com/.*";
var exp = new RegExp(pattern, "gi");
var code = url.replace(exp, "$1");

if (code == "") code = "com";
else if (code == "uk") code = "co.uk";

$(document).ready(function () {
	var links = document.evaluate(
		"//a[contains(@href, 'camelcamelcamel.com')]",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	for (var i = 0; i < links.snapshotLength; i++) {
		var link = links.snapshotItem(i);
		if (link.title == "View the product page at Amazon") {
			link.removeAttribute("onclick");
			link.href =
				"https://www.amazon." + code + "/dp/B" + thisCodeProduct() + "/";
		}
	}
});
