var id;
var id_edit;
var	deleting_id		= -1;
var	current_urls	= [];
var	to_add			= [];

/*
 * List all tabs from the current group
 */
function	list_tabs_in_group()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		document.getElementById("list").innerHTML = "";

		document.getElementById("name").value = data.groups[id].name;

		for (var i = 0; i < data.groups[id].tabs.length; i++)
		{
			var button = document.createElement("button");
			var text = document.createTextNode(data.groups[id].tabs[i].url.slice(0, 60));
			button.id = i;
			button.className = "list_button" + (i == data.groups[id].tabs.length - 1 ? " last_button" : "");
			button.appendChild(text);
			button.value	= data.groups[id].tabs[i].url.slice(0, 60);
			document.getElementById("list").appendChild(button);

			var delete_button = document.createElement("button");
			var delete_text = document.createTextNode("×");
			delete_button.id = "delete_" + i;
			delete_button.className = "delete_button";
			delete_button.appendChild(delete_text);
			document.getElementById("list").appendChild(delete_button);
		};
	});
}

/*
 * Shows editing panel for the tab being edited
 */
function	edit_tab(tab_id)
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		id_edit		= tab_id;

		document.getElementById("change_url").style.display	= "block";
		document.getElementById("tab_new_url").value		= data.groups[id].tabs[tab_id].url;
	});
}

/*
 * Saves the tab being edited
 */
function	save_edited_tab()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		data.groups[id].tabs[id_edit].url	= document.getElementById("tab_new_url").value;
		data.save();

		document.getElementById("change_url").style.display = "none";
	});
}

function	add_selected_tabs()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		for (var i = 0; i < to_add.length; i++)
		{
			data.groups[id].tabs.push(new tabber_tab(to_add[i]));
			document.getElementById("add_group").style.display = "none";
			data.save(function()
			{
				api.runtime.sendMessage(["reload_ui_data"]);
				list_tabs_in_group();
			});
		}
	});
}

/*
 * Deletes the specified tab in current group
 */
function	delete_tab(tab_id)
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;
		var	i18n	= page.i18n;

		if (tab_id == deleting_id)
		{
			deleting_id		= -1;

			data.groups[id].tabs.splice(tab_id, 1);
			data.save(function()
			{
				api.runtime.sendMessage(["reload_ui_data"]);
				list_tabs_in_group();
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
			deleting_id = tab_id;

			for (var i = 0; i < buttons.length; i++)
			{
				buttons[i].className	= buttons[i].className.replace(" continue", "");
			}

			var	button	= document.getElementById(tab_id);

			button.childNodes[0].nodeValue	=	get_i18n(i18n, "button_delete_continue");
			button.className				+=	" continue";
			button.disabled					=	true;
		}
	});
}

/*
 * Lists currently opened tabs to add some in current group
 */
function	list_currently_opened_tabs()
{
	api.tabs.query(
	{
		currentWindow: true
	},
	function(tabs)
	{
		current_urls	= [];
		var ignore		= 0;

		for (var i = 0; i < tabs.length; i++)
		{
			if (tabs[i].url.startsWith("http"))
			{
				var button = document.createElement("button");
				var text = document.createTextNode(tabs[i].title.slice(0, 60));
				button.id = i - ignore;
				button.className = "add_tabs_list_button" + (i == tabs.length - 1 ? " last_button" : "");
				button.appendChild(text);
				document.getElementById("opened_tabs_list").appendChild(button);

				current_urls.push(tabs[i].url);
			}
			else
			{
				ignore++;
			}
		};
	});
}

function	replace_group_with_current_tabs()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		api.tabs.query(
		{
			currentWindow: true
		},
		function(current_tabs)
		{
			data.groups[id].tabs	= [];

			for (var i = 0; i < current_tabs.length; i++)
			{
				if (current_tabs[i].url.startsWith("http"))
				{
					data.groups[id].tabs.push(new tabber_tab(current_tabs[i].url));
				}
			}
		});
	});
}

function	set_language()
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	i18n	= page.i18n;

		document.getElementById("replace_with_tabs").		setAttribute("value",		get_i18n(i18n, "button_replace_with_tabs"));
		document.getElementById("add_group_button").		setAttribute("value", 		get_i18n(i18n, "button_add_group"));
		document.getElementById("add_group_button2").		setAttribute("value", 		get_i18n(i18n, "button_add"));
		document.getElementById("cancel_group_button").		setAttribute("value", 		get_i18n(i18n, "button_cancel"));
		document.getElementById("tab_new_url").				setAttribute("placeholder",	get_i18n(i18n, "edit_new_url_placeholder"));
		document.getElementById("edit_url_save_button").	setAttribute("value", 		get_i18n(i18n, "button_save"));
		document.getElementById("edit_url_cancel_button").	setAttribute("value", 		get_i18n(i18n, "button_cancel"));
	});
}

id	= _GET("id");

set_language();
list_tabs_in_group();
list_currently_opened_tabs();


document.addEventListener("click", function(e)
{
	if (e.target.id == "back")
	{
		document.location.href = "../popup/tabber.html";
    }
	else if (e.target.classList[0] == "list_button")
	{
		edit_tab(e.target.id);
	}
	else if (e.target.id == "add_group_button")
	{
		document.getElementById("add_group").style.display = "block";
	}
	else if (e.target.id == "replace_with_tabs")
	{
		api.runtime.getBackgroundPage(function(page)
		{
			var	i18n	= page.i18n;

			e.target.value	= get_i18n(i18n, "button_replace_with_tabs_continue");
			e.target.id		= "replace_with_tabs_continue";
		});
	}
	else if (e.target.id == "replace_with_tabs_continue")
	{
		replace_group_with_current_tabs();
	}
	else if (e.target.id == "add_group_button2")
	{
		add_selected_tabs();
	}
	else if (e.target.id == "cancel_group_button")
	{
		document.getElementById("add_group").style.display = "none";
	}
	else if (e.target.classList[0] == "add_tabs_list_button")
	{
		if (to_add.includes(current_urls[e.target.id]))
		{
			to_add.splice(to_add.indexOf(current_urls[e.target.id]), 1);
			e.target.className	= e.target.className.replace(" selected", "");
		}
		else
		{
			to_add.push(current_urls[e.target.id]);
			e.target.className += " selected";
		}
	}
	else if (e.target.classList[0] == "delete_button")
	{
		delete_tab(e.target.id.replace("delete_", ""));
	}
	else if (e.target.id == "edit_url_save_button")
	{
		save_edited_tab();
	}
	else if (e.target.id == "edit_url_cancel_button")
	{
		document.getElementById("change_url").style.display = "none";
	}
});

document.addEventListener("mouseover", function(e)
{
	if (e.target.classList[0] == "list_button")
	{
		document.getElementById(e.target.id).className += " mouseover";
		document.getElementById("delete_" + e.target.id).className += " mouseover";
	}
	else if (e.target.classList[0] == "delete_button")
	{
		document.getElementById(e.target.id.replace("delete_", "")).className += " mouseover";
		document.getElementById("delete_" + e.target.id.replace("delete_", "")).className += " mouseover";
	}
});

document.addEventListener("mouseout", function(e)
{
	if (e.target.classList[0] == "list_button")
	{
		document.getElementById(e.target.id).className	= document.getElementById(e.target.id).className.replace(" mouseover", "");
		document.getElementById("delete_" + e.target.id).className	= document.getElementById("delete_" + e.target.id).className.replace(" mouseover", "");
	}
	else if (e.target.classList[0] == "delete_button")
	{
		document.getElementById(e.target.id.replace("delete_", "")).className	= document.getElementById(e.target.id.replace("delete_", "")).className.replace(" mouseover", "");
		document.getElementById("delete_" + e.target.id.replace("delete_", "")).className	= document.getElementById("delete_" + e.target.id.replace("delete_", "")).className.replace(" mouseover", "");
	}
});

document.getElementById("name").addEventListener("keyup", function(e)
{
	api.runtime.getBackgroundPage(function(page)
	{
		var	data	= page.data;

		data.groups[id].name	= document.getElementById("name").value;
		data.save();
	});
});
