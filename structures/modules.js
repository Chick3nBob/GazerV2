class EventModule {
	constructor(client) {
		this.client = client;
		this.modules = [];
	}

	addModule(module) {
		this.modules.push(module);
	}

	event(eventType, args) {
		for (module of this.modules) {
			if (module.eventTypes.includes(eventType)) {
				module.run(this.client, eventType, args);
			}
		}
	}
}

module.exports = EventModule;