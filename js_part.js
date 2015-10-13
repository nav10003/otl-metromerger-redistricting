
<script type="text/javascript">
	var map = L.map('map').setView([41.5, -72.67], 9);
	// customize source link to your GitHub repo
	map.attributionControl
	.setPrefix('View <a href="http://github.com/jackdougherty/otl-metromerger">open-source code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
	new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
	}).addTo(map);

	var geojson;
	var totalPop = 0;
	var totalIncome = 0;
	var totalTaxable = 0;
	var metroPerCapIncome = 0;
	var metroPerCapTaxable = 0;

	// style the initial map in gray tone
	function style(feature) {
    return {
        fillColor: 'gray',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
	}

	// display data when hovering
	function highlightFeature(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
	}

	// when click on town polygon, style color to green, and increment total value of each selected layer.feature.properties.Pop2010
	function chooseFeature(e) {
    var layer = e.target;
    layer.setStyle({
        fillColor: 'green',
        fillOpacity: 0.7
     });
    // The addition assignment operator (+=) adds a value to a variable
    totalPop += layer.feature.properties.PopACS2013;
		totalIncome += layer.feature.properties.IncACS2013;
		totalTaxable += layer.feature.properties.ENGLY2012;
		// calculates values per person
		metroPerCapIncome = totalIncome/totalPop;
		metroPerCapTaxable = totalTaxable/totalPop;
    // updates display
    info.update(layer.feature.properties);
	}

	// event listeners for hovering or clicking on town polygons
	function onEachFeature(feature, layer) {
    layer.on({
    	mouseover: highlightFeature,
        click: chooseFeature
    });
	}

	// set up the town map overlay
	geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
	}).addTo(map);

	// set up the info window
	var info = L.control( {position: 'bottomright'} ); // places info box over Long Island
	info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
	};

	// update the control info window based on feature properties passed
	info.update = function (props) {
		var winName =
  	this._div.innerHTML =
		'<h4>Click to merge Connecticut towns into<br />a hypothetical metropolitan region:</h4>' +
		(props ? '<b>' + props.Town + '</b>' + '<br />' +
		comma(props.PopACS2013) + ' people' + '<br />$' +
		comma(props.IncACS2013/props.PopACS2013) + ' income per capita' + '<br />$' + 
		comma(props.ENGLY2012/props.PopACS2013) + ' taxable property per capita' + '<br /><b>' +
		'Merged region (2012-13 data)' + '</b><br />' +
		(props ? comma(checkNull(totalPop,false)) : '---') + ' people' + '<br />$' +
		(props ? comma(checkNull(metroPerCapIncome,false)) : '---') + ' income per capita' + '<br />$' +
		(props ? comma(checkNull(metroPerCapTaxable,false)) : '---') + ' taxable property per capita': 'Hover over a town');
	};
	info.addTo(map);

	// functions from @alvinschang at CT Mirror to display data in info window
	function checkNull(val,pct) {
	  if (val > -99999999999) {
    	if (pct) {
      	return val = Math.round(val*10)/10 + "%";
    	} else {
      	return val = Math.round(val*10)/10;
    	}
  	} else {
    	return "No data";
  	}
	}

	function checkThePct(a) {
	  if (a > -1) {
	    return Math.round(a*1000)/10 + "%";
	  } else {
	    return "--";
	  }
	}

	function comma(val){
	  num = val;
	  val = Math.round(val);
	  while (/(\d+)(\d{3})/.test(val.toString())){
	    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	  }
	  if (val == "-") {
	    return val;
	  } else if (num < 0) {
	    return "(" + val.replace("-","")+")";
	  } else {
	    return "" + val;
	  }
	}
</script>