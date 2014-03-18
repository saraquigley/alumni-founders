    var categoryChart = dc.rowChart("#category-chart");
    var vcYearChart = dc.barChart("#vc-year-chart");
    var exitChart = dc.pieChart("#exit-chart");
    var undergradDisciplineChart = dc.pieChart("#undergrad-chart");
    var gradDisciplineChart = dc.pieChart("#grad-chart");
    var disciplineChart = dc.rowChart("#discipline-chart");
    var degreeYearChart = dc.barChart("#degree-year-chart");

    d3.csv("berkeleyFounders2.csv", function (csv) {
        var data = crossfilter(csv);
        var all = data.groupAll();

        // Formatting helpers
        var parseDate = d3.time.format('%Y');

        // format the data
        csv.forEach(function (d){
            d.foundDate = parseDate.parse(d.dateFounded);
            d.gradDate = parseDate.parse(d.degreeYear);
            d.count = 1;
            });

        var categories = data.dimension(function (d) { return d.category; });
        var categoryCount = categories.group();

        var foundingDates = data.dimension(function (d) { return d.foundDate; });
        var foundingDateCount = foundingDates.group();

        var exits = data.dimension(function (d) { return d.exit; });
        var exitCount = exits.group();

        var gDisciplines = data.dimension(function (d) { return d.g; });
        var gDisciplineCount = gDisciplines.group();

        var ugDisciplines = data.dimension(function (d) { return d.ug; });
        var ugDisciplineCount = ugDisciplines.group();
   
        var disciplineAreas = data.dimension(function (d) { return d.ugArea; });
        var disciplineAreaCount = disciplineAreas.group();

        var degreeYears = data.dimension(function (d) { return d.gradDate; });
        var degreeYearCount = degreeYears.group().reduceSum(function(d) { return d.count; });
        
        var founders = data.dimension(function (d) { return d.founder; });
        var appTypeColors = ["#fec44f","#ec7014"];

        // blue colors[ "rgb(198,219,239)",
        //         "rgb(158,202,225)",
        //         "rgb(107,174,214)",
        //         "rgb(66,146,198)",
        //         "rgb(33,113,181)",
        //         "rgb(8,81,156)"]
        //         
        // pink colors ["#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"]
        // yellow colors ["#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404"]

            // tooltips for pie chart
            var pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + d.value; });
                  // .html(function (d) { return "<span style='color: #fee391'>" +  d.data.key + "</span> : "  + d.data.value; });

            // tooltips for bar chart
            var barTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: #c6dbef'>" + d.key + "</span> : " + d.value;});
                  

            dc.dataCount("#data-count-top")
                    .dimension(data)
                    .group(all);

            categoryChart.width(320)
                    .height(680)
                    .margins({top: 10, right: 50, bottom: 30, left: 140})
                    .transitionDuration(750)
                    .dimension(categories)
                    .group(categoryCount)
                    .ordinalColors(['rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)'])
                    .labelOffsetX([-8])
                    .labelOffsetY([12])
                    .title(function () { return ""; })
                    .elasticX(false)
                    .xAxis().ticks(4);

            vcYearChart.width(520)
                    .height(200)
                    .margins({top: 20, right: 20, bottom: 20, left: 30})
                    .transitionDuration(750)
                    .dimension(foundingDates)
                    .group(foundingDateCount)
                    .elasticY(false)
                    .centerBar(true)
                    .brushOn(true)
                    .ordinalColors(["#01665e"])  //green #4dac26
                    .gap(1)
                    .x(d3.time.scale().domain([new Date(1993, 01, 01), new Date(2014, 01, 01)]))
                    .xUnits(d3.time.years)
                    .renderHorizontalGridLines(true)
                    .filterPrinter(function (filters) {
                        var filter = filters[0], s = "";
                        var dateObj = new Date(filter[0]);
                            s += (dateObj.getFullYear() + 1) + " - " + parseDate(filter[1]);
                        return s;
                    })
                    .yAxis().ticks(5);
                   
            exitChart.width(240)
                    .height(210)
                    .transitionDuration(750)
                    .radius(80)
                    .dimension(exits)
                    .group(exitCount)
                    .ordinalColors(["#b2df8a","#1f78b4","#a6cee3"])
                    .title(function () { return ""; })
                    .legend(dc.legend());

            gradDisciplineChart.width(240)
                    .height(220)
                    .transitionDuration(750)
                    .radius(100)
                    .innerRadius(60)
                    .dimension(gDisciplines)
                    .group(gDisciplineCount)
                    .title(function () { return ""; })
                    .ordinalColors(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#666666"] )
                    .renderLabel(true);


            undergradDisciplineChart.width(240)
                    .height(220)
                    .transitionDuration(750)
                    .radius(100)
                    .innerRadius(60)
                    .dimension(ugDisciplines)
                    .group(ugDisciplineCount)
                    .title(function () { return ""; })
                    .colors(d3.scale.category20b())
                    //.ordinalColors(["#5254a3","#6b6ecf","#9c9ede","#637939","#e7cb94","#843c39", "#bfd3e6","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6"])
                    // .colors(["#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"])
                    // .colorDomain([1,29])
                    // .colorAccessor(function (d) {return d.ugArea;})
                    .renderLabel(false);

            disciplineChart.width(290)
                    .height(220)
                    .margins({top: 10, right: 2, bottom: 20, left: 150})
                    .transitionDuration(750)
                    .dimension(disciplineAreas)
                    .group(disciplineAreaCount)
                    .ordinalColors(["#7a0177"])
                    //.ordinalColors(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"]) //["#e7969c","#637939","#843c39","#a55194","#de9ed6","#6b6ecf","#BFD3E6"])
                    .labelOffsetX([-8])
                    .labelOffsetY([12])
                    .title(function () { return ""; })
                    .elasticX(false)
                    .xAxis().ticks(4);

                        
            degreeYearChart.width(800)
                    .height(190)
                    .margins({top: 10, right: 50, bottom: 20, left: 40})
                    .transitionDuration(750)
                    .dimension(degreeYears)
                    .group(degreeYearCount)
                    .elasticY(false)
                    .centerBar(true)
                    .gap(2)
                    .ordinalColors(["#dd3497"])
                    .x(d3.time.scale().domain([new Date(1972, 01, 01), new Date(2014, 12, 31)]))
                    .xUnits(d3.time.years)
                    .renderHorizontalGridLines(true)
                    .filterPrinter(function (filters) {
                        var filter = filters[0], s = "";
                        var dateObj = new Date(filter[0]);
                        s += (dateObj.getFullYear() + 1) + " - " + parseDate(filter[1]);
                        return s;
                    })
                    .yAxis().ticks(5);


            dc.dataCount("#data-count-bottom")
                    .dimension(data)
                    .group(all);

            dc.dataTable(".dc-data-table")
                                .dimension(founders)
                                .group(function (d) {
                                    return d.company + " <span class='company-desc'> " + d.description +
                                    "<br>" + (d.skyDeck ? "<a target='_blank' href='http://skydeck.berkeley.edu/'><img src='skyDeck.png' height='30px'/><span class='skydeck'>A SkyDeck Startup&nbsp;&nbsp;</span></a>" : "") + "<strong>Founded: </strong>" + d.dateFounded +
                                    "&nbsp;&nbsp;<strong>Sector:</strong> " + d.category  +
                                    "&nbsp;&nbsp;<span class='exit-desc'>" + (d.exitDetails ? "<strong>Exit: </strong>" + d.exitDetails : "") + "</span></span>";
                                })
                                .size(170)
                                .columns([
                                    function (d) { return ""; },
                                    function (d) { return d.founder; },
                                    function (d) { return d.disciplines; }
                                ])
                                .sortBy(function (d) {
                                    return d.company;
                                })
                                .order(d3.ascending)
                                .renderlet(function (table) {
                                    table.selectAll(".dc-table-group").classed("info", true);
                                });
            
             dc.renderAll();

             
                d3.selectAll(".pie-slice").call(pieTip);
                d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                    .on('mouseout', pieTip.hide);

                d3.selectAll("g.row").call(barTip);
                d3.selectAll("g.row").on('mouseover', barTip.show)
                    .on('mouseout', barTip.hide);
        
    });