var	deleting_id = -1; // id of the group being deleted (used to show the confirmation)

/*
 * Reads tab groups in tabber_data and shows them
 */
function	fill_group_list()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;
		var	list	= document.getElementById("list");

		list.innerHTML	= "";

		for (var i = 0; i < data.groups.length; i++)
		{
			var group_button	= document.createElement("button");
			var group_text		= document.createTextNode(data.groups[i].name);
			group_button.id			= i;
			group_button.className	= "list_button";
			group_button.value		= data.groups[i].name;
			group_button.appendChild(group_text);

			var edit_button	= document.createElement("button");
			var edit_text	= document.createTextNode("•••");
			edit_button.id			= "edit_" + i;
			edit_button.className	= "edit_button";
			edit_button.appendChild(edit_text);

			var delete_button	= document.createElement("button");
			var delete_text		= document.createTextNode("×");
			delete_button.id		= "delete_" + i;
			delete_button.className	= "delete_button";
			delete_button.appendChild(delete_text);

			var	line	= document.createElement("div");
			line.id			= "line_i";
			line.className	= "line";
			line.appendChild(group_button);

			if (document.location.href.includes("popup"))
			{
				line.appendChild(edit_button);
				line.appendChild(delete_button);
			}

			list.appendChild(line);
		}
	});
}

/*
 * Add current group in tabber_data and saves it
 */
function	add_group_to_list()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;
		var	group	= new tabber_group();

		group.name	= document.getElementById("tabs_name").value;

		api.tabs.query(
		{
			currentWindow: true
		},
		function(current_tabs)
		{
			for (var i = 0; i < current_tabs.length; i++)
			{
				if (current_tabs[i].url.includes("http"))
				{
					group.tabs.push(new tabber_tab(current_tabs[i].url));
				}
			}

			api.runtime.sendMessage(["add_group_to_list", group], function()
			{
				fill_group_list();
			});
		});
	});
}

/*
 * Restores group of given id
 */
function	restore_group(id, alt)
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data		= page.data;
		var	group		= data.groups[id];
		var	tab_list	= [];

		for (var i = 0; i < group.tabs.length; i++)
		{
			var	url	= group.tabs[i].url;
			if (url.includes("http"))
			{
				tab_list.push(group.tabs[i].url);
			}
		}

		if (data.settings.replace_tabs && !alt || (!data.settings.replace_tabs && alt))
		{
			api.tabs.query({currentWindow: true}, function(current_tabs)
			{
				var	tabs_to_close	= [];

				api.tabs.create(
				{
					url: tab_list[0]
				});

				for (var i = 0; i < current_tabs.length; i++)
				{
					tabs_to_close.push(current_tabs[i].id);
				}

				for (var i = 1; i < tab_list.length; i++)
				{
					api.tabs.create(
					{
						url: tab_list[i]
					});
				}

				api.tabs.remove(tabs_to_close);
			});
		}
		else
		{
			api.windows.create(
			{
				url: tab_list
			});
		}
	});
}

/*
 * Deletes the group of given id
 */
function	delete_group(id)
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		if (id == deleting_id)
		{
			deleting_id		= -1;

			data.groups.splice(id, 1);
			data.save(function()
			{
				api.runtime.sendMessage(["reload_ui_data"]);
				fill_group_list();
			});
		}
		else
		{
			var	buttons	= document.getElementsByClassName("list_button");

			if (deleting_id != -1)
			{
				document.getElementById(deleting_id).childNodes[0].nodeValue	= document.getElementById(deleting_id).value;
				document.getElementById(deleting_id).disabled					= false;
			}
			deleting_id = id;

			for (var i = 0; i < buttons.length; i++)
			{
				buttons[i].className	= buttons[i].className.replace(" continue", "");
			}

			var	button	= document.getElementById(id);

			button.childNodes[0].nodeValue	=	api.i18n.getMessage("button_delete_continue");
			button.className				+=	" continue";
			button.disabled					=	true;
		}
	});
}

function	set_language()
{
	document.getElementById("tabs_name").setAttribute("placeholder", api.i18n.getMessage("tabs_name_placeholder"));
}

function	set_click_event()
{
	document.addEventListener("click", function(e)
	{
		if (e.target.id == "infos")
		{
			document.location.href = "../popup/infos.html";
		}
		else if (e.target.id == "settings")
		{
			document.location.href = "../popup/settings.html";
		}
		else if (e.target.id == "save_button")
		{
			if (document.getElementById("tabs_name").value != "")
			{
				add_group_to_list();
			}
	    }
		else if (e.target.classList[0] == "list_button")
		{
			restore_group(e.target.id, e.altKey);
		}
		else if (e.target.classList[0] == "edit_button")
		{
			document.location.href = "../popup/edit.html?id=" + e.target.id.replace("edit_", "");
		}
		else if (e.target.classList[0] == "delete_button")
		{
			delete_group(e.target.id.replace("delete_", ""));
		}
	});
}

function	set_mouseover_event()
{
	document.addEventListener("mouseover", function(e)
	{
		if (document.location.href.includes("popup"))
		{
			if (e.target.classList[0] == "list_button")
			{
				document.getElementById(e.target.id).className += " mouseover";
				document.getElementById("edit_" + e.target.id).className += " mouseover";
				document.getElementById("delete_" + e.target.id).className += " mouseover";
			}
			else if (e.target.classList[0] == "edit_button")
			{
				document.getElementById(e.target.id.replace("edit_", "")).className += " mouseover";
				document.getElementById("edit_" + e.target.id.replace("edit_", "")).className += " mouseover";
				document.getElementById("delete_" + e.target.id.replace("edit_", "")).className += " mouseover";
			}
			else if (e.target.classList[0] == "delete_button")
			{
				document.getElementById(e.target.id.replace("delete_", "")).className += " mouseover";
				document.getElementById("edit_" + e.target.id.replace("delete_", "")).className += " mouseover";
				document.getElementById("delete_" + e.target.id.replace("delete_", "")).className += " mouseover";
			}
		}
	});
}

function	set_mouseout_event()
{
	document.addEventListener("mouseout", function(e)
	{
		if (document.location.href.includes("popup"))
		{
			if (e.target.classList[0] == "list_button")
			{
				document.getElementById(e.target.id).className	= document.getElementById(e.target.id).className.replace(" mouseover", "");
				document.getElementById("edit_" + e.target.id).className	= document.getElementById("edit_" + e.target.id).className.replace(" mouseover", "");
				document.getElementById("delete_" + e.target.id).className	= document.getElementById("delete_" + e.target.id).className.replace(" mouseover", "");
			}
			else if (e.target.classList[0] == "edit_button")
			{
				document.getElementById(e.target.id.replace("edit_", "")).className	= document.getElementById(e.target.id.replace("edit_", "")).className.replace(" mouseover", "");
				document.getElementById("edit_" + e.target.id.replace("edit_", "")).className	= document.getElementById("edit_" + e.target.id.replace("edit_", "")).className.replace(" mouseover", "");
				document.getElementById("delete_" + e.target.id.replace("edit_", "")).className	= document.getElementById("delete_" + e.target.id.replace("edit_", "")).className.replace(" mouseover", "");
			}
			else if (e.target.classList[0] == "delete_button")
			{
				document.getElementById(e.target.id.replace("delete_", "")).className	= document.getElementById(e.target.id.replace("delete_", "")).className.replace(" mouseover", "");
				document.getElementById("edit_" + e.target.id.replace("delete_", "")).className	= document.getElementById("edit_" + e.target.id.replace("delete_", "")).className.replace(" mouseover", "");
				document.getElementById("delete_" + e.target.id.replace("delete_", "")).className	= document.getElementById("delete_" + e.target.id.replace("delete_", "")).className.replace(" mouseover", "");
			}
		}
	});
}

function	set_message_event()
{
	api.runtime.onMessage.addListener(function(msg)
	{
		if(msg[0] == "reload_ui_data")
		{
			fill_group_list();
		}
	});
}

set_language();

set_click_event();
set_mouseover_event();
set_mouseout_event();

fill_group_list();
