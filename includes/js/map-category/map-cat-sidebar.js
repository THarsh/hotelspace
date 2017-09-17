// List with all markers.
var markerList = {};

//Master Marker List Obj
var allMarkers = {};

//ajax processing function to load markers
var operation_to_load_markers = 'loadMarkers';

var string_template = 1; //by default use string template 1 for the map pop up.

//<![CDATA[
// this variable will collect the html which will eventually be placed in the side_bar
var side_bar_html = "";

var gmarkers = [];
var gicons = [];
var map = null;

var iconDefault = SITE_FILES + 'images/markers.png';
var iconDefaultActive = SITE_FILES + 'images/markers-over.png';
var path = SITE_FILES + "images/map/";

var options = {
    alignBottom: false,
    boxClass: "ui-infobox",
    boxID: "tooltip",
    boxStyle: {
        width: '250px'
    },
    closeBoxMargin: "-16px -8px -11px 2px",
    closeBoxURL: SITE_FILES + "/images/map/close-map.png",
    disableAutoPan: false,
    enableEventPropagation: false,
    infoBoxClearance: new google.maps.Size(6, 6),
    isHidden: false,
    maxWidth: 0,
    pane: "floatPane",
    pixelOffset: new google.maps.Size(-140, 5),
    zIndex: null
};

var infowindow = new InfoBox(options);

var iconShadow = new google.maps.MarkerImage('http://www.google.com/mapfiles/shadow50.png',
    // The shadow image is larger in the horizontal dimension
    // while the position and offset are the same as for the main image.
    new google.maps.Size(37, 35),
    new google.maps.Point(0, 0),
    new google.maps.Point(9, 35));
var iconShape = {
    coord: [9, 0, 6, 1, 4, 2, 2, 4, 0, 8, 0, 12, 1, 14, 2, 16, 5, 19, 7, 23, 8, 26, 9, 30, 9, 34, 11, 34, 11, 30, 12, 26, 13, 24, 14, 21, 16, 18, 18, 16, 20, 12, 20, 8, 18, 4, 16, 2, 15, 1, 13, 0],
    type: 'poly'
};

function getMarkerImage(iconColor) {
    if ((typeof(iconColor) == "undefined") || (iconColor == null)) {
        iconColor = "red";
    }

    var icon = "pin-" + iconColor + ".png";

    var filename = ( $.inArray(icon, pinPointImages) >= 0 ) ? path + icon : iconDefault

	if(iconColor == 'hotel') {
	    var size1 = 40;
	    var size2 = 70;
	    filename = SITE_FILES + 'images/hotel-marker.png';
    } else {
	    var size1 = 22;
	    var size2 = 34;
    }

    if (!gicons[iconColor]) {
        gicons[iconColor] = new google.maps.MarkerImage(filename,
            // This marker is 20 pixels wide by 31 pixels tall.
            new google.maps.Size(size1, size2),
            // The origin for this image is 0,0.
            new google.maps.Point(0, 0),
            // The anchor for this image is at 6,20.
            new google.maps.Point(11, size2));
    }
    return gicons[iconColor];
}

function getMarkerHotel(iconColor) {
    if ((typeof(iconColor) == "undefined") || (iconColor == null)) {
        iconColor = "hotel";
    }
    if (!gicons[iconColor]) {
        gicons[iconColor] = new google.maps.MarkerImage(SITE_FILES + "/images/map/pin-" + iconColor + ".png",
            // This marker is 20 pixels wide by 34 pixels tall.
            new google.maps.Size(size1, size2),
            // The origin for this image is 0,0.
            new google.maps.Point(0, 0),
            // The anchor for this image is at 6,20.
            new google.maps.Point(20, size2));
    }
    return gicons[iconColor];
}

function smoothZoom(map, level, cnt, mode) {
    //alert('Count: ' + cnt + 'and Max: ' + level);

    // If mode is zoom in
    if (mode == true) {

        if (cnt >= level) {
            return;
        } else {
            var z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
                google.maps.event.removeListener(z);
                smoothZoom(map, level, cnt + 1, true);
            });
            setTimeout(function() {
                map.setZoom(cnt)
            }, 80);
        }
    } else {
        if (cnt <= level) {
            return;
        } else {
            var z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
                google.maps.event.removeListener(z);
                smoothZoom(map, level, cnt - 1, false);
            });
            setTimeout(function() {
                map.setZoom(cnt)
            }, 80);
        }
    }
}

// A function to create the marker and set up the event window
function createMarker(latlng, name, html, category, description) {

    var contentString = html;

	// If it's the hotel pin, let's put it above all the others
    var zValue;
    if (category == "hotel") {
    	zValue = 99999;
	} else{
		zValue = Math.round(latlng.lat() * -100000) << 5
	}

    var marker = new google.maps.Marker({
        position: latlng,
        icon: gicons[category],
        //shadow: iconShadow,
        map: map,
        title: name,
        optimized: false,
        zIndex: zValue
   });

    // === Store the category and name info as a marker properties ===
    marker.mycategory = category;
    marker.myname = name;
    gmarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
	    google.maps.event.trigger(infowindow, "closeclick");
	    if (category != "hotel") {
		    //Change the marker icon when clicked
	        marker.setIcon(iconDefaultActive);
        }
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        map.panTo(marker.getPosition());
        map.setZoom(15);
    });

    google.maps.event.addListener(infowindow, "closeclick", function() {
        //Change the marker icon back on close
        marker.setIcon(gicons[category]);
    });
}

// == shows all markers of a particular category, and ensures the checkbox is checked ==
function show(category) {
    for (var i = 0; i < gmarkers.length; i++) {
        if (gmarkers[i].mycategory == category) {
            gmarkers[i].setVisible(true);
        }
    }
    // == check the checkbox ==
}

// == hides all markers of a particular category, and ensures the checkbox is cleared ==
function hide(category) {
    for (var i = 0; i < gmarkers.length; i++) {
        if (gmarkers[i].mycategory == category) {
            gmarkers[i].setVisible(false);
        }
    }
    // == clear the checkbox ==
    $("#" + category + "box").removeClass('open');
    // == close the info window, in case its open on a marker that we just hid
    infowindow.close();
}

function hideAll(){
    $(pinCategories).each(function(i,e){
        if (e != 'hotel') {
            hide(e);
        }
    });
}

function showAll(){
    $(pinCategories).each(function(i,e){
        show(e);
    });
}

// == a checkbox has been clicked ==
function boxclick(box, category) {
    if (box.hasClass('open')) {
        show(category);
    } else {
        hide(category);
    }
}

function myclick(obj, i, category) {
    google.maps.event.trigger(infowindow, "closeclick");
    google.maps.event.trigger(gmarkers[i], "click");
    map.panTo(gmarkers[i].getPosition());
    map.setZoom(15);
    $('a.place').parent().removeClass('active');
    $(obj).parent().addClass('active');
}

function getToClick(obj) {

    var bis = $(obj).attr("data-link");
    var bisName = $(obj).attr("data-name");
    $.cookie("olGetTo", bis, {
        path: "/"
    });
    $.cookie("olGetToName", bisName, {
        path: "/"
    });
}

function getCategories() {

    downloadUrl("ajax/mapdata.xml", function(doc) {
        var xml = xmlParse(doc);
        markers = xml.documentElement.getElementsByTagName("marker");

        for (var i = 0; i < markers.length; i++) {
            // obtain the attribues of each marker
            var lat = parseFloat(markers[i].getAttribute("lat"));
            var lng = parseFloat(markers[i].getAttribute("lng"));

            var point = new google.maps.LatLng(lat, lng);

            var description = markers[i].getAttribute("description");
            var address = markers[i].getAttribute("address");
            var web = markers[i].getAttribute("web");
            var thumb = markers[i].getAttribute("thumb");
            var name = markers[i].getAttribute("name");
            var getDirections = '<a class="get-directions" href="https://www.google.com/maps?saddr='+hotelLat+","+hotelLng+'&daddr='+lat+","+lng+'" target="_blank">Get directions</a>';

            if (web === ''){
                webText = '';
            }
            else {
                webText = '<a class="get-to-link" data-name="'+name+'" data-link="'+address+'" onclick="getToClick(this)" href="'+web+'" target="_blank">Visit website</a>';
            }

            if (thumb === ''){
                thumbText = '';
            }
            else {
                thumbText = '<img class="thumb" src="'+thumb+'" />';
            }

            var html = "<div class='ui-infobox-content'>" + thumbText + "<b class='title'>" + name + "<\/b><p>" + description + "</p><p><b>" + address + "</b></p><p>" + getDirections + webText + "</p></div>";
            var category = markers[i].getAttribute("category");

            // create the marker
            var marker = createMarker(point, name, html, category);
        }

        // == show or hide the categories initially ==

        //var allCategories = ['hotel','attractions-entertainment', 'churches', 'dining', 'event-venues', 'hospitals','lgbt','museums','nightlife','performing-arts','shopping','sports-recreation','theatres','transportation','universities'];

        $(pinCategories).each(function(i,e){
            hide(e);
            //show(e);
        });

        $(pinCategories).each(function(i,e){
            makeSidebar(e);
            show(e);
        });

        function makeSidebar(category, description) {
            for (var i = 0; i < markers.length; i++) {
                var description = markers[i].getAttribute("description");
            }

            html = '';
            for (var i = 0; i < gmarkers.length; i++) {
                if (gmarkers[i].mycategory == category) {
                    html += '<li><span></span><a class="place" onclick="myclick(this, ' + i + ')" href="#">' + gmarkers[i].myname + '<\/a></\li>';
                }
            }
            $('#markers-sidebar').find('#'+category+'_items').html(html);
            $('#markers-sidebar').find(".markers-list").fadeIn()
        }


    });
}

function initialize() {

    $(pinCategories).each(function(idx,e){
        gicons[e] = getMarkerImage(e);
    });

    var styles = mapStyling;


    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });

    var myOptions = {
		scrollwheel: false,
        zoom: initZoom,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("myMap"), myOptions);

	// Close any open infowindows when clicking outside of them
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });

    // Ensure the map stays centered when we resize the browser
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    // Read the data

    //Add Hotel Pin
    loadHotelPin(hotelParams);

    getCategories();


}

google.maps.event.addDomListener(window, 'load', initialize);



function loadHotelPin($params) {

    var lat = $params.lat;
    var lng = $params.long;


    var point = new google.maps.LatLng(lat, lng);

    var description = $params.description;
    var thumb = $params.thumb;
    var name = $params.name;

    var thumbText =  (thumb === '') ? '' : '<img class="thumb" src="'+thumb+'" />';

    var html = "<div class='ui-infobox-content'>" + thumbText + "<b class='title'>" + name + "<\/b><p>" + description + "</p></div>";
    var category = 'hotel';

    // create the marker

    createMarker(point, name, html, category);

}

console.log("frontend");