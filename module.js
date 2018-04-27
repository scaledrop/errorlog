exports.updateData = function (obj, callback) {
	var collection = obj.db.collection();
	var rec = 0;
	function update() {
		collection.update(obj.query, obj.data, {upsert:true}, function (err, result) {
	    	if (err && rec < 2){
	    	 	obj.db.connect(function () {
					collection = obj.db.collection();
					outputResponse();
				});
	    	} else {
	    	 	if(typeof callback == 'function') {
	    	 		callback(result);
	    	 	}
	    	}
	    });	
	}

	outputResponse = function () {
		rec++;
		update();
	};
	outputResponse();
}

exports.getData = function (obj, callback) {
	var collection = obj.db.collection();
	if(typeof obj.collection == 'string') {
		collection = obj.db.otherCollection(obj.collection);
	};

	var rec = 0;
    outputResponse = function () {
    	rec++;
    	var response = [];
		let sortObj = obj.sort ? obj.sort : {};
		
		let pageSize = obj.pagesize ? obj.pagesize : 10;
		let pageNumObj = obj.pageno ? obj.pageno : 1;
		let skipObj = pageSize ? (pageNumObj - 1) * pageSize : '';
		console.log("pageSize", pageSize);
		collection.find(obj.query).skip(skipObj).limit(pageSize).sort(sortObj).forEach(function(result) {
    		if(result) {
    			response.push(result);
    		}
		}, function(err) {
			if(err && rec < 2){
				obj.db.connect(function () {
					collection = obj.db.collection();
					outputResponse();
				});
			}else{
		        if(typeof callback == 'function') {
	    	 		callback(response);
	    	 	}
			}
		})
    }
    outputResponse();
}

exports.removeData = function(obj, callback) {
	var collection = obj.db.collection();
	var rec = 0;
	function remove() {
		collection.remove(obj.query, function (err, result) {
        	if (err && rec < 2){
        		obj.db.connect(function () {
					collection = obj.db.collection();
					outputResponse();
				});
        	}else{
        		if(typeof callback == 'function') {
	    	 		callback(result);
	    	 	}	
        	}
        });
	}

	outputResponse = function () {
		rec++;
		remove();
	};
	outputResponse();
}

exports.saveData = function(obj, callback) {
	var collection = obj.db.collection();
	if(typeof obj.collection == 'string') {
		collection = obj.db.otherCollection(obj.collection);
	};
	collection.save(obj.data, function (err, result) {
		if (err && rec < 2){
    	 	obj.db.connect(function () {
				collection = obj.db.collection();
				outputResponse();
			});
    	} else {
    	 	if(typeof callback == 'function') {
    	 		callback(result);
    	 	}
    	}
	})
}
exports.aggregate = (obj, callback) => {
	var collection = obj.db.collection();
	if(typeof obj.collection == 'string') {
		collection = obj.db.otherCollection(obj.collection);
	};
	collection.aggregate(obj.query).toArray(function(err, result){
		if (err && rec < 2){
    	 	obj.db.connect(function () {
				collection = obj.db.collection();
				outputResponse();
			});
    	} else {
    	 	if(typeof callback == 'function') {
    	 		callback(result);
    	 	}
    	}          
	});
}