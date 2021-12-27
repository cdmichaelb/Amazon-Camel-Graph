// ==UserScript==
// @name           Amazon Camel Graph Revived/Fixed Again
// @version        2.0.0
// @description    Add CamelCamelCamel graph + link to Amazon product pages.
// @namespace      AmazonCamelGraph
// @include        https://*amazon.*/*
// @include        https://*.camelcamelcamel.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require        https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @grant          GM_xmlhttpRequest
// ==/UserScript==

var width = 600;
var height = 250;
var heightmod = 0.96; //don't edit this
var height2;
var chart = "amazon-new"; //Possible other values are "amazon", "new", "used", "new-used", & "amazon-new-used"

(function (doc) {
	// ASIN.0 in kindle store
	var asin = doc.getElementById("ASIN") || doc.getElementsByName("ASIN.0")[0];
	var productTitle = doc.getElementById("productTitle").innerHTML;

	var words = productTitle.split(" ");
	words = words.filter(function (e) {
		return e;
	});

	var wordCount = words.length;
	if (wordCount > 6) {
		heightmod = 0.9;
	}

	if (wordCount > 14) {
		heightmod = 0.85;

		if (wordCount > 24) {
			heightmod = 0.78;
		}
	}
	height2 = height * heightmod;

	if (asin) {
		asin = asin.value;
		history.replaceState(null, "", "/dp/" + asin + "/");
	}
})(document);

var arr = document.domain.split(".");
var country = arr[arr.length - 1];
if (country == "com") {
	country = "us";
}

var element = $(':input[id="ASIN"]');
var asin = $.trim(element.attr("value"));

if (asin == "") {
	element = $(':input[id="ASIN"]');
	asin = $.trim(element.attr("value"));
}

var link2 =
	"<a target='blank' href='https://" +
	country +
	".camelcamelcamel.com/product/" +
	asin +
	"'><div style=' height: " +
	height2 +
	"px;  width: " +
	width +
	"px;  background: url(https://charts.camelcamelcamel.com/" +
	country +
	"/" +
	asin +
	"/" +
	`${chart}.png?force=1&zero=0&w=${width}&h=${height}&desired=false&legend=1&ilt=1&tp=all&fo=0) no-repeat bottom;  background-size: 100% auto;'></div></a>`;
var camelurl = `https://${country}.camelcamelcamel.com/product/${asin}`;
var bootstrap = `<button type="button" class="btn btn-primary bg-dark text-light m-0 p-0" id="liveToastBtn">Price History</button>
<div class="p-0" style="position:relative;z-index: 15000">
  <div id="liveToast" class="toast translate-middle-x m-0 p-0" role="alert" aria-live="assertive" aria-atomic="true" style="position:absolute;z-index: 15000">
    <div class="toast-body m-0 p-0" style="position:float;z-index: 15000">
      ${link2}
    </div>
  </div>
</div>`;
var bootstrapScript = `
<script>var toastTrigger = document.getElementById('liveToastBtn')
var toastLiveExample = document.getElementById('liveToast')
if (toastTrigger) {
  toastTrigger.addEventListener('click', function () {
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
  });
    toastTrigger.addEventListener('mouseover', function () {
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
  });
  window.onload = function() {
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
  };
}</script>
`;

GM_xmlhttpRequest({
	method: "GET",
	url: camelurl,

	onload: function () {
		$("#corePrice_desktop").append(
			"<div id='camelcamelcamel' style='margin-top: 0px; margin-left: 0px'><div class='p-0 m-0' style='position:relative;z-index: 10'>" +
				bootstrap +
				"</div></div>"
		);
		$("body").append(bootstrapScript);
		$("head").prepend(
			`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" type="text/css" />` +
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
