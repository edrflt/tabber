api.browserAction.disable();

var data	= new tabber_data();

load_data();
set_message_event();

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
