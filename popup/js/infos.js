function	set_language()
{
	var description	= document.createTextNode(api.i18n.getMessage("description"));
	var infos		= document.createTextNode(api.i18n.getMessage("version") + " " + version);

	document.getElementById("description").appendChild(description);
	document.getElementById("infos").appendChild(infos);

	document.getElementById("version_notes").value	= api.i18n.getMessage("button_version_notes");
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
