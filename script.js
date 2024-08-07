const urlGEOJSON = 'https://data.opendevelopmentmekong.net/geoserver/ODMekong/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODMekong%3Aa4eb41a4-d806-4d20-b8aa-4835055a94c8&outputFormat=application%2Fjson';
const source = 'https://vietnam.opendevelopmentmekong.net/vi/';
const width = 800;
const height = 800;

d3.select('.container')
    .append('h1')
    .text('Viet Nam Map');

const svg = d3.select('.container')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'map')
                .attr('viewBox',[0, 0, width, width]);

d3.select('.container')
    .append('p')    
    .html(
        `<p>Source: <a href=${source} target='_blank' rel='noopener noreferrer'>Open Development Vietnam</a></p>`
    );

fetch(urlGEOJSON)
    .then(res => res.json())
    .then(data => {
        
    // Convert GeoJSON data into TopoJSON
    const topo = topojson.topology({vietnam : data}, 1000);
    
    // Convert TopoJSON back to GeoJSON for using D3.geoPath()
    const provinces = topojson.feature(topo, topo.objects.vietnam);
    // const country = topojson.mesh(topo, topo.objects.vietnam);

    const projection = d3.geoMercator()
                         .fitSize([width,height], provinces);
    
    const path = d3.geoPath().projection(projection);

    svg.append('g')
        .selectAll('path')
        .data(provinces.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'lightgrey')
        .attr('stroke', 'grey');
            
    // svg.append('path')
    //     .datum(country)
    //     .attr('fill', 'none')
    //     .attr('stroke', 'green')
    //     .attr('d', path)

    })
    .catch(err => console.log(err))
