/* global $, $K, chroma, console, moment */
/*jshint multistr: true */

'use strict';

var map;

map = $K.map('#base');

var extent = function(data){
	var min = Infinity, max = -Infinity, x, min_ob, max_ob, count = 0;
	for (x in data){
		count++;
		if(+data[x].count < min) {
			min = data[x].count;
			min_ob = data[x];
		}

		if(+data[x].count > max) {
			max = data[x].count;
			max_ob = data[x];
		}
	}

	return [min_ob, max_ob, count];
};

var world_data;

$.fn.qtip.defaults.style.classes = 'ui-tooltip-bootstrap';

$.get('/data.json', function(data) {
	world_data = data;

	map.loadMap('/world.svg', function() {

		var total_countries = world_data.length;

		var max_min = extent(world_data);

		$('#info').html('<span class="main-data">We have data of ' + max_min[2] + ' countries.</span><br/> \
			The best country is <span class="info-block best">' + max_min[1].name + ' (you can travel \
			to ' + max_min[1].count + ' other countries without visa)</span> and the worst is \
			<span class="info-block worst">' + max_min[0].name + ' (you can travel to ' + max_min[0].count + ' other \
			countries without visa)</span>');


		var colorscale;

		// colorscale = chroma.scale(['red', 'green']).domain(world_data, 24, 'quantiles', 'count');
		colorscale = chroma.scale('RdYlBu').domain(world_data, 24, 'quantiles', 'count');

		map.addLayer('countries', {
			styles: {
				'stroke-width': 0.7,
				fill: function(d) {
					if (world_data[d.code]) {
						return colorscale(world_data[d.code].count);
					} else {
						return '#fff';
					}
				},
				stroke: function(d) {
					if (world_data[d.code]) {
						return colorscale(world_data[d.code].count).darker();
					} else {
						return '#fff';
					}
				}
			},
			tooltips: function(d) {
				if (world_data[d.code]) {
					return [d.country, 'If you are a citizen of this country you can travel to <strong>' + world_data[d.code].count + '</strong> other countries without visa'];
				} else {
					return [d.country, 'Sorry, no data'];
				}
			}
		});

		$('.loading').fadeOut(function() {
			// something?
		});

	});

$(window).resize(function() {
	map.resize($(window).width());
});

});
