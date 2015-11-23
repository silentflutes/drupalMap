/**
 * Created by silentflutes on 11/23/2015.
 */
d3.json("data/nepalDistricts.geojson", createMap);

var aboutPopup;
function closePopup() {
    aboutPopup.remove();
}

function createMap(nepal) {
    var canvas = d3.select("#map")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .append("svg")
            .attr("width", "650px")
            .attr("height", "600px")
            .attr("viewBox", "0 0 804 621")

            //class to make it responsive
            .classed("svg-content-responsive", true)
           // .attr("style", "border: 1px solid red;")
        ;

    var group = canvas.selectAll("g")
        .data(nepal.features)
        .enter()
        .append("g");
    var projection = d3.geo.mercator()
        .scale(4800)
        .center([84.985593872070313, 28.465876770019531]);
    var geoPath = d3.geo.path().projection(projection);

    //plotting map
    var plotDistricts = group.append("path")
        .attr("d", geoPath)
        .attr("fill","white")
        //.attr("class", "brown")
        .attr("stroke", "#000")
        //.attr("fill","white")
        .attr("stroke-width", "1px")
        .attr("district",function(d){
            return d.properties.DISTRICT;
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .on("click", mouseclick)
        ;


            d3.json("data/data.json", getList);
            function getList(data){

                var result = data.map(function (d) {
                    //console.log(d);
                    //console.log(districtName);
                    return d["district-name"] ;
                });

                d3.selectAll("path").each(function(district){
                    //to get the pointer of this district
                    var value = d3.select(this);
                    //console.log(value.attr("district"));
                var districtNameMap=value.attr("district").toString();
                     districtNameMap= districtNameMap.charAt(0).toUpperCase()+
                        districtNameMap.slice(1).toLowerCase();
                var compareResult =result.indexOf(districtNameMap);

                 if(compareResult>-1) {
                     console.log("inside brown");
                     value.attr("class", "brown");
                 }
                  else  if(result.indexOf(districtNameMap)===-1){
                        console.log("inside white");
                        value.attr("class","white");
                    }

            });

            //return d.district;
        }



    //mouse event handler
    var bodyNode = d3.select('body').node();
    var toolTipDiv;


    function mouseclick(nepal) {

        aboutPopup = d3.select("body #map")
           .append("div")
            .attr("class", "popup");

        var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase()+ nepal.properties.DISTRICT.slice(1).toLowerCase();

        d3.json("data/data.json", accessValue);

        var content;
        function accessValue(data) {
            var  result = data.filter(function (d) {
                    //console.log(d);
                    //console.log(districtName);
                    return d["district-name"] == districtName;
                });



            if (result.length===0){

                 content=
                    "<div id='popupWrapper'>"
                    + "<div id='popupTitle'>"
                    + "<h3>Nepal Earthquake 2015</h3>"
                    + "<img id='popUpClose' src='image/close_button.png' onclick ='closePopup()'>"
                    + "</div>"

                    + "<div id='popupContent'>"

                    +"<span class='tooltipTitle'>"
                    + districtName+"</br>"
                    +"</span>"

                    +"<span class='tooltipColumn'>"
                    +"No project"
                    +"</span>"+"</br>"

                    +"<a href='https://github.com/silentflutes/map'>Source code.</a>"
                    + "</div>"
                    + "</div>"
                ;
            }
            else {
            var dName=result.map(function(d){
                return d["district-name"];
            });

            var projectName=result.map(function(d){
                return d["project-name"];
            });

            var info=result.map(function(d){
                return d["info"];
            });

            var unAgencies=result.map(function(d){
                return d["un-agencies"];
            });

            var startDate= result.map(function(d){
                return d["start-date"];
            });

            var endDate=result.map(function(d){
                return d["end-date"];
            });

            var budget=result.map(function(d){
                return d["budget"];
            });


                 content=
                    "<div id='popupWrapper'>"
                    + "<div id='popupTitle'>"

                    + "<h3>Current Projects in Nepal</h3>"
                    + "<img id='popUpClose' src='image/close_button.png' onclick ='closePopup()'>"
                    + "</div>"

                    + "<div id='popupContent'>"

                    + "<span class='tooltipTitle'>"
                    + districtName+"</br>"
                    + "</span>"

                    + "<span id='tooltipColumn'>"
                    + "Project Name:"
                    + "</span>"

                    + "<span id='tooltipColumn'>"
                    + projectName+"</br>"

                    + "<span id='tooltipColumn'>"
                    + "Information:"
                    + "</span>"
                    + "<span id='tooltipColumn'>"
                    + info+"</br>"

                    + "<span id='tooltipColumn'>"
                    + "UN Agencies:"
                    + "</span>"
                    + "<span id='tooltipColumn'>"
                    + unAgencies+"</br>"

                    + "<span id='tooltipColumn'>"
                    + "Start Date:"
                    + "</span>"
                    + "<span id='tooltipColumn'>"
                    + startDate+"</br>"


                    + "<span id='tooltipColumn'>"
                    + "End Date:"
                    + "</span>"
                    + "<span id='tooltipColumn'>"
                    + endDate+"</br>"

                    + "<span id='tooltipColumn'>"
                    + "Budget"
                    + "</span>"
                    + "<span id='tooltipColumn'>"
                    + budget+"</br>"

                    + "<a href='https://github.com/silentflutes/map'>Source code.</a>"

                    + "</div>"
                    + "</div>"
                ;
            }

            aboutPopup.html(content);

           //console.log(dName);
        }
    };




    function mouseover(nepal) {
        var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase()+ nepal.properties.DISTRICT.slice(1).toLowerCase();
        var absoluteMousePos = d3.mouse(bodyNode);
        toolTipDiv = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
        ;
        //no need to display on mouse over
    }
    function mousemove(nepal) {
        var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase()+ nepal.properties.DISTRICT.slice(1).toLowerCase();
        var absoluteMousePos = d3.mouse(bodyNode);

            toolTipDiv
                .style("opacity", 1)
                .style('left', (absoluteMousePos[0]) + 'px')
                .style('top', (absoluteMousePos[1]) + 'px')
                .style('z-index', 1001)
                //.text(d3.event.pageX + ", " + selectedDistrict.properties.DISTRICT +","+ d3.event.pageY)
                .html("<span class='tooltipTitle'>" + districtName
                +"<span class='tooltipValue'>"
                 + "</span>"
            );

    }

    function mouseout() {
        toolTipDiv.remove();
    }

}