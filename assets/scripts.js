function resizeWindow() {
    setTimeout(function () {
        equalize()
    }, 200), $("#home").length > 0
}
function scrollDown() {
}
function initializeMap(e, t, o) {
    defaultLatlng = new google.maps.LatLng(e, t), defaultZoom = o, myOptions = {
        zoom: o,
        center: defaultLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: !1,
        scrollwheel: !1,
        disableDoubleClickZoom: !1,
        backgroundColor: "#000000",
        styles: styles,
        panControl: !1,
        zoomControlOptions: {position: google.maps.ControlPosition.LEFT_CENTER}
    }, loadMap()
}
function smoothZoom(e, t, o, n) {
    if (1 == n) {
        if (o >= t)return;
        var a = google.maps.event.addListener(e, "zoom_changed", function (n) {
            google.maps.event.removeListener(a), smoothZoom(e, t, o + 1, !0)
        });
        setTimeout(function () {
            e.setZoom(o)
        }, 80)
    } else {
        if (t >= o)return;
        var a = google.maps.event.addListener(e, "zoom_changed", function (n) {
            google.maps.event.removeListener(a), smoothZoom(e, t, o - 1, !1)
        });
        setTimeout(function () {
            e.setZoom(o)
        }, 80)
    }
}
function loadMap() {
    map = new google.maps.Map(document.getElementById("myMap"), myOptions);
    var e = {
        content: "",
        disableAutoPan: !1,
        pixelOffset: new google.maps.Size(-140, 5),
        zIndex: null,
        closeBoxMargin: "-8px -8px -11px 2px",
        closeBoxURL: site_url + "assets/images/close.png",
        infoBoxClearance: new google.maps.Size(6, 6),
        isHidden: !1,
        pane: "floatPane",
        alignBottom: !1,
        enableEventPropagation: !1
    };
    infowindow = new InfoBox(e), google.maps.event.addDomListener(window, "resize", function () {
        map.setCenter(defaultLatlng)
    })
}
function viewAllMarkers() {
    clearOverlays(), loadMarker(hotel_marker), $(".pin-cat").each(function () {
        $(this).is(":checked") || this.click()
    })
}
function clickCat(e, t) {
    $.each(allMarkers[e], function () {
        t ? loadMarker(this) : unloadMarker(this)
    })
}
function loadMarker(e) {
    var t = e.icon, o = new google.maps.LatLng(e.lat, e["long"]);
    if ("" == e.icon || !e.hasOwnProperty("icon"))var t = "markers.png";
    var n = new google.maps.Marker({id: e.id, map: map, title: e.name, icon: t, position: o}), a = t;
    if ("0" == n.id)var i = site_url + "assets/images/markers-over.png"; else var i = site_url + "assets/images/markers-over.png";
    google.maps.event.addListener(n, "mouseover", function () {
        n.setIcon(i)
    }), google.maps.event.addListener(n, "mouseout", function () {
        n.setIcon(a)
    }), markerList[n.id] = n, google.maps.event.addListener(n, "click", function () {
        n.setIcon(i), google.maps.event.addListener(n, "mouseover", function () {
            n.setIcon(i)
        }), google.maps.event.addListener(n, "mouseout", function () {
            n.setIcon(i)
        }), showMarker(n.id, e.name, e.thumb, e.description, e.url), map.panTo(n.getPosition())
    }), google.maps.event.addListener(infowindow, "closeclick", function () {
        n.setIcon(a), google.maps.event.addListener(n, "mouseover", function () {
            n.setIcon(i)
        }), google.maps.event.addListener(n, "mouseout", function () {
            n.setIcon(a)
        })
    })
}
function loadMarkerwithBox(e) {
    var t = (e.icon, new google.maps.LatLng(e.lat, e["long"]));
    if ("" == e.icon || !e.hasOwnProperty("icon"));
    var o = new google.maps.Marker({
        id: e.id,
        map: map,
        title: e.name,
        icon: SITE_FILES + "images/markers-over.png",
        position: t
    });
    markerList[o.id] = o, showMarker(o.id, e.name, e.thumb, e.description, e.url), map.panTo(o.getPosition()), google.maps.event.addListener(infowindow, "closeclick", function () {
        icona = SITE_FILES + "images/markers.png", iconb = SITE_FILES + "images/markers-over.png", o.setIcon(icona), google.maps.event.addListener(o, "mouseover", function () {
            o.setIcon(iconb)
        }), google.maps.event.addListener(o, "mouseout", function () {
            o.setIcon(icona)
        })
    })
}
function showMarker(e, t, o, n, a) {
    var i = markerList[e];
    if (i) {
        var s = '<div class="map_popup"><div class="desc"><h2>' + t + "</h2><p>" + n + "</p></div></div>";
        infowindow.setContent(s), infowindow.open(map, i)
    } else alert("Error marker not found: " + e)
}
function clearOverlays() {
    if (markerList)for (i in markerList)markerList[i].setMap(null), delete markerList[i];
    $(".infoBox").length > 0 && infowindow.close(), $(".pin-cat").each(function () {
        $(this).prop("checked", !1)
    })
}
function unloadMarker(e) {
    markerList[e.id] && (markerList[e.id].setMap(null), delete markerList[e.id]), $(".infoBox").length > 0 && infowindow.close()
}
$(document).ready(function () {
    if ($(window).resize(function (e) {
            resizeWindow()
        }), resizeWindow(), $(window).scroll(function (e) {
            scrollDown();
            $(document).scrollTop()
        }), $(".arrow-home").click(function (e) {
            $("body, html").animate({scrollTop: $(window).height() - $("header").outerHeight()}, 800, "easeOutExpo")
        }), $("#primary-nav li").hover(function () {
            $(this).addClass("hover"), $("ul.submenu", this).fadeIn(200)
        }, function () {
            $(this).removeClass("hover"), $("ul.submenu", this).fadeOut(200)
        }), $("#primary-nav li").each(function () {
            $(this).children("ul").length > 0 && $(this).addClass("dropdown")
        }), $("#content .content li, .landing-page ul.sym-inline-list li").wrapInner("<span></span>"), $(".sym-slides").slick(), $(".all-rooms-home").slick({
            arrows: !0,
            dots: !0,
            autoplay: !1,
            autoplaySpeed: 4e3,
            speed: 500,
            fade: !0,
            accessibility: !1,
            prevArrow: $(".prev-rooms"),
            nextArrow: $(".next-rooms")
        }), $(".book-trigger").on("click", function (e) {
            $("#booking-form").animate({right: "0"}, 500)
        }), $("#booking-form .close").on("click", function (e) {
            $("#booking-form").animate({right: "-430"}, 500)
        }), $(".step1 .btn").on("click", function (e) {
            var t = $(this).attr("href");
            return $(".step1").fadeOut(500, function () {
                $(t).fadeIn()
            }), !1
        }), $(".hide-hotels").on("click", function (e) {
            return $(".step2 .list").fadeOut(500, function () {
                $(".step1").fadeIn()
            }), !1
        }), $(".marker-section.bars h3").html("Bars &amp; Pubs"), $(".marker-section.nightlife h3").html("Properties"), $(".read-more").click(function (e) {
            $(this).parent().next("div.full-blog").slideToggle();
            var t = $(this).text();
            $(this).text("Show Less -" == t ? "Read More +" : "Show Less -")
        }), $(".tabs a").on("click", function (e) {
            var t = $(this).attr("href");
            return $(".tabs a").removeClass("active"), $(this).addClass("active"), $(".rooms-list").hide(0, function () {
                $(t).show(), $(t).children(".room").first().show(), $(".filter a").first().addClass("active"), $(".sym-slides").slick("setPosition")
            }), !1
        }), $(".filter a").on("click", function (e) {
            var t = $(this).attr("href");
            return $(".filter a").removeClass("active"), $(this).addClass("active"), $(".room").hide(0, function () {
                $(t).show(), $(".sym-slides").slick("setPosition")
            }), !1
        }), $(".countdown").length > 0) {
        var e = $("#day").val(), t = $("#month").val(), o = $("#year").val(), n = $("#hour").val(), a = $("#min").val(), i = $("#sec").val();
        setTimeout(function () {
            $("#countdown_dashboard").countDown({
                targetDate: {day: e, month: t, year: o, hour: n, min: a, sec: i},
                omitWeeks: !0
            })
        }, 200)
    }
    setTimeout(function () {
        $(".event-inner.text-center a").contents().unwrap()
    }, 500), $(".book-now").on("click", function () {
        ga("send", "event", "reservations", "click", "book now")
    }), $("body#map-category-sidebar #content").prepend('<a class="btn return-from-map" href="javascript:history.back()">« Back to previous page</a>'), $("#CheckIn").datepicker({
        showOn: "both",
        buttonImage: SITE_FILES + "images/icon-calendar.png",
        buttonImageOnly: !0,
        changeMonth: !0,
        numberOfMonths: 2,
        dateFormat: "yy-mm-dd",
        minDate: 0,
        onSelect: function (e) {
            getDate = $(this).datepicker("getDate"), newDate = new Date(getDate.getTime()), newDate.setDate(newDate.getDate() + 3), $("#CheckOut").datepicker("setDate", newDate), $("#CheckOut").datepicker("option", "minDate", e)
        }
    }), $("#CheckOut").datepicker({
        showOn: "both",
        buttonImage: SITE_FILES + "images/icon-calendar.png",
        buttonImageOnly: !0,
        changeMonth: !0,
        numberOfMonths: 2,
        dateFormat: "yy-mm-dd",
        onSelect: function (e) {
            $("#CheckIn").datepicker("option", "maxDate", e)
        }
    }), $("#CheckIn2").datepicker({
        showOn: "both",
        buttonImage: SITE_FILES + "images/icon-calendar.png",
        buttonImageOnly: !0,
        changeMonth: !0,
        numberOfMonths: 2,
        minDate: 0,
        dateFormat: "yy-mm-dd",
        onSelect: function (e) {
            getDate = $(this).datepicker("getDate"), newDate = new Date(getDate.getTime()), newDate.setDate(newDate.getDate() + 3), $("#CheckOut2").datepicker("setDate", newDate), $("#CheckOut2").datepicker("option", "minDate", e)
        }
    }), $("#CheckOut2").datepicker({
        showOn: "both",
        buttonImage: SITE_FILES + "images/icon-calendar.png",
        buttonImageOnly: !0,
        changeMonth: !0,
        numberOfMonths: 2,
        dateFormat: "yy-mm-dd",
        onSelect: function (e) {
            $("#CheckIn2").datepicker("option", "maxDate", e)
        }
    })
}), function (o) {
    o.fn.countDown = function (e) {
        return config = {}, o.extend(config, e), diffSecs = this.setCountDown(config), config.onComplete && o.data(o(this)[0], "callback", config.onComplete), config.omitWeeks && o.data(o(this)[0], "omitWeeks", config.omitWeeks), o("#" + o(this).attr("id") + " .digit").html('<div class="top"></div><div class="bottom"></div>'), o(this).doCountDown(o(this).attr("id"), diffSecs, 500), this
    }, o.fn.stopCountDown = function () {
        clearTimeout(o.data(this[0], "timer"))
    }, o.fn.startCountDown = function () {
        this.doCountDown(o(this).attr("id"), o.data(this[0], "diffSecs"), 500)
    }, o.fn.setCountDown = function (e) {
        var t = new Date;
        e.targetDate ? t = new Date(e.targetDate.month + "/" + e.targetDate.day + "/" + e.targetDate.year + " " + e.targetDate.hour + ":" + e.targetDate.min + ":" + e.targetDate.sec + (e.targetDate.utc ? " UTC" : "")) : e.targetOffset && (t.setFullYear(e.targetOffset.year + t.getFullYear()), t.setMonth(e.targetOffset.month + t.getMonth()), t.setDate(e.targetOffset.day + t.getDate()), t.setHours(e.targetOffset.hour + t.getHours()), t.setMinutes(e.targetOffset.min + t.getMinutes()), t.setSeconds(e.targetOffset.sec + t.getSeconds()));
        var n = new Date;
        return diffSecs = Math.floor((t.valueOf() - n.valueOf()) / 1e3), o.data(this[0], "diffSecs", diffSecs), diffSecs
    }, o.fn.doCountDown = function (n, a, i) {
        $this = o("#" + n), 0 >= a && (a = 0, o.data($this[0], "timer") && clearTimeout(o.data($this[0], "timer"))), secs = a % 60, mins = Math.floor(a / 60) % 60, hours = Math.floor(a / 60 / 60) % 24, 1 == o.data($this[0], "omitWeeks") ? (days = Math.floor(a / 60 / 60 / 24), weeks = Math.floor(a / 60 / 60 / 24 / 7)) : (days = Math.floor(a / 60 / 60 / 24) % 7, weeks = Math.floor(a / 60 / 60 / 24 / 7)), $this.dashChangeTo(n, "seconds_dash", secs, i ? i : 800), $this.dashChangeTo(n, "minutes_dash", mins, i ? i : 1200), $this.dashChangeTo(n, "hours_dash", hours, i ? i : 1200), $this.dashChangeTo(n, "days_dash", days, i ? i : 1200), $this.dashChangeTo(n, "weeks_dash", weeks, i ? i : 1200), o.data($this[0], "diffSecs", a), a > 0 ? (e = $this, t = setTimeout(function () {
                e.doCountDown(n, a - 1)
            }, 1e3), o.data(e[0], "timer", t)) : (cb = o.data($this[0], "callback")) && o.data($this[0], "callback")()
    }, o.fn.dashChangeTo = function (e, t, n, a) {
        $this = o("#" + e);
        for (var i = $this.find("." + t + " .digit").length - 1; i >= 0; i--) {
            var s = n % 10;
            n = (n - s) / 10, $this.digitChangeTo("#" + $this.attr("id") + " ." + t + " .digit:eq(" + i + ")", s, a)
        }
    }, o.fn.digitChangeTo = function (e, t, n) {
        n || (n = 800), o(e + " div.top").html() != t + "" && (o(e + " div.top").css({display: "none"}), o(e + " div.top").html(t ? t : "0").slideDown(n), o(e + " div.bottom").animate({height: ""}, n, function () {
            o(e + " div.bottom").html(o(e + " div.top").html()), o(e + " div.bottom").css({
                display: "block",
                height: ""
            }), o(e + " div.top").hide().slideUp(10)
        }))
    }
}(jQuery);
var defaultLatlng = "", defaultZoom = "13", map, infowindow, markerList = {}, allMarkers = {}, operation_to_load_markers = "loadMarkers", string_template = 1, styles = [{
    featureType: "all",
    elementType: "geometry.fill",
    stylers: [{weight: "2.00"}]
}, {featureType: "all", elementType: "geometry.stroke", stylers: [{color: "#9c9c9c"}]}, {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{visibility: "on"}]
}, {featureType: "all", elementType: "labels.text.fill", stylers: [{color: "#3c414c"}]}, {
    featureType: "landscape",
    elementType: "all",
    stylers: [{color: "#dbdde2"}]
}, {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{color: "#ffffff"}]
}, {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{color: "#dbdde2"}]
}, {featureType: "poi", elementType: "all", stylers: [{visibility: "off"}, {gamma: "0.51"}]}, {
    featureType: "road",
    elementType: "all",
    stylers: [{saturation: -100}, {lightness: 45}]
}, {featureType: "road", elementType: "geometry.fill", stylers: [{color: "#eeeeee"}]}, {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{color: "#a7adb9"}]
}, {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{color: "#ffffff"}, {visibility: "off"}]
}, {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{visibility: "simplified"}]
}, {featureType: "road.arterial", elementType: "labels.icon", stylers: [{visibility: "off"}]}, {
    featureType: "transit",
    elementType: "all",
    stylers: [{visibility: "off"}]
}, {featureType: "water", elementType: "all", stylers: [{color: "#747d91"}, {visibility: "on"}]}, {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{color: "#747d91"}]
}, {featureType: "water", elementType: "labels.text.fill", stylers: [{color: "#070707"}]}, {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{color: "#ffffff"}]
}];