const {
	MongoClient,
} = require('mongodb');
const credentials = require(`${process.cwd()}/config`).database;
class Collection {
	constructor(database, name) {
		this.db = database.collection(name);;
	}

	insert(key, object) {
		return this.db.insertOne({
			_id: key,
			value: object
		});
	}

	delete(key) {
		return this.db.deleteOne({
			_id: key,
		});
	}

	update(key, object) {
		return this.db.updateOne({
			_id: key,
		}, {
			$set: object,
		});
	}

	find(key, full = false) {
		return this.db.findOne({
			_id: key
		}).then((m) => {
			if (m == null) return null;
			if (full) return m;
			return m.value
		})
	}

	async has(key) {
		return !!(await this.db.findOne({
			_id: key
		}));
	}
}


class Database {
	constructor(client) {
		this.client = client;
	}
	async connect() {
		try {
			this.mongoclient = await MongoClient.connect(credentials.URL, {
				useUnifiedTopology: true
			});
			console.log("[DATABASE]: Connection has been established successfully.");
			this.db = this.mongoclient.db(credentials.DBNAME);
		} catch (error) {
			console.log(`[DATABASE]: Unable to connect to the database: \n${error}`);
			console.log("[DATABASE]: Try reconnecting in 10 seconds...");
			setTimeout(() => this.connect(), 10000);
		}
	}

	 collection(name) {
		return new Collection(this.db, name);
	}

	close() {
		this.db.close();
	}
}

module.exports = Database;