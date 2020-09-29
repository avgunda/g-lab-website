$(function () {
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("collapsable-nav").collapse('hide');
		}
	});

	$("#navbarToggle").click(function (event) {
		$(event.target).focus();
	});
});

(function (global) {
	var gl = {};
	var homeHtml = "snippets/home-snippet.html";
	var allProductsUrl = "data/products.json";
	var productTileHtml = "snippets/product-tile-snippet.html";
	var wipHtml = "snippets/wip-snippet.html";

	var insertHtml = function (selector, html) {
		var targetElement = document.querySelector(selector);
		targetElement.innerHTML = html;
	}
	
	var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='assets/images/loading/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	}

	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	}
	
	document.addEventListener("DOMContentLoaded", function (event) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			homeHtml, 
			function (responseText) {
				document.querySelector("#main-content").innerHTML = responseText;
			},
			false);
	});

	gl.loadWIP = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			wipHtml,
			function (responseText) {
				insertHtml("#main-content", responseText);
			},
			false);
	}

	gl.loadProducts = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			allProductsUrl,
			buildAndShowProductsHTML
		);
	}

	function buildAndShowProductsHTML (categories) {
		$ajaxUtils.sendGetRequest(
			productTileHtml,
			function (productTileHtml) {
				var productsViewHtml = buildProductsViewHtml(
					categories,
					productTileHtml);
				insertHtml("#main-content", productsViewHtml);
			},
			false);
	}

	function buildProductsViewHtml (categories, productTileHtml) {
		var finalHtml = '<h2 id="products-title" class="text-center">All Products</h2>';
		finalHtml += '<section class="row">';

		for (var i=0; i < categories.length; i++) {
			var html = productTileHtml;
			var name = "" + categories[i].name;
			html = insertProperty(html, "name", name);
			finalHtml += html;
		}

		finalHtml += '</section>';
		return finalHtml;
	}
	
	global.$gl = gl;

})(window);

