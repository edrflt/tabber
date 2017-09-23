function	set_language()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		if (data.settings.replace_tabs)
		{
			document.getElementById("replace_tabs").value	= api.i18n.getMessage("button_replace_tabs_disable");
		}
		else
		{
			document.getElementById("replace_tabs").value	= api.i18n.getMessage("button_replace_tabs");
		}
		if (data.settings.compact)
		{
			document.getElementById("compact").value	= api.i18n.getMessage("button_compact_disable");
		}
		else
		{
			document.getElementById("compact").value	= api.i18n.getMessage("button_compact");
		}
	});

	document.getElementById("reset").value	= api.i18n.getMessage("button_reset");
}

function	set_enabled_buttons()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		document.getElementById("replace_tabs").className	= data.settings.replace_tabs	? "enabled" : "";
		document.getElementById("compact").className		= data.settings.compact			? "enabled" : "";
	});
}

/*
 * Changes the replace_tabs setting
 */
function	set_replace_tabs()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		if (data.settings.replace_tabs)
		{
			data.settings.replace_tabs	= false;
		}
		else
		{
			data.settings.replace_tabs	= true;
		}

		data.save(function()
		{
			set_language();
			set_enabled_buttons();
		});
	});
}

/*
 * Changes the compact setting
 */
function	set_compact()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		if (data.settings.compact)
		{
			data.settings.compact	= false;
		}
		else
		{
			data.settings.compact	= true;
		}

		data.save(function()
		{
			document.location.href	= "../popup/tabber.html";
		});
	});
}

/*
 * Reset all tabber data by deleting data in storage
 */
function	reset_tabber()
{
	api.storage.sync.clear(function()
	{
		api.runtime.getBackgroundPage(function(page)
		{
			page.load_data();
			window.close();
		});
	});
}

set_language();
set_enabled_buttons();

document.addEventListener("click", function(e)
{
	if (e.target.id == "back")
	{
		document.location.href	= "../popup/tabber.html";
    }
	else if (e.target.id == "replace_tabs")
	{
		set_replace_tabs();
	}
	else if (e.target.id == "compact")
	{
		set_compact();
	}
	else if (e.target.id == "reset")
	{
		e.target.value	= api.i18n.getMessage("button_reset_continue");
		e.target.id		= "reset_continue";
	}
	else if (e.target.id == "reset_continue")
	{
		reset_tabber();
	}
});
