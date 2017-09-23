function	tabber_tab(url = "")
{
	this.url	= url;	// str
}

function	tabber_group(name = "", tabs = [])
{
	this.name	= name;	// str
	this.tabs	= tabs; // tabber_tab[]
}

function	tabber_settings(replace_tabs = false, compact = false)
{
	this.replace_tabs	= replace_tabs;	// bool
	this.compact		= compact;		// bool
}

function	tabber_data(last_version = "0.0", groups = [], settings = new tabber_settings())
{
	this.last_version	= last_version;	// str
	this.groups			= groups;		// tabber_group[]
	this.settings		= settings;		// tabber_settings

	this.read	= function(callback = function(){})
	{
		var t = this;
		api.storage.sync.get(function(items, parent = t)
		{
			if (typeof items.data !== 'undefined')
			{
				if (items.data != "")
				{
					var	parsed			= JSON.parse(items.data);

					var	last_version	= "0";
					var	groups			= [];
					var	settings		= new tabber_settings();

					last_version	= parsed.last_version;
					for (var i = 0; i < parsed.groups.length; i++)
					{
						var	group	= new tabber_group();

						group.name	= parsed.groups[i].name;
						for (var j = 0; j < parsed.groups[i].tabs.length; j++)
						{
							group.tabs.push(parsed.groups[i].tabs[j]);
						}

						groups.push(group);
					}
					settings		= parsed.settings;

					parent.last_version	= last_version;
					parent.groups		= groups;
					parent.settings		= settings;
				}
			}

			callback();
		});
	}

	this.save	= function(callback = function(){})
	{
		api.storage.sync.set(
		{
			data: JSON.stringify(this)
		}, function()
		{
			callback();
		});
	}

	this.from_legacy3_data	= function(callback = function(){}, parent = this)
	{
		parent.read(function()
		{
			api.storage.sync.get(function(items)
			{
				if (typeof items.version !== 'undefined')
				{
					parent.last_version	= items.version;
				}
				if  (typeof items.names !== 'undefined' && items.names != "" && typeof items.tabs !== 'undefined' && items.tabs != "")
				{
					var	legacy_names	= JSON.parse(items.names);
					var	legacy_tabs		= JSON.parse(items.tabs);
					var	groups			= [];

					for (var i = 0; i < legacy_names.length; i++)
					{
						var	tabs_for_current_group	= [];

						for (var j = 0; j < legacy_tabs[i].length; j++)
						{
							tabs_for_current_group.push(new tabber_tab(legacy_tabs[i][j]));
						}

						groups.push(new tabber_group(legacy_names[i], tabs_for_current_group));
					}

					parent.groups	= groups;
				}
				if (typeof items.replace_tabs !== 'undefined')
				{
					if (items.replace_tabs == "off")
					{
						parent.settings.replace_tabs = false;
					}
					else
					{
						parent.settings.replace_tabs = true;
					}
				}
				if (typeof items.compact !== 'undefined')
				{
					if (items.replace_tabs == "_compact")
					{
						parent.settings.replace_tabs = true;
					}
					else
					{
						parent.settings.replace_tabs = false;
					}
				}

				api.storage.sync.set(
				{
					converted: true
				});

				callback();
			});
		});
	}
}
