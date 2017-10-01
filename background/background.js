api.browserAction.disable();

var data	= new tabber_data();
var	i18n;

load_data();
set_message_event();

get_local_i18n(function()
{
	retrieve_i18n();
	setInterval(retrieve_i18n, 60*60*1000); // Check for new language each hour
});

function	load_data()
{
	data = new tabber_data();
	api.storage.sync.get(function(items)
	{
		if (typeof items.converted !== 'undefined' && items.converted === true)
		{
			data.read();
		}
		else
		{
			data.from_legacy3_data(function()
			{
				data.save();
			});
		}

		api.browserAction.enable();
	});
}

function	set_message_event()
{
	api.runtime.onMessage.addListener(function(msg)
	{
		if (msg[0] == "add_group_to_list")
		{
			data.groups.push(msg[1]);
			data.save(function()
			{
				api.runtime.sendMessage(["reload_ui_data"]);
			});
		}
	});
}

function	retrieve_i18n()
{
	var	request	= new XMLHttpRequest();
	var	url		= api.i18n.getMessage("tabber_i18n_url") + "messages.json";

	request.open("GET", url, true);
	request.overrideMimeType("application/json");
	request.send(null);
	request.onreadystatechange = function()
	{
		if (request.readyState	=== 4 &&
			request.status		=== 200)
		{
            try
			{
				i18n	= JSON.parse(request.responseText);
			}
			catch(e)
			{
				
			}
        }
		get_default_i18n();
    }
}

function	get_default_i18n()
{
	var	request	= new XMLHttpRequest();
	var	url		= api.extension.getURL("../default_i18n/messages.json");

	request.open("GET", url, true);
	request.overrideMimeType("application/json");
	request.send(null);
	request.onreadystatechange = function()
	{
		if (request.readyState	=== 4)
		{
            i18n.default	= JSON.parse(request.responseText);
			set_local_i18n();
        }
    }
}

function	get_local_i18n(callback = function(){})
{
	api.storage.local.get(function(items)
	{
		if (typeof items.i18n !== 'undefined')
		{
			i18n	= JSON.parse(items.i18n);
		}
		else
		{
			i18n	= {};
		}

		callback();
	});
}

function	set_local_i18n(callback = function(){})
{
	api.storage.local.set(
	{
		i18n: JSON.stringify(i18n)
	}, function()
	{
		callback();
	});
}
