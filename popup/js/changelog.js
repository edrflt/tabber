function	set_language()
{
	var	updated_title		= document.createTextNode(api.i18n.getMessage("updated_title"));
	var	message_changelog	= api.i18n.getMessage("changelog").split("<br>");

	document.getElementById("updated_title").appendChild(updated_title);

	for(var i = 0; i < message_changelog.length; i++)
	{
		var changelog	= document.createTextNode(message_changelog[i]);
		var	br			= document.createElement("BR");

		document.getElementById("changelog").appendChild(changelog);
		document.getElementById("changelog").appendChild(br);
	}

	document.getElementById("good_news").value	= api.i18n.getMessage("button_good_news");
}

function	set_changelog_version()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		data.last_version	= version;
		data.save(function()
		{
			if (document.location.href.includes("sidebar"))
			{
				document.location.href = "../sidebar/tabber.html";
			}
			else
			{
				document.location.href = "../popup/tabber.html";
			}
		});
	});
}

set_language();

document.addEventListener("click", function(e)
{
	if (e.target.id == "back")
	{
		document.location.href = "../popup/tabber.html";
    }
	else if (e.target.id == "good_news")
	{
		set_changelog_version();
	}
});
