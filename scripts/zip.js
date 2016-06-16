
var results = [];
(function(module) {
  function Zip (opts) {
    for (key in opts) {
      this[key] = opts[key];
    }
  };

  Zip.createTable = function() {
    webDB.execute(
    'CREATE TABLE IF NOT EXISTS zips (id INTEGER PRIMARY KEY, zip VARCHAR, city VARCHAR, state VARCHAR, address VARCHAR, borough VARCHAR, neighborhood VARCHAR, county VARCHAR);',
    function() {
      console.log('table created');
    }
  );
  };

  Zip.prototype.insertRecord = function() {
    webDB.execute(
    [ {
      'sql': 'INSERT INTO zips (zip, city, state, address, borough, neighborhood, county) VALUES (?,?,?,?,?,?,?);',
      'data':[this.zip, this.city, this.state, this.address, this.borough, this.neighborhood, this.county]
    }
    ]
  );
  };

  Zip.fetchAll = function() {
    $.getJSON('/data/manhattan.json', function(data) {
      var zipData = data.features;
      return zipData.forEach(function(obj) {
        delete obj.properties.county;
        delete obj.properties.city;
        delete obj.properties.borough;
        delete obj.properties.state;
        var coord = obj.geometry.coordinates;
        var z = obj.properties;
        z.coordinates = coord;
        results.push(z);
      });
    });
    Zip.createTable();
    results.forEach(function(z) {
      z.insertRecord();
    });
  };
  Zip.fetchAll();
  module.Zip = Zip;
})(window);
