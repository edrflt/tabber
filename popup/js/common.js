var api;
var	version;

/*
 * This function sets api var depending on browser (edge, chrome, firefox)
 */
function	set_api()
{
	if (typeof msBrowser !== 'undefined')
	{
		api = msBrowser;
	}
	else if (typeof chrome !== 'undefined')
	{
		api = chrome;
	}
	else if (typeof browser !== 'undefined')
	{
		api = browser;
	}
}

/*
 * This function checks if tabber is running a new version, and shows what's new if needed
 */
function	check_changelog()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		if (parseInt(version) > parseInt(data.last_version))
		{
			if (document.location.href.includes("sidebar"))
			{
				document.location.href = "../sidebar/changelog.html";
			}
			else
			{
				document.location.href = "../popup/changelog.html";
			}
		}
	});
}

/*
 * This function loads css depending on compact mode
 */
function	load_css()
{
	api.storage.sync.get(function(items)
	{
		var	data = {settings: {compact: false}};

		if (typeof items.data !== 'undefined')
		{
			data = JSON.parse(items.data);
		}

		var	head				= document.getElementsByTagName("head")[0];
		var	body				= document.getElementsByTagName("body")[0];
		var	file				= document.location.href.split("/")[document.location.href.split("/").length - 1].replace(/.html.*/, "");
		var	common_css			= document.createElement("link");
		var	common_css_compact	= document.createElement("link");
		var	css					= document.createElement("link");
		var	compact_css			= document.createElement("link");

		var	compact	= data.settings.compact ? "_compact" : "";

		common_css.setAttribute("rel", "stylesheet");
		common_css.setAttribute("type", "text/css");
		common_css.setAttribute("href", "./css/common.css");
		common_css_compact.setAttribute("rel", "stylesheet");
		common_css_compact.setAttribute("type", "text/css");
		common_css_compact.setAttribute("href", "./css/common" + compact + ".css");
		css.setAttribute("rel", "stylesheet")
	    css.setAttribute("type", "text/css")
		css.setAttribute("href", "./css/" + file + ".css");
		compact_css.setAttribute("rel", "stylesheet");
		compact_css.setAttribute("type", "text/css");
		compact_css.setAttribute("href", "./css/" + file + compact + ".css");

		css.onload = function()
		{
			if (!data.settings.compact)
			{
				body.style.opacity = "1";
			}
		};

		compact_css.onload = function()
		{
			body.style.opacity = "1";
		};

		head.appendChild(common_css);
		head.appendChild(css);

		if (data.settings.compact && document.location.href.includes("popup"))
		{
			head.appendChild(common_css_compact);
			head.appendChild(compact_css);
		}
	});
}

function	get_i18n(i18n, message)
{
	if (typeof i18n[message] !== 'undefined')
	{
		if (typeof i18n[message].message !== 'undefined')
		{
			return (i18n[message].message);
		}
	}

	if(typeof i18n.default[message] !== 'undefined')
	{
		if (typeof i18n.default[message].message !== 'undefined')
		{
			return (i18n.default[message].message);
		}
	}

	return ("");
}

function	_GET(param)
{
	var vars = {};
	window.location.href.replace(location.hash, '').replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function( m, key, value )
	{
		vars[key] = value !== undefined ? value : '';
	});

	if (param)
	{
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

set_api();
load_css();

version	= api.runtime.getManifest().version;

/*
 * Show the changelog page only if it's not shown already
 */
if (!document.location.href.includes("changelog.html") && !document.location.href.includes("background"))
{
	check_changelog();
}
