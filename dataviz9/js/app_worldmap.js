// Laurent Pitoiset 2015

function app_worldmap(){


	var m_width=$("#map").width(),width=$("#map").width(),height=width/1.7;
	$('#map').height(width/1.7);
	var svg=d3.select("#map")
	.append("svg")
	.attr("preserveAspectRatio","xMidYMid")
	.attr("viewBox","0 0 "+width+" "+height)
	.attr("width",m_width)
	.attr("height",m_width*height/width)
        .attr('transform', 'matrix(1 0 0 1 0 0)')
        .on('mousemove', moveLabel)
        .on('mouseover', showLabel)
        .on('mouseout', hideLabel);
	var scale=width/6.3;
	var projection=d3.geo.mercator()
	.scale(scale)
	.center([10,35])
	.translate([((width)/2),height/2]);
	var path=d3.geo.path().projection(projection);
	var g=svg.append("g");
	d3.json("data/world2.json",function(error,data){
		var mapdata=topojson.feature(data,data.objects.un_world);
		g.append("g")
		.attr("id","countries")
		.selectAll("path")
		.data(mapdata.features)
		.enter()
		.append("path")
		.attr("id",function(d){return d.id;})
		.attr('class','country')
		.attr('fill',function(d){return'#c3c3c3';})
		.attr('fill-opacity',0.7)
		.attr('stroke','#FAFAFA')
		.attr('stroke-width',0.5)
		.attr("d",path)
		.on("mouseover",function(){})
		.on("mouseout",function(){})
		var piedata=[0,0];



	});


}	// function



function displayColors(){
	var country_color = "#CCC";
	var color_palette = ['#c3c3c3','#ddbbaa','rgb(254,232,200)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(153,0,0)'];
	query_poc = $(".querybuilder").find("#query_poc").val();
	query_type = $(".querybuilder").find("#query_type").val();
	query_year = $(".querybuilder").find("#query_year").val();
	cl("displaying query for "+query_year+" | "+query_poc+" | "+query_type);
	var country_label = "";
	var json_filename = "data/"+
	query_year+
	"_"+
	"poc.json";
	cl("file name: "+json_filename);
	// hardcoding file name
	//json_filename = "data/2014_poc.json";
	total_refugees = 0;
	poc_value = 0;
	d3.json(json_filename+'?'+Math.random(),function(error,data){$(data)
		.each(function(){
			if(this.country_iso!=''){
				var selection=d3.select('#'+this.country_iso);
				switch(query_type){
					case "0": 
					switch(query_poc){
						case "0":
							poc_value = this.country_of_origin.ref;
						break;
						case "1":
							poc_value = this.country_of_origin.asy;
						break;
						case "2":
							poc_value = this.country_of_origin.idp;
						break;
						default:
						break;
					}
					cl("country "+this.country_iso+" | case 0: CoO "+ poc_value); 
					break;
					case "1": 
					case "0": 
					switch(query_poc){
						case "0":
							poc_value = this.country_of_asylum.ref;
						break;
						case "1":
							poc_value = this.country_of_asylum.asy;
						break;
						case "2":
							poc_value = this.country_of_asylum.idp;
						break;
						default:
						break;
					}

					cl("country "+this.country_iso+" | case 0: CoA "+ poc_value); 
					// country_data.push({iso:this.country_iso,value:poc_value});
					break;
					default: poc_value = 0; cl("case default: problem "+ query_type); break;
				}
				if (poc_value == '0') { country_color = color_palette[0];};
				if (poc_value > 0) { country_color = color_palette[1];};
				if (poc_value > 20000) { country_color = color_palette[2];};
				if (poc_value > 30000) { country_color = color_palette[3];};
				if (poc_value > 50000) { country_color = color_palette[4];};
				if (poc_value > 100000) { country_color = color_palette[5];};
				if (poc_value > 1000000) { country_color = color_palette[6];};
				if (poc_value > 2000000) { country_color = color_palette[7];};
				if (poc_value > 3000000) { country_color = color_palette[8];
					// cl("color "+color_palette[8]+"/"+poc_value)
				};

				// color fill on map
				selection.attr('fill',country_color);
				// add country popup
				country_label = this.name+": "+poc_value+" "+poc_type[query_poc];
				cl(country_label);
				// calculate total poc
				total_refugees+=poc_value*1.0;
			 	// cl("CoO: "+total_refugees);
			 	$(".map_score").html("<i class='icon-ocha-affected-population'></i>&nbsp;"+
			 	total_refugees.toLocaleString("en")+
			 	" " +
			 	poc_type[query_poc]);

			}
		});
});							
}

    // Display the tooltip popup when hovering a country.
    function showLabel() {
      var target = d3.select(d3.event.target);
      if (target.classed('country')) {
        var value = "country";

        $("#label_country")
            .html(value);
      }
      else {
        hideLabel();
      }
    }

    // Hide the country tooltip.
    function hideLabel() {
      
        $("#label_country").html("no country");
    }

    // Move the currently displayed tooltip when the mouse moves.
    function moveLabel() {
      
    }
