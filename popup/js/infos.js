function	set_language()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	i18n	= page.i18n;

		var description	= document.createTextNode(get_i18n(i18n, "description"));
		var infos		= document.createTextNode(get_i18n(i18n, "version") + " " + version);

		document.getElementById("description").appendChild(description);
		document.getElementById("infos").appendChild(infos);

		document.getElementById("version_notes").value	= get_i18n(i18n, "button_version_notes");
	});
}

set_language();

document.addEventListener("click", function(e)
{
	if (e.target.id == "back")
	{
		document.location.href	= "../popup/tabber.html";
    }
	else if(e.target.id == "version_notes")
	{
		document.location.href	= "../popup/changelog.html";
	}
});
